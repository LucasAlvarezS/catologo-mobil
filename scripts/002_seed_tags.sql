-- Insert default usage tags
INSERT INTO tags (nombre, descripcion) VALUES
  ('uso_basico', 'Ideal para llamadas, mensajes y apps básicas'),
  ('redes_sociales', 'Perfecto para Instagram, TikTok, Facebook y más'),
  ('banco', 'Seguro para apps bancarias y pagos móviles'),
  ('gaming_ligero', 'Corre juegos casuales sin problemas'),
  ('gaming_pesado', 'Alto rendimiento para juegos exigentes como COD Mobile')
ON CONFLICT (nombre) DO NOTHING;
