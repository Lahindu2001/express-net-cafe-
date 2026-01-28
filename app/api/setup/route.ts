import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST() {
  try {
    // Create admin user
    const adminHash = await hashPassword("Admin@123")
    const userHash = await hashPassword("User@123")

    // Delete existing test users if any
    await sql`DELETE FROM users WHERE email IN ('admin@expressnetcafe.com', 'user@expressnetcafe.com')`

    // Insert admin user
    await sql`
      INSERT INTO users (name, email, password_hash, phone, role) 
      VALUES ('Admin', 'admin@expressnetcafe.com', ${adminHash}, '0702882883', 'admin')
    `

    // Insert test customer user
    await sql`
      INSERT INTO users (name, email, password_hash, phone, role) 
      VALUES ('Test User', 'user@expressnetcafe.com', ${userHash}, '0771234567', 'customer')
    `

    // Insert sample display prices
    await sql`
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
      WHERE pm.id <= 100
      ON CONFLICT DO NOTHING
    `

    // Insert sample accessories
    const accessoryData = [
      { category: 'Chargers', items: [
        { name: 'Fast Charger 25W', price: 1500, desc: 'Quick charge adapter for all phones' },
        { name: 'Super Fast Charger 45W', price: 2500, desc: 'Samsung super fast charging adapter' },
        { name: 'USB Charger 10W', price: 800, desc: 'Standard USB charger' }
      ]},
      { category: 'Cables', items: [
        { name: 'USB-C Cable 1m', price: 350, desc: 'Type-C to USB cable' },
        { name: 'Lightning Cable 1m', price: 450, desc: 'Apple Lightning cable' },
        { name: 'Micro USB Cable', price: 200, desc: 'Micro USB charging cable' }
      ]},
      { category: 'Back Covers', items: [
        { name: 'Silicone Back Cover', price: 500, desc: 'Soft silicone protective case' },
        { name: 'Clear TPU Case', price: 350, desc: 'Transparent protective case' },
        { name: 'Armor Case', price: 800, desc: 'Heavy duty protection case' }
      ]},
      { category: 'Tempered Glass', items: [
        { name: '9H Tempered Glass', price: 300, desc: 'Premium screen protector' },
        { name: 'Privacy Screen Protector', price: 500, desc: 'Anti-spy tempered glass' },
        { name: 'Full Cover Glass', price: 400, desc: 'Edge to edge protection' }
      ]},
      { category: 'Charging Docks', items: [
        { name: 'Wireless Charging Dock', price: 2500, desc: 'Qi wireless charger' },
        { name: '3-in-1 Charging Station', price: 4500, desc: 'Phone, watch & earbuds charger' }
      ]},
      { category: 'Handsfree', items: [
        { name: 'Bluetooth Earbuds', price: 1800, desc: 'True wireless earbuds' },
        { name: 'Wired Earphones', price: 500, desc: 'In-ear headphones with mic' },
        { name: 'Neckband Bluetooth', price: 1200, desc: 'Bluetooth neckband earphones' }
      ]},
      { category: 'Power Banks', items: [
        { name: '10000mAh Power Bank', price: 3500, desc: 'Portable power bank' },
        { name: '20000mAh Power Bank', price: 5500, desc: 'High capacity power bank' },
        { name: '5000mAh Mini Power Bank', price: 2000, desc: 'Compact portable charger' }
      ]}
    ]

    for (const cat of accessoryData) {
      const categories = await sql`SELECT id FROM accessory_categories WHERE name = ${cat.category}`
      if (categories.length > 0) {
        const catId = categories[0].id
        for (const item of cat.items) {
          await sql`
            INSERT INTO accessories (category_id, name, description, price, quantity)
            VALUES (${catId}, ${item.name}, ${item.desc}, ${item.price}, ${Math.floor(Math.random() * 20) + 5})
            ON CONFLICT DO NOTHING
          `
        }
      }
    }

    // Insert sample SIM cards
    const simProviders = await sql`SELECT id, name FROM sim_providers`
    for (const provider of simProviders) {
      await sql`
        INSERT INTO sim_cards (provider_id, type, price, quantity, description)
        VALUES 
          (${provider.id}, 'Normal SIM', 100, 50, 'Standard ${provider.name} SIM card'),
          (${provider.id}, 'Data SIM', 500, 30, '${provider.name} data only SIM'),
          (${provider.id}, 'Tourist SIM', 1500, 20, '${provider.name} tourist package SIM')
        ON CONFLICT DO NOTHING
      `
    }

    // Insert sample routers
    const routerProviders = await sql`SELECT id, name FROM router_providers`
    for (const provider of routerProviders) {
      await sql`
        INSERT INTO routers (provider_id, model, price, quantity, description, features)
        VALUES 
          (${provider.id}, '${provider.name} 4G Home Router', 8500, 10, '4G LTE Router with WiFi', 'Up to 150Mbps, WiFi 802.11n, 10 devices'),
          (${provider.id}, '${provider.name} 4G Pocket WiFi', 5500, 15, 'Portable 4G WiFi Device', 'Battery powered, Up to 8 hours, 5 devices')
        ON CONFLICT DO NOTHING
      `
    }

    return NextResponse.json({
      success: true,
      message: "Setup complete! Test accounts created.",
      accounts: {
        admin: { email: "admin@expressnetcafe.com", password: "Admin@123" },
        user: { email: "user@expressnetcafe.com", password: "User@123" }
      }
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { error: "Setup failed", details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST to this endpoint to set up test data",
    note: "This will create admin and user accounts with sample data"
  })
}
