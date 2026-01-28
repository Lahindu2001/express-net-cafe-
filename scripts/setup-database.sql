-- Express Net Cafe Database Schema

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phone brands table
CREATE TABLE IF NOT EXISTS phone_brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phone models table
CREATE TABLE IF NOT EXISTS phone_models (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER REFERENCES phone_brands(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Display replacement prices (only display price, not sell price)
CREATE TABLE IF NOT EXISTS display_prices (
  id SERIAL PRIMARY KEY,
  model_id INTEGER REFERENCES phone_models(id) ON DELETE CASCADE,
  display_type VARCHAR(100) DEFAULT 'Original',
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accessory categories
CREATE TABLE IF NOT EXISTS accessory_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accessories table
CREATE TABLE IF NOT EXISTS accessories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES accessory_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  compatible_models TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SIM card providers
CREATE TABLE IF NOT EXISTS sim_providers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SIM cards table
CREATE TABLE IF NOT EXISTS sim_cards (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES sim_providers(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Router providers
CREATE TABLE IF NOT EXISTS router_providers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routers table
CREATE TABLE IF NOT EXISTS routers (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER REFERENCES router_providers(id) ON DELETE CASCADE,
  model VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  description TEXT,
  features TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table (photocopy, printout, etc.)
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  price_unit VARCHAR(50),
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default phone brands
INSERT INTO phone_brands (name) VALUES 
  ('Samsung'),
  ('Apple'),
  ('Huawei'),
  ('Honor'),
  ('Xiaomi'),
  ('OPPO'),
  ('Vivo'),
  ('Realme'),
  ('OnePlus'),
  ('Nokia'),
  ('Motorola'),
  ('Google'),
  ('Sony'),
  ('LG'),
  ('Redmi')
ON CONFLICT (name) DO NOTHING;

-- Insert Samsung models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('Galaxy S24 Ultra'), ('Galaxy S24+'), ('Galaxy S24'), ('Galaxy S23 Ultra'), ('Galaxy S23+'), ('Galaxy S23'),
  ('Galaxy S22 Ultra'), ('Galaxy S22+'), ('Galaxy S22'), ('Galaxy S21 Ultra'), ('Galaxy S21+'), ('Galaxy S21'), ('Galaxy S21 FE'),
  ('Galaxy S20 Ultra'), ('Galaxy S20+'), ('Galaxy S20'), ('Galaxy S20 FE'),
  ('Galaxy S10+'), ('Galaxy S10'), ('Galaxy S10e'), ('Galaxy S10 Lite'),
  ('Galaxy S9+'), ('Galaxy S9'), ('Galaxy S8+'), ('Galaxy S8'),
  ('Galaxy Note 20 Ultra'), ('Galaxy Note 20'), ('Galaxy Note 10+'), ('Galaxy Note 10'), ('Galaxy Note 9'), ('Galaxy Note 8'),
  ('Galaxy Z Fold 5'), ('Galaxy Z Fold 4'), ('Galaxy Z Fold 3'), ('Galaxy Z Fold 2'),
  ('Galaxy Z Flip 5'), ('Galaxy Z Flip 4'), ('Galaxy Z Flip 3'), ('Galaxy Z Flip'),
  ('Galaxy A54'), ('Galaxy A53'), ('Galaxy A52'), ('Galaxy A51'), ('Galaxy A50'),
  ('Galaxy A34'), ('Galaxy A33'), ('Galaxy A32'), ('Galaxy A31'), ('Galaxy A30'),
  ('Galaxy A24'), ('Galaxy A23'), ('Galaxy A22'), ('Galaxy A21'), ('Galaxy A20'),
  ('Galaxy A14'), ('Galaxy A13'), ('Galaxy A12'), ('Galaxy A11'), ('Galaxy A10'),
  ('Galaxy A04'), ('Galaxy A03'), ('Galaxy A02'),
  ('Galaxy M54'), ('Galaxy M53'), ('Galaxy M52'), ('Galaxy M51'),
  ('Galaxy M34'), ('Galaxy M33'), ('Galaxy M32'), ('Galaxy M31'),
  ('Galaxy M14'), ('Galaxy M13'), ('Galaxy M12'), ('Galaxy M11'),
  ('Galaxy F54'), ('Galaxy F34'), ('Galaxy F23'), ('Galaxy F13'),
  ('Galaxy J7 Pro'), ('Galaxy J7 Prime'), ('Galaxy J5 Pro'), ('Galaxy J5 Prime'),
  ('Galaxy J4+'), ('Galaxy J4'), ('Galaxy J2 Pro'), ('Galaxy J2 Prime')
) AS t(model) WHERE phone_brands.name = 'Samsung'
ON CONFLICT DO NOTHING;

-- Insert Apple models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('iPhone 15 Pro Max'), ('iPhone 15 Pro'), ('iPhone 15 Plus'), ('iPhone 15'),
  ('iPhone 14 Pro Max'), ('iPhone 14 Pro'), ('iPhone 14 Plus'), ('iPhone 14'),
  ('iPhone 13 Pro Max'), ('iPhone 13 Pro'), ('iPhone 13 mini'), ('iPhone 13'),
  ('iPhone 12 Pro Max'), ('iPhone 12 Pro'), ('iPhone 12 mini'), ('iPhone 12'),
  ('iPhone 11 Pro Max'), ('iPhone 11 Pro'), ('iPhone 11'),
  ('iPhone XS Max'), ('iPhone XS'), ('iPhone XR'),
  ('iPhone X'), ('iPhone 8 Plus'), ('iPhone 8'),
  ('iPhone 7 Plus'), ('iPhone 7'), ('iPhone 6s Plus'), ('iPhone 6s'),
  ('iPhone 6 Plus'), ('iPhone 6'), ('iPhone SE (2022)'), ('iPhone SE (2020)'), ('iPhone SE')
) AS t(model) WHERE phone_brands.name = 'Apple'
ON CONFLICT DO NOTHING;

-- Insert Huawei models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('P60 Pro'), ('P60'), ('P50 Pro'), ('P50'), ('P40 Pro+'), ('P40 Pro'), ('P40'),
  ('P30 Pro'), ('P30'), ('P30 Lite'), ('P20 Pro'), ('P20'), ('P20 Lite'),
  ('Mate 60 Pro'), ('Mate 60'), ('Mate 50 Pro'), ('Mate 50'),
  ('Mate 40 Pro'), ('Mate 40'), ('Mate 30 Pro'), ('Mate 30'),
  ('Mate 20 Pro'), ('Mate 20'), ('Mate 20 Lite'), ('Mate 10 Pro'), ('Mate 10'),
  ('Nova 11 Pro'), ('Nova 11'), ('Nova 10 Pro'), ('Nova 10'),
  ('Nova 9 Pro'), ('Nova 9'), ('Nova 8 Pro'), ('Nova 8'),
  ('Nova 7 Pro'), ('Nova 7'), ('Nova 5T'), ('Nova 3i'),
  ('Y9 Prime (2019)'), ('Y9 (2019)'), ('Y7 Prime'), ('Y7'),
  ('Y6 Pro'), ('Y6'), ('Y5'), ('Y3')
) AS t(model) WHERE phone_brands.name = 'Huawei'
ON CONFLICT DO NOTHING;

-- Insert Honor models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('Magic 6 Pro'), ('Magic 6'), ('Magic 5 Pro'), ('Magic 5'),
  ('Magic V2'), ('Magic Vs'), ('Magic V'),
  ('90 Pro'), ('90'), ('80 Pro'), ('80'),
  ('70 Pro'), ('70'), ('X9b'), ('X9a'), ('X9'),
  ('X8b'), ('X8a'), ('X8'), ('X7b'), ('X7a'), ('X7'),
  ('X6'), ('X5'), ('Play 40C'), ('Play 30'),
  ('20 Pro'), ('20'), ('View 20'), ('View 10'),
  ('10 Lite'), ('9X'), ('8X'), ('7X')
) AS t(model) WHERE phone_brands.name = 'Honor'
ON CONFLICT DO NOTHING;

-- Insert Xiaomi models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('14 Ultra'), ('14 Pro'), ('14'), ('13 Ultra'), ('13 Pro'), ('13'),
  ('12 Ultra'), ('12 Pro'), ('12'), ('12 Lite'),
  ('11 Ultra'), ('11 Pro'), ('11'), ('11 Lite 5G NE'),
  ('10 Pro'), ('10'), ('10 Lite'), ('Mi 9T Pro'), ('Mi 9T'),
  ('Mi 9'), ('Mi 8'), ('Mi Note 10 Pro'), ('Mi Note 10'),
  ('POCO F5 Pro'), ('POCO F5'), ('POCO F4 GT'), ('POCO F4'),
  ('POCO X5 Pro'), ('POCO X5'), ('POCO X4 Pro'), ('POCO X4 GT'),
  ('POCO M5s'), ('POCO M5'), ('POCO M4 Pro'), ('POCO C55')
) AS t(model) WHERE phone_brands.name = 'Xiaomi'
ON CONFLICT DO NOTHING;

-- Insert Redmi models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('Note 13 Pro+'), ('Note 13 Pro'), ('Note 13'), ('Note 12 Pro+'), ('Note 12 Pro'), ('Note 12'),
  ('Note 11 Pro+'), ('Note 11 Pro'), ('Note 11'), ('Note 10 Pro'), ('Note 10'), ('Note 10S'),
  ('Note 9 Pro'), ('Note 9'), ('Note 8 Pro'), ('Note 8'),
  ('13 Pro'), ('13'), ('12'), ('12C'), ('11 Prime'),
  ('10'), ('10C'), ('9'), ('9A'), ('9C'),
  ('A3'), ('A2'), ('A1')
) AS t(model) WHERE phone_brands.name = 'Redmi'
ON CONFLICT DO NOTHING;

-- Insert OPPO models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('Find X7 Ultra'), ('Find X7'), ('Find X6 Pro'), ('Find X6'),
  ('Find X5 Pro'), ('Find X5'), ('Find X3 Pro'), ('Find X3'),
  ('Find N3'), ('Find N2 Flip'), ('Find N2'),
  ('Reno 11 Pro'), ('Reno 11'), ('Reno 10 Pro+'), ('Reno 10 Pro'), ('Reno 10'),
  ('Reno 8 Pro'), ('Reno 8'), ('Reno 7 Pro'), ('Reno 7'),
  ('Reno 6 Pro'), ('Reno 6'), ('Reno 5 Pro'), ('Reno 5'),
  ('A98'), ('A96'), ('A78'), ('A77'), ('A57'), ('A17'),
  ('F23'), ('F21 Pro'), ('F19 Pro'), ('F17 Pro')
) AS t(model) WHERE phone_brands.name = 'OPPO'
ON CONFLICT DO NOTHING;

-- Insert Vivo models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('X100 Pro'), ('X100'), ('X90 Pro'), ('X90'),
  ('X80 Pro'), ('X80'), ('X70 Pro+'), ('X70 Pro'),
  ('V30 Pro'), ('V30'), ('V29 Pro'), ('V29'),
  ('V27 Pro'), ('V27'), ('V25 Pro'), ('V25'),
  ('Y100'), ('Y78'), ('Y56'), ('Y36'), ('Y27'),
  ('Y22'), ('Y21'), ('Y17'), ('Y15'), ('Y12')
) AS t(model) WHERE phone_brands.name = 'Vivo'
ON CONFLICT DO NOTHING;

-- Insert Realme models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('GT 5 Pro'), ('GT 5'), ('GT 3'), ('GT Neo 5'),
  ('GT Neo 3'), ('GT 2 Pro'), ('GT 2'),
  ('12 Pro+'), ('12 Pro'), ('12'), ('11 Pro+'), ('11 Pro'), ('11'),
  ('10 Pro+'), ('10 Pro'), ('10'), ('9 Pro+'), ('9 Pro'), ('9'),
  ('Narzo 60 Pro'), ('Narzo 60'), ('Narzo 50 Pro'), ('Narzo 50'),
  ('C55'), ('C53'), ('C51'), ('C33'), ('C30')
) AS t(model) WHERE phone_brands.name = 'Realme'
ON CONFLICT DO NOTHING;

-- Insert OnePlus models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('12 Pro'), ('12'), ('11 Pro'), ('11'),
  ('10 Pro'), ('10T'), ('10R'),
  ('9 Pro'), ('9'), ('9R'), ('9RT'),
  ('8 Pro'), ('8'), ('8T'),
  ('Nord 3'), ('Nord CE 3'), ('Nord CE 2'), ('Nord 2T'),
  ('Nord N30'), ('Nord N20')
) AS t(model) WHERE phone_brands.name = 'OnePlus'
ON CONFLICT DO NOTHING;

-- Insert Nokia models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('X30'), ('X20'), ('X10'),
  ('G60'), ('G50'), ('G42'), ('G22'), ('G21'),
  ('C32'), ('C31'), ('C22'), ('C21'), ('C12'),
  ('5.4'), ('5.3'), ('3.4'), ('2.4'),
  ('8.3'), ('7.2'), ('6.2')
) AS t(model) WHERE phone_brands.name = 'Nokia'
ON CONFLICT DO NOTHING;

-- Insert Motorola models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('Edge 40 Pro'), ('Edge 40'), ('Edge 30 Ultra'), ('Edge 30 Pro'),
  ('Edge 30'), ('Edge 30 Neo'), ('Edge 30 Fusion'),
  ('Razr 40 Ultra'), ('Razr 40'),
  ('G84'), ('G73'), ('G54'), ('G53'), ('G32'),
  ('E32'), ('E22'), ('E13')
) AS t(model) WHERE phone_brands.name = 'Motorola'
ON CONFLICT DO NOTHING;

-- Insert Google models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('Pixel 8 Pro'), ('Pixel 8'), ('Pixel 8a'),
  ('Pixel 7 Pro'), ('Pixel 7'), ('Pixel 7a'),
  ('Pixel 6 Pro'), ('Pixel 6'), ('Pixel 6a'),
  ('Pixel 5'), ('Pixel 4a'), ('Pixel 4 XL'), ('Pixel 4')
) AS t(model) WHERE phone_brands.name = 'Google'
ON CONFLICT DO NOTHING;

-- Insert Sony models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('Xperia 1 V'), ('Xperia 5 V'), ('Xperia 10 V'),
  ('Xperia 1 IV'), ('Xperia 5 IV'), ('Xperia 10 IV'),
  ('Xperia 1 III'), ('Xperia 5 III'), ('Xperia 10 III')
) AS t(model) WHERE phone_brands.name = 'Sony'
ON CONFLICT DO NOTHING;

-- Insert LG models
INSERT INTO phone_models (brand_id, name) 
SELECT id, model FROM phone_brands, (VALUES 
  ('V60 ThinQ'), ('V50 ThinQ'), ('V40 ThinQ'),
  ('G8 ThinQ'), ('G7 ThinQ'),
  ('Velvet'), ('Wing'),
  ('K61'), ('K51'), ('K41'),
  ('Stylo 6'), ('Stylo 5')
) AS t(model) WHERE phone_brands.name = 'LG'
ON CONFLICT DO NOTHING;

-- Insert accessory categories
INSERT INTO accessory_categories (name, icon) VALUES 
  ('Chargers', 'zap'),
  ('Cables', 'cable'),
  ('Back Covers', 'smartphone'),
  ('Tempered Glass', 'shield'),
  ('Charging Docks', 'battery-charging'),
  ('Handsfree', 'headphones'),
  ('Power Banks', 'battery')
ON CONFLICT (name) DO NOTHING;

-- Insert SIM providers
INSERT INTO sim_providers (name) VALUES 
  ('Dialog'),
  ('Mobitel'),
  ('Hutch'),
  ('Airtel')
ON CONFLICT (name) DO NOTHING;

-- Insert Router providers
INSERT INTO router_providers (name) VALUES 
  ('Dialog'),
  ('Mobitel')
ON CONFLICT (name) DO NOTHING;

-- Insert default services
INSERT INTO services (name, description, price, price_unit, icon) VALUES 
  ('Photocopy - B&W', 'Black and white photocopy service', 5.00, 'per page', 'copy'),
  ('Photocopy - Color', 'Color photocopy service', 20.00, 'per page', 'copy'),
  ('Printout - B&W', 'Black and white printout service', 10.00, 'per page', 'printer'),
  ('Printout - Color', 'Color printout service', 30.00, 'per page', 'printer'),
  ('Lamination - A4', 'A4 size lamination', 50.00, 'per sheet', 'layers'),
  ('Lamination - A3', 'A3 size lamination', 100.00, 'per sheet', 'layers'),
  ('Scanning', 'Document scanning service', 20.00, 'per page', 'scan'),
  ('Display Replacement', 'Mobile phone display replacement service', NULL, 'varies by model', 'smartphone')
ON CONFLICT DO NOTHING;

-- Create admin user (password: admin123 - should be changed)
INSERT INTO users (name, email, password_hash, role) VALUES 
  ('Admin', 'admin@expressnetcafe.com', '$2b$10$YourHashedPasswordHere', 'admin')
ON CONFLICT (email) DO NOTHING;
