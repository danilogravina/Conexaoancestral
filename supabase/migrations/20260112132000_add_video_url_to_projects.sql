-- Migration: Add video_url to projects
-- Date: 2026-01-12

ALTER TABLE projects ADD COLUMN video_url TEXT;

-- Update existing projects with a placeholder if needed (optional)
-- UPDATE projects SET video_url = 'https://www.youtube.com/watch?v=S_IqjB4A1jY' WHERE video_url IS NULL;
