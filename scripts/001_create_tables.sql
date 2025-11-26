-- Create tags table for phone usage categories
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create phones table
CREATE TABLE IF NOT EXISTS telefonos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  descripcion_corta TEXT,
  precio_lista DECIMAL(10, 2) NOT NULL,
  precio_plan DECIMAL(10, 2),
  precio_descuento DECIMAL(10, 2),
  ram TEXT,
  almacenamiento TEXT,
  procesador TEXT,
  bateria TEXT,
  camara TEXT,
  pantalla TEXT,
  foto_url TEXT,
  foto_url_2 TEXT,
  foto_url_3 TEXT,
  activo BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for phone-tag relationship
CREATE TABLE IF NOT EXISTS telefono_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telefono_id UUID NOT NULL REFERENCES telefonos(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(telefono_id, tag_id)
);

-- Enable RLS on all tables
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE telefonos ENABLE ROW LEVEL SECURITY;
ALTER TABLE telefono_tags ENABLE ROW LEVEL SECURITY;

-- Public read access for tags (everyone can see categories)
CREATE POLICY "Allow public read access on tags" ON tags
  FOR SELECT USING (true);

-- Public read access for active phones
CREATE POLICY "Allow public read access on active phones" ON telefonos
  FOR SELECT USING (activo = true);

-- Public read access for phone tags
CREATE POLICY "Allow public read access on telefono_tags" ON telefono_tags
  FOR SELECT USING (true);

-- Admin policies (using service role for admin operations)
-- These will be handled via service role key in admin routes

-- Authenticated user policies for admin CRUD operations
-- Authenticated users can read all phones (including inactive)
CREATE POLICY "Allow authenticated full read on telefonos" ON telefonos
  FOR SELECT TO authenticated USING (true);

-- Authenticated users can insert phones
CREATE POLICY "Allow authenticated insert on telefonos" ON telefonos
  FOR INSERT TO authenticated WITH CHECK (true);

-- Authenticated users can update phones
CREATE POLICY "Allow authenticated update on telefonos" ON telefonos
  FOR UPDATE TO authenticated USING (true);

-- Authenticated users can delete phones
CREATE POLICY "Allow authenticated delete on telefonos" ON telefonos
  FOR DELETE TO authenticated USING (true);

-- Authenticated users can manage tags
CREATE POLICY "Allow authenticated insert on tags" ON tags
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on tags" ON tags
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on tags" ON tags
  FOR DELETE TO authenticated USING (true);

-- Authenticated users can manage phone-tag relationships
CREATE POLICY "Allow authenticated insert on telefono_tags" ON telefono_tags
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on telefono_tags" ON telefono_tags
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on telefono_tags" ON telefono_tags
  FOR DELETE TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_telefonos_marca ON telefonos(marca);
CREATE INDEX IF NOT EXISTS idx_telefonos_activo ON telefonos(activo);
CREATE INDEX IF NOT EXISTS idx_telefono_tags_telefono_id ON telefono_tags(telefono_id);
CREATE INDEX IF NOT EXISTS idx_telefono_tags_tag_id ON telefono_tags(tag_id);
