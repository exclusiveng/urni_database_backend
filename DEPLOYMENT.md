# Production Deployment Guide

## Quick Start

### 1. Set Environment Variables
In your production environment (Render, Railway, Heroku, etc.), set:

```bash
NODE_ENV=production
DATABASE_URL=your_production_database_url
PORT=3000  # or whatever port your host provides
```

### 2. Deploy
Your deployment platform will typically:
1. Install dependencies: `npm install`
2. Build the app: `npm run build`
3. Start the server: `npm start`

### 3. Database Setup
**No manual setup needed!** 🎉

When the server starts in production:
- It connects to the database
- Automatically runs any pending migrations
- Creates all tables, indexes, and constraints
- Your database is ready to use!

## Platform-Specific Instructions

### Render.com
1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables in the dashboard
6. Deploy!

### Railway.app
1. Create a new project from GitHub
2. Add a PostgreSQL database
3. Railway auto-detects the build/start commands
4. Set `NODE_ENV=production` in variables
5. Deploy!

### Heroku
1. Create a new app: `heroku create`
2. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
3. Set config: `heroku config:set NODE_ENV=production`
4. Deploy: `git push heroku main`
5. Migrations run automatically on startup!

## What Happens on First Deploy

1. **Database Connection**: Server connects to your PostgreSQL database
2. **Migration Check**: Checks for pending migrations
3. **Schema Creation**: Runs the initial migration:
   - Creates `users` table
   - Creates `duplicate_logs` table
   - Sets up indexes
   - Enables UUID extension
4. **Server Start**: API is ready to receive requests!

## Subsequent Deploys

When you deploy updates with new migrations:
1. Server starts
2. Detects new migration files
3. Runs only the new migrations
4. Continues startup

## Monitoring

Check your logs for these messages:
```
✅ Database connected successfully
✅ Running pending migrations...
✅ Migrations completed successfully
✅ Server running on port 3000
```

## Rollback

If you need to rollback a migration:
```bash
npm run migration:revert
```

Or manually in production:
```bash
NODE_ENV=production npm run migration:revert
```

## Best Practices

✅ **DO:**
- Test migrations in staging first
- Keep migration files in version control
- Review migration SQL before deploying
- Monitor logs during deployment

❌ **DON'T:**
- Modify existing migration files
- Delete migration files
- Run `synchronize: true` in production
- Skip testing migrations

## Troubleshooting

### "relation already exists" error
Your database might have existing tables. Options:
1. Drop all tables and redeploy (⚠️ loses data)
2. Create a migration that checks if tables exist first

### Connection timeout
- Check DATABASE_URL is correct
- Verify database is running
- Check firewall/security group settings
- Ensure SSL is enabled (it is by default in production)

### Migration fails
- Check logs for specific error
- Verify database user has CREATE permissions
- Ensure database exists
- Check for syntax errors in migration

## Need Help?

Check `MIGRATIONS.md` for detailed migration commands and workflows.
