-- Tasks Table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'todo',
  urgency TEXT DEFAULT 'low',
  due_date TIMESTAMPTZ,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Tasks Policies
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tasks" ON tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Business Model Canvas Table
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

-- Enable RLS for business model canvas
ALTER TABLE business_model_canvas ENABLE ROW LEVEL SECURITY;

-- Business Model Canvas Policies
CREATE POLICY "Users can view own canvas" ON business_model_canvas
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create canvas" ON business_model_canvas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own canvas" ON business_model_canvas
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own canvas" ON business_model_canvas
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at triggers for both tables
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_canvas_updated_at
  BEFORE UPDATE ON business_model_canvas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_project_id_idx ON tasks(project_id);
CREATE INDEX tasks_status_idx ON tasks(status);
CREATE INDEX canvas_user_id_idx ON business_model_canvas(user_id);
CREATE INDEX canvas_project_id_idx ON business_model_canvas(project_id); 