# Real Estate Website Monorepo

This is a full-stack real estate website project with the following stack:

- **Frontend**: React + Ant Design
- **Backend**: NestJS
- **Database**: PostgreSQL
- **Shared**: TypeScript types

## Features
- Admin users can log in and manage property listings
- Regular users can browse listings without logging in (optional login supported)
- Role-based authentication and authorization

## Project Structure
```
real-estate-monorepo/
├── apps/
│   ├── admin-frontend/      # React + Ant Design admin dashboard
│   ├── public-frontend/     # React + Ant Design public site
│   └── backend/             # NestJS backend API
├── packages/
│   └── shared-types/        # Shared TypeScript types
├── database/                # Database migrations and seeders
└── README.md
```

## Getting Started
Instructions for setup and running each app will be provided after scaffolding.

## start backend in server
ssh -l root 121.43.99.72

pm2 start npm --name "backend" -- start:prod