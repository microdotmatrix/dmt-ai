-- Fix invalid document IDs in the database
-- This script updates non-UUID document IDs to proper UUIDs

-- First, check what invalid IDs exist
SELECT id, title FROM document WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

-- Update invalid document IDs to proper UUIDs
-- This will create a mapping table first to preserve references
CREATE TEMP TABLE id_mapping AS
SELECT 
  id as old_id, 
  gen_random_uuid() as new_id
FROM document 
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

-- Update suggestions table foreign keys first
UPDATE suggestion 
SET document_id = id_mapping.new_id
FROM id_mapping 
WHERE suggestion.document_id = id_mapping.old_id;

-- Update document table with new UUIDs
UPDATE document 
SET id = id_mapping.new_id
FROM id_mapping 
WHERE document.id = id_mapping.old_id;

-- Show the mapping for reference
SELECT * FROM id_mapping;

-- Verify all document IDs are now valid UUIDs
SELECT id, title FROM document WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
