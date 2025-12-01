-- Insert sample phones for demonstration
INSERT INTO telefonos (marca, modelo, descripcion_corta, precio_lista, precio_plan, precio_descuento, ram, almacenamiento, procesador, bateria, camara, pantalla, foto_url, activo) VALUES
  ('Samsung', 'Galaxy A14', 'Smartphone económico con gran pantalla', 199.99, 149.99, 179.99, '4GB', '64GB', 'MediaTek Helio G80', '5000mAh', '50MP + 5MP + 2MP', '6.6" PLS LCD', '/placeholder.svg?height=400&width=300', true),
  ('Xiaomi', 'Redmi Note 12', 'Excelente relación calidad-precio', 249.99, 199.99, 229.99, '6GB', '128GB', 'Snapdragon 685', '5000mAh', '50MP + 8MP + 2MP', '6.67" AMOLED 120Hz', '/placeholder.svg?height=400&width=300', true),
  ('Apple', 'iPhone 13', 'El clásico de Apple renovado', 699.99, 599.99, 649.99, '4GB', '128GB', 'A15 Bionic', '3240mAh', '12MP + 12MP', '6.1" Super Retina XDR', '/placeholder.svg?height=400&width=300', true),
  ('Samsung', 'Galaxy S23', 'Flagship con cámara profesional', 899.99, 799.99, 849.99, '8GB', '256GB', 'Snapdragon 8 Gen 2', '3900mAh', '50MP + 12MP + 10MP', '6.1" Dynamic AMOLED 2X 120Hz', '/placeholder.svg?height=400&width=300', true),
  ('Motorola', 'Moto G54', 'Gran batería y rendimiento sólido', 229.99, 179.99, 209.99, '8GB', '128GB', 'MediaTek Dimensity 7020', '5000mAh', '50MP + 8MP', '6.5" IPS LCD 120Hz', '/placeholder.svg?height=400&width=300', true),
  ('Xiaomi', 'POCO X5 Pro', 'Potencia gaming a precio accesible', 349.99, 299.99, 329.99, '8GB', '256GB', 'Snapdragon 778G', '5000mAh', '108MP + 8MP + 2MP', '6.67" AMOLED 120Hz', '/placeholder.svg?height=400&width=300', true),
  ('Samsung', 'Galaxy A54', 'Equilibrio perfecto', 449.99, 399.99, 429.99, '8GB', '128GB', 'Exynos 1380', '5000mAh', '50MP + 12MP + 5MP', '6.4" Super AMOLED 120Hz', '/placeholder.svg?height=400&width=300', true),
  ('Apple', 'iPhone 15 Pro', 'Lo último en tecnología Apple', 1199.99, 1099.99, NULL, '8GB', '256GB', 'A17 Pro', '3274mAh', '48MP + 12MP + 12MP', '6.1" Super Retina XDR ProMotion', '/placeholder.svg?height=400&width=300', true)
ON CONFLICT DO NOTHING;
