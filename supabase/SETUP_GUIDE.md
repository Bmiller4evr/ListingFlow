# 🚀 Supabase Database Setup Guide

This guide will walk you through setting up the Supabase database for the AccessRealtyPro listing platform.

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Git installed

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - Project name: `AccessRealtyPro` (or your choice)
   - Database password: (save this securely!)
   - Region: Choose closest to your users
4. Click "Create Project" and wait ~2 minutes

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to Settings → API
2. Copy these values:
   - **Project URL**: `https://xxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGc...` (safe for frontend)
   - **Service Role Key**: `eyJhbGc...` (keep secret!)

## Step 3: Set Up Environment Variables

Create `.env.local` in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional: For local development
SUPABASE_DB_URL=postgresql://postgres:your-password@localhost:54322/postgres
```

## Step 4: Run Database Migrations

### Option A: Using Supabase Dashboard (Easiest)

1. Go to SQL Editor in your Supabase dashboard
2. Click "New Query"
3. Copy and paste each migration file in order:
   - First: `001_initial_schema.sql`
   - Second: `002_form_schemas.sql`
4. Click "Run" for each migration

### Option B: Using Supabase CLI (Recommended for Teams)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option C: Using Database Manager Script

```bash
# Install dependencies
npm install

# Run setup script
npm run db:setup
```

## Step 5: Configure Authentication

1. In Supabase Dashboard, go to Authentication → Providers
2. Enable Email provider (enabled by default)
3. Configure email templates:
   - Go to Authentication → Email Templates
   - Customize confirmation and magic link emails

## Step 6: Set Up Row Level Security (RLS)

RLS is automatically configured in the migrations, but verify:

1. Go to Database → Tables in Supabase Dashboard
2. Click on any table (e.g., `properties`)
3. Check that "RLS enabled" shows ✅
4. Click "Policies" to view security rules

## Step 7: Install NPM Packages

```bash
# Install Supabase client library
npm install @supabase/supabase-js

# Install type generation tool (optional but recommended)
npm install --save-dev supabase
```

## Step 8: Generate TypeScript Types (Optional)

```bash
# Generate types from your database schema
npx supabase gen types typescript --project-id your-project-ref > src/types/database.ts
```

## Step 9: Test the Connection

Create a test file `test-connection.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  const { data, error } = await supabase
    .from('properties')
    .select('count')
    
  if (error) {
    console.error('❌ Connection failed:', error)
  } else {
    console.log('✅ Connected to Supabase!')
    console.log('Properties count:', data)
  }
}

testConnection()
```

Run it:
```bash
npm run test:db
```

## Step 10: Enable Realtime (Optional)

For live updates across users:

1. Go to Database → Replication in Supabase Dashboard
2. Enable replication for tables:
   - `properties`
   - `form_progress`
   - `property_media`

## 🔧 Database Management Commands

After setup, use these commands to manage your database:

```bash
# Add a new field to a form
npm run db addField basic_information has_basement select "Has Basement"

# Remove a field
npm run db removeField basic_information has_basement

# List all forms
npm run db listForms

# View database statistics
npm run db stats

# Clean old data (default 90 days)
npm run db cleanup 30

# Rollback a form schema
npm run db rollback basic_information 1
```

## 📊 Monitoring & Maintenance

### Database Health Check
```bash
npm run db:health
```

### Backup Strategy
1. Automatic backups: Enabled by default (7 days on free tier)
2. Manual backup: Database → Backups → Create Backup
3. Export data: `npm run db:export`

### Performance Monitoring
1. Go to Database → Query Performance
2. Look for slow queries
3. Add indexes as needed:

```sql
-- Example: Add index for faster address searches
CREATE INDEX idx_addresses_city ON property_addresses(city);
```

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Use `.env.local` and add to `.gitignore`
2. **Use RLS policies** - Already configured in migrations
3. **Rotate keys regularly** - Regenerate API keys every 90 days
4. **Monitor access logs** - Check Authentication → Logs regularly
5. **Use service role key only server-side** - Never expose in frontend

## 🚨 Troubleshooting

### "Permission denied" errors
- Check RLS policies are enabled
- Verify user is authenticated
- Check API key is correct

### "Relation does not exist" errors
- Run migrations in order
- Check you're connected to right project
- Verify migrations completed successfully

### Slow queries
- Add appropriate indexes
- Use `select()` with specific columns
- Implement pagination for large datasets

### Connection issues
- Verify environment variables are set
- Check network/firewall settings
- Ensure Supabase project is active

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Database Schema Diagram](./schema-diagram.png)
- [API Documentation](./API.md)
- [Migration History](./migrations/README.md)

## 🎯 Next Steps

1. ✅ Database is set up
2. → Integrate with your React app
3. → Set up Zoho CRM sync (optional)
4. → Configure backup automation
5. → Set up monitoring alerts

---

**Need Help?** 
- Check [Supabase Discord](https://discord.supabase.com)
- Review [Common Issues](https://github.com/supabase/supabase/discussions)
- Contact support@supabase.com (paid plans)