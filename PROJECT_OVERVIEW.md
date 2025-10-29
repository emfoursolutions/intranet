# XNET Intranet Platform - Overview

## What You're Getting

A complete, production-ready intranet portal built with modern web technologies. Professional design with subdued colors (grey, white, black, blue, purple, aqua) perfect for corporate environments.

## Key Pages

### 1. Landing Page (`/`)
- Hero section with branding
- Application grid with filtering by category
- File library with search and category filters
- Clean navigation
- Responsive design

### 2. Admin Dashboard (`/admin`)
- Overview statistics
- Quick access to management sections
- Professional admin interface

### 3. Applications Management (`/admin/applications`)
- Add/edit/delete applications
- Set SSO enabled status
- Custom icons (emoji) and colors
- Categorization and sorting
- Direct or SSO redirect URLs

### 4. Files Management (`/admin/files`)
- Upload files (up to 50MB default)
- Add descriptions
- Assign to categories
- Edit metadata
- Delete files (removes from filesystem)

### 5. Categories Management (`/admin/categories`)
- Create file categories
- Custom colors and icons
- Shows file count per category
- Delete with cascade warning

## Design Features

### Color Palette
- **Primary Blue**: #0ea5e9 (main actions, links)
- **Accent Purple**: #a78bfa (secondary elements)
- **Accent Aqua**: #22d3ee (highlights)
- **Dark Backgrounds**: #0a0a0f → #32323f (gradients)
- **Text**: White/grey scale for readability

### Visual Effects
- Glassmorphism cards with backdrop blur
- Smooth hover transitions
- Gradient backgrounds
- Professional spacing and typography
- Icon-based navigation

## Database Schema

### Tables
1. **users** - Admin authentication
   - id, email, passwordHash, role, timestamps

2. **categories** - File organization
   - id, name, color, icon, timestamps

3. **files** - Uploaded documents
   - id, name, description, filePath, fileSize, mimeType, categoryId, timestamps

4. **applications** - Internal app links
   - id, name, description, url, ssoEnabled, icon, category, color, sortOrder, timestamps

## API Architecture

### RESTful Endpoints
- `/api/applications` - CRUD for applications
- `/api/categories` - CRUD for categories
- `/api/files` - Upload and manage files
- `/api/auth/login` - Admin authentication
- `/api/auth/register` - Initial setup (disabled after first user)

## File Upload System

- Server-side validation
- Configurable size limits (default 50MB)
- Local filesystem storage (`/public/uploads/`)
- Metadata stored in database
- Automatic file serving via Next.js

## Security Features

- Password hashing with bcrypt (10 rounds)
- Environment-based configuration
- File size limits
- SQL injection protection via Prisma
- Type-safe API routes with TypeScript

## Browser Support

Modern browsers with:
- ES2017+ JavaScript
- CSS Grid and Flexbox
- Backdrop filter support

## Performance

- Server-side rendering with Next.js
- Optimized images
- Lazy loading components
- Efficient database queries via Prisma
- CDN-ready static assets

## Customization Points

### Easy to Change
1. **Colors** - Edit `tailwind.config.ts`
2. **Branding** - Update logo/name in `app/page.tsx` and `app/admin/page.tsx`
3. **File size limits** - Change `MAX_FILE_SIZE` in `.env`
4. **Upload directory** - Change `UPLOAD_DIR` in `.env`

### Moderate Complexity
1. **Add new fields** - Update Prisma schema, migrate, update forms
2. **Change database** - Update Prisma provider, connection string
3. **Add authentication UI** - Create login page, implement session management

### Advanced
1. **Add SSO integration** - Implement OAuth/SAML providers
2. **Cloud storage** - Replace local filesystem with S3/Azure/GCP
3. **Real-time updates** - Add WebSocket or polling
4. **Advanced permissions** - Role-based access control

## File Structure Highlights

```
xnet_landing/
├── app/
│   ├── page.tsx              # Main landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles + utilities
│   ├── admin/                # Admin section
│   │   ├── page.tsx         # Dashboard
│   │   ├── applications/    # App management
│   │   ├── categories/      # Category management
│   │   └── files/           # File management
│   └── api/                  # API routes
│       ├── applications/    # App CRUD
│       ├── categories/      # Category CRUD
│       ├── files/          # File operations
│       └── auth/           # Authentication
├── components/
│   ├── ApplicationsGrid.tsx  # App display grid
│   └── FileLibrary.tsx      # File browser
├── lib/
│   ├── prisma.ts            # DB client
│   └── auth.ts              # Auth utilities
├── prisma/
│   └── schema.prisma        # Database schema
└── scripts/
    ├── hash-password.js     # Password utility
    └── seed-sample-data.sql # Sample data
```

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **View in browser**: `http://localhost:3000`
3. **Make changes**: Files auto-reload
4. **Manage database**: `npx prisma studio`
5. **Update schema**: Edit schema → `npx prisma migrate dev`

## Production Checklist

- [ ] Set secure `NEXTAUTH_SECRET`
- [ ] Configure production database
- [ ] Set up HTTPS
- [ ] Add authentication middleware to admin routes
- [ ] Configure file storage (S3/CDN)
- [ ] Set up database backups
- [ ] Add monitoring/logging
- [ ] Configure rate limiting
- [ ] Add file type validation
- [ ] Set up CI/CD pipeline

## Support Files

- **README.md** - Comprehensive documentation
- **SETUP.md** - Quick start guide
- **.env.example** - Environment template
- **scripts/** - Utility scripts for setup

## Technologies Used

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 14.2.0 |
| Language | TypeScript | 5.0+ |
| Styling | Tailwind CSS | 3.4.0 |
| Database | MariaDB | Any via Prisma |
| ORM | Prisma | 5.20.0 |
| Auth | bcryptjs | 2.4.3 |
| Runtime | Node.js | 18+ |

## What's NOT Included

To keep the codebase clean and maintainable:

- ❌ Login UI (admin authentication is API-only currently)
- ❌ User roles beyond admin/user distinction
- ❌ Email notifications
- ❌ Activity logs/audit trail
- ❌ File versioning
- ❌ Advanced search/filtering
- ❌ Mobile app
- ❌ Multi-tenancy

These can be added based on your specific needs.

## Getting Help

1. Check [README.md](./README.md) for detailed documentation
2. Review [SETUP.md](./SETUP.md) for setup instructions
3. Use `npx prisma studio` to inspect the database
4. Check Next.js logs for errors
5. Verify `.env` configuration

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npx prisma studio       # Open database GUI
npx prisma migrate dev  # Create migration
npx prisma generate     # Regenerate client
npx prisma db push      # Push schema without migration

# Utilities
node scripts/hash-password.js <password>  # Generate hash
```

---

**Built for**: Professional intranet environments
**Design**: Modern, clean, subdued corporate aesthetic
**Status**: Ready for setup and deployment
