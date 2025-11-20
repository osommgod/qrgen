# Plan Date Tracking Migration

This migration adds automatic tracking of plan subscription dates.

## What it does

1. **Automatically sets plan dates on user registration:**
   - `plan_started_at` is set to the current date
   - `plan_renews_at` is set to 30 days after `plan_started_at`

2. **Automatically updates plan dates on plan upgrade:**
   - When a user's plan changes, `plan_started_at` is updated to the current date
   - `plan_renews_at` is updated to 30 days from the new `plan_started_at`

3. **Backfills existing users:**
   - Sets `plan_started_at` to their `created_at` date (or current date if not available)
   - Sets `plan_renews_at` to 30 days after `plan_started_at`

## How to apply

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `add_plan_date_tracking.sql`
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to your project directory
cd "c:/Users/ommka/OneDrive/Documents/SaaS Projects/Text to QR Generator v8"

# Apply the migration
supabase db push
```

## Verification

After applying the migration, you can verify it's working:

1. **Check existing users:**
   ```sql
   SELECT id, email, plan, plan_started_at, plan_renews_at 
   FROM public.users_custom 
   LIMIT 5;
   ```

2. **Test new user creation:**
   - Register a new user
   - Check that `plan_started_at` and `plan_renews_at` are automatically set

3. **Test plan upgrade:**
   - Update a user's plan in the Admin panel
   - Verify that both dates are updated to reflect the upgrade

## Database Triggers Created

- `trigger_set_plan_dates_on_insert`: Runs before INSERT to set initial plan dates
- `trigger_update_plan_dates_on_change`: Runs before UPDATE to update dates when plan changes

## Notes

- The renewal period is set to 30 days by default
- Dates are stored in UTC timezone
- The trigger only updates dates when the `plan` column actually changes
- Existing users are backfilled using their `created_at` date
