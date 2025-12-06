# Database Migrations Guide

This project uses TypeORM migrations to manage database schema changes in production.

## How It Works

### Development
- In development, TypeORM's `synchronize: true` automatically creates/updates tables based on your entities
- No manual migration running needed during development

### Production
- In production, `synchronize` is disabled for safety
- Migrations are **automatically run** when the server starts
- The database schema is created/updated based on migration files

## Migration Commands

### Show Pending Migrations
```bash
npm run migration:show
```

### Run Migrations Manually (if needed)
```bash
npm run migration:run
```

### Revert Last Migration
```bash
npm run migration:revert
```

### Generate New Migration (after changing entities)
```bash
npm run migration:generate src/migrations/MigrationName
```

### Create Empty Migration
```bash
npm run migration:create src/migrations/MigrationName
```

## Deployment Workflow

1. **Make changes to entities** (e.g., `src/entities/User.ts`)
2. **Generate migration** (optional in dev, but recommended):
   ```bash
   npm run migration:generate src/migrations/UpdateUserTable
   ```
3. **Commit migration files** to version control
4. **Deploy to production**:
   - Build: `npm run build`
   - Start: `npm start`
   - Migrations run automatically on startup!

## Initial Setup (Production)

When deploying to a fresh production database:

1. Set `NODE_ENV=production` in your environment variables
2. Set your `DATABASE_URL` connection string
3. Run `npm run build` to compile TypeScript
4. Run `npm start` - migrations will run automatically!

The initial migration (`1733447600000-InitialSchema.ts`) will create:
- `users` table
- `duplicate_logs` table
- Required indexes
- UUID extension

## Important Notes

- ✅ Migrations run **automatically** in production on server start
- ✅ SSL is automatically enabled for production databases
- ✅ The system checks for pending migrations before running them
- ⚠️ Never modify existing migration files - create new ones instead
- ⚠️ Always test migrations in a staging environment first
- ⚠️ Keep migration files in version control

## Troubleshooting

### Migration fails in production
Check the logs for specific errors. Common issues:
- Database connection string incorrect
- Missing environment variables
- Database user lacks permissions

### Need to reset database
```bash
# Revert all migrations
npm run migration:revert
# Run again to revert more
npm run migration:revert
```

### Manual migration in production
If you need to run migrations manually (not recommended):
```bash
NODE_ENV=production npm run migration:run
```
