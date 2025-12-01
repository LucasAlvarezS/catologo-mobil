-- Associate phones with tags
-- Galaxy A14 - básico, redes sociales
INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'Galaxy A14' AND tag.nombre IN ('uso_basico', 'redes_sociales', 'banco');

-- Redmi Note 12 - redes sociales, gaming ligero
INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'Redmi Note 12' AND tag.nombre IN ('redes_sociales', 'gaming_ligero', 'banco');

-- iPhone 13 - all categories
INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'iPhone 13' AND tag.nombre IN ('redes_sociales', 'gaming_ligero', 'banco');

-- Galaxy S23 - gaming pesado
INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'Galaxy S23' AND tag.nombre IN ('redes_sociales', 'gaming_pesado', 'banco');

-- Moto G54 - básico, redes sociales
INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'Moto G54' AND tag.nombre IN ('uso_basico', 'redes_sociales', 'banco');

-- POCO X5 Pro - gaming
INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'POCO X5 Pro' AND tag.nombre IN ('redes_sociales', 'gaming_ligero', 'gaming_pesado', 'banco');

-- Galaxy A54 - balanced
INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'Galaxy A54' AND tag.nombre IN ('redes_sociales', 'gaming_ligero', 'banco');

-- iPhone 15 Pro - all premium
INSERT INTO telefono_tags (telefono_id, tag_id)
SELECT t.id, tag.id FROM telefonos t, tags tag 
WHERE t.modelo = 'iPhone 15 Pro' AND tag.nombre IN ('redes_sociales', 'gaming_pesado', 'banco');
