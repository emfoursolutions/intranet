# XNET Intranet Landing Page

A professional intranet portal with file management and application dashboard capabilities. Built with Next.js, TypeScript, Tailwind CSS, and MariaDB.

## Features

- **Application Dashboard**: Manage and access internal applications with SSO/direct redirect support
- **File Library**: Upload, categorize, and manage company files with descriptions
- **Category Management**: Organize files with custom categories, colors, and icons
- **Admin Backend**: Full CRUD interface for managing all content
- **Modern Design**: Subdued professional aesthetic with grey, white, black, blue, purple, and aqua colors
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MariaDB with Prisma ORM
- **Authentication**: Basic password authentication with bcrypt
- **File Upload**: Server-side file handling with local storage

## Prerequisites

- Node.js 18+ and npm
- MariaDB 10.3+
- Git

## Installation

### 1. Clone and Install Dependencies

```bash
cd xnet_landing
npm install
```

### 2. Database Setup

Create a database in MariaDB:

```sql
CREATE DATABASE xnet_landing;
CREATE USER 'xnet_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON xnet_landing.* TO 'xnet_user'@'localhost';
GRANT CREATE ON *.* TO 'xnet_user'@'localhost';
FLUSH PRIVILEGES;
```

**Note**: The `GRANT CREATE ON *.*` is required for Prisma to create a shadow database during migrations. This is a temporary database Prisma uses to validate migrations.

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
DATABASE_URL="mysql://xnet_user:your_password@localhost:3306/xnet_landing"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
MAX_FILE_SIZE=52428800
UPLOAD_DIR="./public/uploads"
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 4. Database Migration

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

This will create the following tables:
- `users` - Admin users
- `categories` - File categories
- `files` - Uploaded files with metadata
- `applications` - Internal applications/links

### 5. Create Admin User

You can create an admin user in two ways:

**Option A: Using Prisma Studio**

```bash
npx prisma studio
```

Navigate to the `users` table and create a user with:
- Email: your email
- Password Hash: Use bcrypt to hash your password
- Role: "admin"

**Option B: Using the API** (after starting the server)

The first time you access the site, you can register via `/api/auth/register` (this endpoint is only available when no users exist).

### 6. Create Upload Directory

```bash
mkdir -p public/uploads
```

### 7. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Admin Dashboard

Access the admin panel at `/admin` to manage:

1. **Applications** (`/admin/applications`)
   - Add internal applications with names, URLs, descriptions
   - Set SSO enabled status
   - Assign custom icons (emoji) and colors
   - Categorize and order applications

2. **Files** (`/admin/files`)
   - Upload files with descriptions
   - Assign files to categories
   - Edit file metadata
   - Delete files (removes from filesystem)

3. **Categories** (`/admin/categories`)
   - Create categories for organizing files
   - Set custom colors and icons
   - Edit and delete categories

### Public Landing Page

The main landing page (`/`) displays:
- Company branding and navigation
- Application grid with filtering
- File library with search and category filters
- Professional, modern design

## Project Structure

```
xnet_landing/
├── app/
│   ├── api/                 # API routes
│   │   ├── applications/    # Application CRUD
│   │   ├── categories/      # Category CRUD
│   │   ├── files/          # File upload/management
│   │   └── auth/           # Authentication
│   ├── admin/              # Admin pages
│   │   ├── applications/
│   │   ├── categories/
│   │   └── files/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ApplicationsGrid.tsx
│   └── FileLibrary.tsx
├── lib/                    # Utilities
│   ├── prisma.ts          # Prisma client
│   └── auth.ts            # Auth helpers
├── prisma/
│   └── schema.prisma      # Database schema
└── public/
    └── uploads/           # Uploaded files
```

## API Endpoints

### Applications
- `GET /api/applications` - List all applications
- `POST /api/applications` - Create application
- `PUT /api/applications/[id]` - Update application
- `DELETE /api/applications/[id]` - Delete application

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Files
- `GET /api/files` - List all files
- `POST /api/files` - Upload file (multipart/form-data)
- `PUT /api/files/[id]` - Update file metadata
- `DELETE /api/files/[id]` - Delete file

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create first admin (setup only)

## Configuration

### File Upload Limits

Adjust `MAX_FILE_SIZE` in `.env` (in bytes):
- Default: 52428800 (50 MB)

### Color Palette

The design uses a subdued professional palette defined in `tailwind.config.ts`:
- Primary: Blue tones (#0ea5e9)
- Accent Purple: #a78bfa
- Accent Aqua: #22d3ee
- Dark backgrounds: #0a0a0f to #32323f
- Light text: Greys and whites

### Database

The app uses MariaDB via Prisma ORM. To use a different database:

1. Update `provider` in `prisma/schema.prisma`
2. Update `DATABASE_URL` in `.env`
3. Run `npx prisma migrate dev`

## Development

### Database Management

```bash
# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate Prisma Client after schema changes
npx prisma generate
```

### Building for Production

```bash
npm run build
npm start
```

## Deployment Considerations

- Set secure `NEXTAUTH_SECRET` in production
- Use environment variables for all sensitive data
- Consider using cloud storage (S3, etc.) for files instead of local filesystem
- Add proper authentication middleware for admin routes
- Enable HTTPS
- Set up proper backup for database and uploaded files
- Configure file size limits based on your needs

## Security Notes

- Admin routes currently rely on client-side checks only. Add server-side middleware for production.
- File uploads are stored locally. Validate file types and scan for malware in production.
- Implement rate limiting for API endpoints.
- Consider adding CSRF protection.
- Use HTTPS in production environments.

## License

Private internal use only.
