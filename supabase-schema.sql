-- Supabase Schema for Developer Timesheet Application
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create developers table
CREATE TABLE IF NOT EXISTS developers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create timesheets table
CREATE TABLE IF NOT EXISTS timesheets (
    id SERIAL PRIMARY KEY,
    developer_id INTEGER NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    task_description TEXT NOT NULL,
    hours_worked DECIMAL(5,2) NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Completed',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_timesheets_developer_id ON timesheets(developer_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_date ON timesheets(date DESC);
CREATE INDEX IF NOT EXISTS idx_timesheets_task_type ON timesheets(task_type);
CREATE INDEX IF NOT EXISTS idx_timesheets_project_name ON timesheets(project_name);

-- Enable Row Level Security (RLS)
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security requirements)
-- For development/demo purposes, we allow all operations
-- In production, you should restrict these based on user authentication

CREATE POLICY "Allow public read access on developers" ON developers
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on developers" ON developers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on developers" ON developers
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on developers" ON developers
    FOR DELETE USING (true);

CREATE POLICY "Allow public read access on timesheets" ON timesheets
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on timesheets" ON timesheets
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on timesheets" ON timesheets
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on timesheets" ON timesheets
    FOR DELETE USING (true);

-- Sample data (optional - uncomment to insert)
/*
INSERT INTO developers (name, email, position, department) VALUES
    ('Juan Pérez', 'juan@empresa.com', 'Senior Developer', 'Backend'),
    ('María García', 'maria@empresa.com', 'Frontend Developer', 'Frontend'),
    ('Carlos López', 'carlos@empresa.com', 'Full Stack Developer', 'Full Stack');

INSERT INTO timesheets (developer_id, date, project_name, task_description, hours_worked, task_type, status, notes) VALUES
    (1, '2024-01-15', 'Sistema de Inventario', 'Implementación de API REST', 8, 'Development', 'Completed', 'API completada'),
    (2, '2024-01-15', 'Portal Web', 'Diseño de componentes React', 6, 'Development', 'In Progress', ''),
    (3, '2024-01-15', 'App Móvil', 'Testing de funcionalidades', 4, 'Testing', 'Completed', 'Tests pasados');
*/
