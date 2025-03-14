# BrainRepo

Your digital brain for capturing thoughts, ideas, and tasks instantly.

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

3. Copy environment variables
```bash
cp .env.example .env.local
```

4. Update environment variables in `.env.local` with your values

5. Run the development server
```bash
npm run dev
```

## Deployment

### Staging Environment (staging.brainrepo.io)

The staging environment is automatically deployed when changes are pushed to the `staging` branch.

1. Create and switch to staging branch
```bash
git checkout -b staging
```

2. Push changes to staging
```bash
git push origin staging
```

3. Vercel will automatically deploy to staging.brainrepo.io

### Production Environment (brainrepo.io)

Production is automatically deployed when changes are merged into the `main` branch.

1. Create a pull request from `staging` to `main`
2. Review changes
3. Merge pull request
4. Vercel will automatically deploy to brainrepo.io

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Full URL of the application
- `NEXTAUTH_SECRET`: Random string for session encryption

Optional environment variables:

- `SMTP_HOST`: SMTP server host for email
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASSWORD`: SMTP password
- `SMTP_FROM`: From email address

## Branching Strategy

- `main`: Production branch, deploys to brainrepo.io
- `staging`: Staging branch, deploys to staging.brainrepo.io
- Feature branches: Create from `staging`, merge back to `staging`
