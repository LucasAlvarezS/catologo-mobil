-- Ejecuta este script en el Editor SQL de tu panel de Supabase para actualizar la base de datos

ALTER TABLE telefonos 
ADD COLUMN IF NOT EXISTS tiene_ram_virtual BOOLEAN DEFAULT FALSE;

ALTER TABLE telefonos 
ADD COLUMN IF NOT EXISTS tiene_almacenamiento_expandible BOOLEAN DEFAULT FALSE;
