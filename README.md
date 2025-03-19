# Stashio

Your personal code stash for capturing and organizing code snippets, ideas, and tasks.

## About

Stashio helps you capture and organize your code snippets efficiently, with support for hashtags and project organization.

## Tech Stack

- Next.js 14 (App Router)
- Supabase (Auth & Database)
- Prisma (ORM)
- TypeScript
- Tailwind CSS

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/nzrickynz/fuzzy-computing-machine.git
cd fuzzy-computing-machine
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your values:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
POSTGRES_PRISMA_URL=your_supabase_connection_string
POSTGRES_URL_NON_POOLING=your_supabase_direct_connection
```

5. Generate Prisma Client
```bash
npx prisma generate
```

6. Push database schema
```bash
npx prisma db push
```

7. Run the development server
```bash
npm run dev
```

## Deployment

The application is automatically deployed to Vercel when changes are pushed to the main branch.

### Environment Variables (Vercel)

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `POSTGRES_PRISMA_URL`: PostgreSQL connection string (pooled)
- `POSTGRES_URL_NON_POOLING`: PostgreSQL direct connection string

## Features

- Authentication with Supabase
- Create and organize code snippets
- Tag snippets with hashtags
- Organize snippets by projects
- Track usage of snippets
- Real-time updates
- Responsive design
