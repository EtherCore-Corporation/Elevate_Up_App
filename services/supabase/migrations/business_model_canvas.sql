-- Create enum for project status if not exists
CREATE TYPE project_status AS ENUM ('draft', 'in_progress', 'completed', 'archived');

-- Create the business_model_canvas table that works with your existing schema
CREATE TABLE business_model_canvas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_partners TEXT DEFAULT '',
  key_activities TEXT DEFAULT '',
  key_resources TEXT DEFAULT '',
  value_propositions TEXT DEFAULT '',
  customer_relationships TEXT DEFAULT '',
  channels TEXT DEFAULT '',
  customer_segments TEXT DEFAULT '',
  cost_structure TEXT DEFAULT '',
  revenue_streams TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id)
);

-- Create RLS policies
ALTER TABLE business_model_canvas ENABLE ROW LEVEL SECURITY;

-- Policy for viewing canvas (must be project owner)
CREATE POLICY "Users can view their own project's canvas" ON business_model_canvas
  FOR SELECT
  USING (
    project_id IN (
      SELECT id 
      FROM projects 
      WHERE user_id = auth.uid()
    )
  );

-- Policy for inserting canvas
CREATE POLICY "Users can create canvas for their own projects" ON business_model_canvas
  FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id 
      FROM projects 
      WHERE user_id = auth.uid()
    )
  );

-- Policy for updating canvas
CREATE POLICY "Users can update their own project's canvas" ON business_model_canvas
  FOR UPDATE
  USING (
    project_id IN (
      SELECT id 
      FROM projects 
      WHERE user_id = auth.uid()
    )
  );

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_business_model_canvas_updated_at
  BEFORE UPDATE ON business_model_canvas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 