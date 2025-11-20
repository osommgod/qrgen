-- Migration: Add automatic plan date tracking
-- This migration adds triggers to automatically set plan_started_at and plan_renews_at

-- Function to set plan dates on user creation
CREATE OR REPLACE FUNCTION set_plan_dates_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Set plan_started_at to current timestamp if not already set
  IF NEW.plan_started_at IS NULL THEN
    NEW.plan_started_at = NOW();
  END IF;
  
  -- Set plan_renews_at to 30 days from plan_started_at
  NEW.plan_renews_at = NEW.plan_started_at + INTERVAL '30 days';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update plan dates when plan changes
CREATE OR REPLACE FUNCTION update_plan_dates_on_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if plan has changed
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    -- Update plan_started_at to current timestamp
    NEW.plan_started_at = NOW();
    
    -- Update plan_renews_at to 30 days from now
    NEW.plan_renews_at = NOW() + INTERVAL '30 days';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_set_plan_dates_on_insert ON public.users_custom;
DROP TRIGGER IF EXISTS trigger_update_plan_dates_on_change ON public.users_custom;

-- Create trigger for new user insertions
CREATE TRIGGER trigger_set_plan_dates_on_insert
  BEFORE INSERT ON public.users_custom
  FOR EACH ROW
  EXECUTE FUNCTION set_plan_dates_on_insert();

-- Create trigger for plan updates
CREATE TRIGGER trigger_update_plan_dates_on_change
  BEFORE UPDATE ON public.users_custom
  FOR EACH ROW
  EXECUTE FUNCTION update_plan_dates_on_change();

-- Update existing users who don't have plan dates set
UPDATE public.users_custom
SET 
  plan_started_at = COALESCE(plan_started_at, created_at, NOW()),
  plan_renews_at = COALESCE(plan_renews_at, created_at + INTERVAL '30 days', NOW() + INTERVAL '30 days')
WHERE plan_started_at IS NULL OR plan_renews_at IS NULL;
