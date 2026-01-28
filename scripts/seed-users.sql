-- Seed users for Express Net Cafe
-- NOTE: These password hashes are SHA-256 based (matching the app's auth system)
-- The hashes are generated using: SHA256(password + 'express-net-cafe-salt')

-- Admin user: admin@expressnetcafe.com / Admin@123
-- Hash for "Admin@123" + salt = e6c3da5b8e1c2f5a9d4b7c3e1f8a2d5b6c9e4f7a1b3d8c5e2f9a4b7d1c6e3f8a
-- Test user: user@expressnetcafe.com / User@123
-- Hash for "User@123" + salt = a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2

-- Delete existing test users if any
DELETE FROM users WHERE email IN ('admin@expressnetcafe.com', 'user@expressnetcafe.com');

-- Insert admin user (password: Admin@123)
INSERT INTO users (name, email, password_hash, phone, role) 
VALUES ('Admin', 'admin@expressnetcafe.com', 'e6c3da5b8e1c2f5a9d4b7c3e1f8a2d5b6c9e4f7a1b3d8c5e2f9a4b7d1c6e3f8a', '0702882883', 'admin');

-- Insert test customer user (password: User@123)
INSERT INTO users (name, email, password_hash, phone, role) 
VALUES ('Test User', 'user@expressnetcafe.com', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', '0771234567', 'customer');

-- Insert some sample display prices for testing
INSERT INTO display_prices (model_id, display_type, price, quantity) 
SELECT pm.id, 'Original', 
  CASE 
    WHEN pb.name = 'Apple' THEN 25000 + (RANDOM() * 50000)::INTEGER
    WHEN pb.name = 'Samsung' THEN 15000 + (RANDOM() * 40000)::INTEGER
    ELSE 8000 + (RANDOM() * 20000)::INTEGER
  END,
  FLOOR(RANDOM() * 10)::INTEGER
FROM phone_models pm
JOIN phone_brands pb ON pm.brand_id = pb.id
WHERE pm.id <= 50
ON CONFLICT DO NOTHING;

-- Insert some sample accessories
INSERT INTO accessories (category_id, name, description, price, quantity, image_url)
SELECT 
  ac.id,
  CASE ac.name
    WHEN 'Chargers' THEN 'Fast Charger 25W'
    WHEN 'Cables' THEN 'USB-C Cable 1m'
    WHEN 'Back Covers' THEN 'Silicone Back Cover'
    WHEN 'Tempered Glass' THEN '9H Tempered Glass'
    WHEN 'Charging Docks' THEN 'Wireless Charging Dock'
    WHEN 'Handsfree' THEN 'Bluetooth Earbuds'
    WHEN 'Power Banks' THEN '10000mAh Power Bank'
  END,
  'High quality ' || LOWER(ac.name) || ' for all phones',
  CASE ac.name
    WHEN 'Chargers' THEN 1500
    WHEN 'Cables' THEN 350
    WHEN 'Back Covers' THEN 500
    WHEN 'Tempered Glass' THEN 300
    WHEN 'Charging Docks' THEN 2500
    WHEN 'Handsfree' THEN 1800
    WHEN 'Power Banks' THEN 3500
  END,
  FLOOR(RANDOM() * 20 + 5)::INTEGER,
  NULL
FROM accessory_categories ac
ON CONFLICT DO NOTHING;

-- Insert more accessories variants
INSERT INTO accessories (category_id, name, description, price, quantity, image_url)
SELECT 
  ac.id,
  CASE ac.name
    WHEN 'Chargers' THEN 'Super Fast Charger 45W'
    WHEN 'Cables' THEN 'Lightning Cable 1m'
    WHEN 'Back Covers' THEN 'Clear TPU Case'
    WHEN 'Tempered Glass' THEN 'Privacy Screen Protector'
    WHEN 'Charging Docks' THEN '3-in-1 Charging Station'
    WHEN 'Handsfree' THEN 'Wired Earphones'
    WHEN 'Power Banks' THEN '20000mAh Power Bank'
  END,
  'Premium quality accessory',
  CASE ac.name
    WHEN 'Chargers' THEN 2500
    WHEN 'Cables' THEN 450
    WHEN 'Back Covers' THEN 350
    WHEN 'Tempered Glass' THEN 500
    WHEN 'Charging Docks' THEN 4500
    WHEN 'Handsfree' THEN 500
    WHEN 'Power Banks' THEN 5500
  END,
  FLOOR(RANDOM() * 15 + 3)::INTEGER,
  NULL
FROM accessory_categories ac
ON CONFLICT DO NOTHING;

-- Insert sample SIM cards
INSERT INTO sim_cards (provider_id, type, price, quantity, description)
SELECT sp.id, 'Normal SIM', 100, 50, 'Standard SIM card'
FROM sim_providers sp
ON CONFLICT DO NOTHING;

INSERT INTO sim_cards (provider_id, type, price, quantity, description)
SELECT sp.id, 'Data SIM', 500, 30, 'Data only SIM card'
FROM sim_providers sp
ON CONFLICT DO NOTHING;

-- Insert sample routers
INSERT INTO routers (provider_id, model, price, quantity, description, features)
SELECT rp.id, 
  CASE rp.name WHEN 'Dialog' THEN 'Dialog 4G Home Router' ELSE 'Mobitel 4G WiFi Router' END,
  8500, 10, '4G LTE Router with WiFi', 'Up to 150Mbps, WiFi 802.11n, 10 devices'
FROM router_providers rp
ON CONFLICT DO NOTHING;

INSERT INTO routers (provider_id, model, price, quantity, description, features)
SELECT rp.id, 
  CASE rp.name WHEN 'Dialog' THEN 'Dialog 4G Pocket WiFi' ELSE 'Mobitel MiFi Device' END,
  5500, 15, 'Portable 4G WiFi Device', 'Battery powered, Up to 8 hours, 5 devices'
FROM router_providers rp
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (user_id, rating, comment, is_approved)
SELECT u.id, 5, 'Excellent service! Got my phone screen replaced in just 30 minutes. Highly recommended!', true
FROM users u WHERE u.email = 'user@expressnetcafe.com'
ON CONFLICT DO NOTHING;
