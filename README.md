# Kickers Academy

## Deployment on Vercel

### Required environment variables
- DATABASE_URL
- ADMIN_USERNAME
- ADMIN_PASSWORD
- ADMIN_SESSION_SECRET
- RESEND_API_KEY
- EMAIL_FROM
- BLOB_READ_WRITE_TOKEN (optional, enables Vercel Blob storage for document uploads)

### Build and deploy
1. Install dependencies with `npm install`.
2. Add the environment variables in the Vercel project settings.
3. Deploy the app.
4. Ensure the database is reachable from Vercel and run Prisma migrations as part of the build.

### Notes
- The app uses Prisma with PostgreSQL.
- Document uploads use Vercel Blob when `BLOB_READ_WRITE_TOKEN` is provided; otherwise they fall back to local storage.
