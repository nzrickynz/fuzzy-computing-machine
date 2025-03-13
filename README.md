# Stashio

A modern web application for managing and organizing your text snippets, hashtags, and project references.

## Features

- Create and manage text stashes with hashtags and project mentions
- Mark stashes as used/unused
- Filter stashes by hashtags and projects
- Modern, responsive UI with dark theme
- User authentication and personal stash management

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- JWT Authentication

## Getting Started

1. Clone the repository
```bash
git clone [your-repo-url]
cd stashio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database and JWT settings
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

## Development

The application is built with Next.js and uses:
- Server Components for improved performance
- Client Components where interactivity is needed
- Prisma for type-safe database access
- Tailwind CSS for styling

## License

MIT 