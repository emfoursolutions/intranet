-- Sample data for XNET Intranet
-- Run this after creating your admin user

-- Categories
INSERT INTO categories (id, name, color, icon, created_at, updated_at) VALUES
('cat001', 'Documents', '#0ea5e9', '📄', NOW(), NOW()),
('cat002', 'Images', '#a78bfa', '🖼️', NOW(), NOW()),
('cat003', 'Videos', '#22d3ee', '🎬', NOW(), NOW()),
('cat004', 'Templates', '#0369a1', '📋', NOW(), NOW()),
('cat005', 'Policies', '#075985', '📜', NOW(), NOW());

-- Applications
INSERT INTO applications (id, name, description, url, sso_enabled, icon, category, color, sort_order, created_at, updated_at) VALUES
('app001', 'Email', 'Company email portal with calendar and contacts', 'https://mail.example.com', true, '📧', 'Communication', '#0ea5e9', 1, NOW(), NOW()),
('app002', 'HR Portal', 'Human resources, payroll, and benefits management', 'https://hr.example.com', true, '👥', 'Internal', '#a78bfa', 2, NOW(), NOW()),
('app003', 'Wiki', 'Internal knowledge base and documentation', 'https://wiki.example.com', false, '📚', 'Resources', '#22d3ee', 3, NOW(), NOW()),
('app004', 'Project Management', 'Task tracking and project collaboration', 'https://projects.example.com', true, '📊', 'Productivity', '#0369a1', 4, NOW(), NOW()),
('app005', 'Time Tracking', 'Log hours and manage timesheets', 'https://time.example.com', true, '⏱️', 'Productivity', '#075985', 5, NOW(), NOW()),
('app006', 'Support Desk', 'IT support and helpdesk tickets', 'https://support.example.com', false, '🎫', 'Support', '#0284c7', 6, NOW(), NOW()),
('app007', 'Code Repository', 'Git repository management', 'https://git.example.com', true, '💻', 'Development', '#a78bfa', 7, NOW(), NOW()),
('app008', 'Analytics', 'Business intelligence and reporting', 'https://analytics.example.com', true, '📈', 'Business', '#22d3ee', 8, NOW(), NOW());
