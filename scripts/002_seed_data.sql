-- Insert default tags for phone usage categories
INSERT INTO tags (nombre, descripcion) VALUES
  ('uso_basico', 'Ideal para llamadas, mensajes y tareas básicas'),
  ('redes_sociales', 'Perfecto para Instagram, TikTok y redes sociales'),
  ('banco', 'Óptimo para apps bancarias y pagos móviles'),
  ('gaming_ligero', 'Corre juegos casuales sin problemas'),
  ('gaming_pesado', 'Potencia para juegos exigentes como Call of Duty')
ON CONFLICT (nombre) DO NOTHING;

-- Insert sample phones
INSERT INTO telefonos (marca, modelo, descripcion_corta, precio_lista, precio_plan, precio_descuento, ram, almacenamiento, procesador, bateria, camara, pantalla, foto_url, activo) VALUES
  ('Samsung', 'Galaxy A15', 'Gama media con excelente pantalla AMOLED', 299.99, 199.99, 279.99, '4GB', '128GB', 'MediaTek Helio G99', '5000mAh', '50MP + 5MP + 2MP', '6.5" Super AMOLED FHD+', '/placeholder.svg?height=400&width=300', true),
  ('Samsung', 'Galaxy S24', 'Flagship con IA integrada y cámara profesional', 899.99, 699.99, 849.99, '8GB', '256GB', 'Snapdragon 8 Gen 3', '4000mAh', '50MP + 12MP + 10MP', '6.2" Dynamic AMOLED 2X 120Hz', '/placeholder.svg?height=400&width=300', true),
  ('iPhone', '15', 'El iPhone más avanzado con Dynamic Island', 999.99, 799.99, 949.99, '6GB', '128GB', 'A16 Bionic', '3349mAh', '48MP + 12MP', '6.1" Super Retina XDR OLED', '/placeholder.svg?height=400&width=300', true),
  ('iPhone', '15 Pro Max', 'El máximo poder con titanio y cámara de 5x', 1399.99, 1099.99, 1299.99, '8GB', '256GB', 'A17 Pro', '4441mAh', '48MP + 12MP + 12MP', '6.7" Super Retina XDR ProMotion', '/placeholder.svg?height=400&width=300', true),
  ('Xiaomi', 'Redmi Note 13', 'Increíble relación calidad-precio', 199.99, 149.99, 179.99, '6GB', '128GB', 'Snapdragon 685', '5000mAh', '108MP + 8MP + 2MP', '6.67" AMOLED 120Hz', '/placeholder.svg?height=400&width=300', true),
  ('Xiaomi', '14 Ultra', 'Cámara Leica profesional para fotógrafos', 1299.99, 999.99, 1199.99, '16GB', '512GB', 'Snapdragon 8 Gen 3', '5000mAh', '50MP Leica Quad Camera', '6.73" LTPO AMOLED 120Hz', '/placeholder.svg?height=400&width=300', true),
  ('Motorola', 'Moto G54', 'Batería de larga duración para todo el día', 249.99, 179.99, 229.99, '8GB', '256GB', 'MediaTek Dimensity 7020', '5000mAh', '50MP + 8MP', '6.5" IPS LCD 120Hz', '/placeholder.svg?height=400&width=300', true),
  ('OPPO', 'Reno 11', 'Diseño elegante con carga ultra rápida', 449.99, 349.99, 399.99, '12GB', '256GB', 'MediaTek Dimensity 7050', '5000mAh', '64MP + 32MP + 8MP', '6.7" AMOLED 120Hz', '/placeholder.svg?height=400&width=300', true);

-- Assign tags to phones (using subqueries to get IDs)
INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'Galaxy A15' AND tag.nombre IN ('uso_basico', 'redes_sociales', 'banco');

INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'Galaxy S24' AND tag.nombre IN ('redes_sociales', 'banco', 'gaming_ligero', 'gaming_pesado');

INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = '15' AND tag.nombre IN ('redes_sociales', 'banco', 'gaming_ligero');

INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = '15 Pro Max' AND tag.nombre IN ('redes_sociales', 'banco', 'gaming_ligero', 'gaming_pesado');

INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'Redmi Note 13' AND tag.nombre IN ('uso_basico', 'redes_sociales', 'banco');

INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = '14 Ultra' AND tag.nombre IN ('redes_sociales', 'banco', 'gaming_ligero', 'gaming_pesado');

INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'Moto G54' AND tag.nombre IN ('uso_basico', 'redes_sociales', 'banco');

INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'Reno 11' AND tag.nombre IN ('redes_sociales', 'banco', 'gaming_ligero');
