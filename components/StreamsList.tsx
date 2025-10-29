// ABOUTME: Component displaying live MediaMTX streams
// ABOUTME: Shows stream name, type, and available tracks with auto-refresh
'use client';

import { useEffect, useState } from 'react';

interface Stream {
  name: string;
  type: string;
  tracks: string[];
  ready: boolean;
  readyTime: string;
  bytesReceived: number;
  bytesSent: number;
  readers: number;
}

interface StreamsData {
  itemCount: number;
  streams: Stream[];
}

export default function StreamsList() {
  const [data, setData] = useState<StreamsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchStreams();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchStreams();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchStreams = async () => {
    try {
      const response = await fetch('/api/streams');
      if (response.ok) {
        const streamData = await response.json();
        setData(streamData);
        setError(null);
        setLastUpdate(new Date());
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch streams');
      }
    } catch (err) {
      console.error('Error fetching streams:', err);
      setError('Failed to connect to stream server');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'rtspsession':
        return '📹';
      case 'rtmpsession':
        return '🎥';
      case 'hlssession':
        return '📺';
      default:
        return '🎬';
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'rtspsession':
        return 'RTSP';
      case 'rtmpsession':
        return 'RTMP';
      case 'hlssession':
        return 'HLS';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-red-400 mb-2">⚠️ {error}</p>
        <button
          onClick={fetchStreams}
          className="text-sm text-primary-400 hover:text-primary-300 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2">
            <span className="text-sm text-gray-400">Active Streams:</span>
            <span className="ml-2 text-lg font-bold text-white">{data?.itemCount || 0}</span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        <button
          onClick={fetchStreams}
          className="text-gray-400 hover:text-white transition-colors"
          title="Refresh"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Streams Grid */}
      {data && data.streams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.streams.map((stream, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl p-5 border border-white/10 hover:border-primary-500/50 transition-all duration-300"
            >
              {/* Status Indicator */}
              {stream.ready && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-green-400">Live</span>
                  </div>
                </div>
              )}

              {/* Stream Info */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center text-2xl">
                  {getTypeIcon(stream.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-white truncate">
                    {stream.name}
                  </h4>
                  <span className="inline-block text-xs px-2 py-1 rounded bg-primary-600/30 text-primary-300">
                    {getTypeLabel(stream.type)}
                  </span>
                </div>
              </div>

              {/* Tracks */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Tracks:</p>
                <div className="flex flex-wrap gap-1">
                  {stream.tracks.map((track, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded bg-white/5 text-gray-300"
                    >
                      {track}
                    </span>
                  ))}
                  {stream.tracks.length === 0 && (
                    <span className="text-xs text-gray-500">No tracks</span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Received:</span>
                  <p className="text-white font-medium">{formatBytes(stream.bytesReceived)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Viewers:</span>
                  <p className="text-white font-medium">{stream.readers}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No active streams</p>
        </div>
      )}
    </div>
  );
}
