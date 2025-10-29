# XNET Intranet - Project Complete

## Built Features

 Professional intranet landing page with modern, subdued design (grey, white, black, blue, purple, aqua)
 Application dashboard with SSO and direct redirect capabilities
 File library with upload, categorization, and descriptions
 Admin backend for managing applications, files, and categories
 MariaDB database integration via Prisma ORM
 Authentication system for admin access
 Responsive design with glassmorphism effects
 Full CRUD operations for all entities

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with custom theme
- Prisma ORM + MariaDB
- bcrypt authentication
- Server-side file uploads

## Quick Start

1. Install dependencies: `npm install --legacy-peer-deps`
2. Configure `.env` with your MariaDB credentials
3. Run migrations: `npx prisma migrate dev --name init`
4. Create admin user (see SETUP.md)
5. Start server: `npm run dev`
6. Access at `http://localhost:3000`

## Documentation

- [README.md](./README.md) - Full documentation
- [SETUP.md](./SETUP.md) - Quick setup guide
- [scripts/hash-password.js](./scripts/hash-password.js) - Generate password hashes
- [scripts/seed-sample-data.sql](./scripts/seed-sample-data.sql) - Sample data

## Next Steps

- Configure your MariaDB database
- Run the database migration
- Create your admin user
- Add your applications and files
- Customize branding and colors as needed
