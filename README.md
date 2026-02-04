# 🛠️ Express Net Cafe - Mobile Repair & Services Platform

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

A robust, full-stack web ecosystem built for **Express Net Cafe** (Dompe, Sri Lanka). This platform streamlines mobile repair tracking, e-commerce for accessories, and real-time customer engagement.

🔗 **Live Demo:** [www.expressnetcafe.com](https://www.expressnetcafe.com)

---

## 🌟 Key Features

### 📱 Customer Experience
* **Repair Price Catalog:** Instant quotes for Samsung, Apple, Huawei, and Honor displays.
* **Battery Services:** Dedicated section for battery replacements with warranty tracking.
* **E-commerce Lite:** Browse and search for chargers, routers (Dialog/Mobitel), TVs, and SIM cards.
* **Real-time Support:** Integrated live chat widget for instant inquiries.
* **Community Trust:** User registration and verified review system.

### 🔐 Admin Management
* **Dynamic Dashboard:** Real-time stats on inventory levels and site traffic.
* **Inventory Control:** Full CRUD operations for products, brands, and repair parts.
* **Moderation Suite:** Approve/reject customer reviews and manage user roles.
* **Live Chat Hub:** Centralized interface to respond to customer messages.
* **Media Management:** Automated image optimization via Cloudinary integration.

---

## 🏗️ Technical Architecture



### **The Stack**
* **Frontend:** Next.js 16 (App Router), Tailwind CSS 4.1, Radix UI (Shadcn/UI).
* **Backend:** Next.js Serverless Functions, Node.js.
* **Database:** PostgreSQL (hosted on Neon.tech) with `@neondatabase/serverless`.
* **Storage:** Cloudinary CDN for high-performance image delivery.
* **Auth:** Custom session-based authentication with Role-Based Access Control (RBAC).

---

## 📁 Database Schema Preview

The system relies on a relational PostgreSQL structure:
* **Core:** `users`, `phone_brands`, `phone_models`.
* **Pricing:** `display_prices`, `battery_prices`.
* **Sales:** `accessories`, `sim_cards`, `routers`, `televisions`.
* **Engagement:** `chat_sessions`, `chat_messages`, `reviews`.

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+
* PostgreSQL Instance (Neon recommended)
* Cloudinary Account

### Installation

1.  **Clone & Install**
    ```bash
    git clone [https://github.com/Lahindu2001/express-net-cafe-.git](https://github.com/Lahindu2001/express-net-cafe-.git)
    cd express-net-cafe-
    npm install
    ```

2.  **Environment Setup**
    Create a `.env.local` file:
    ```env
    DATABASE_URL="your_postgresql_uri"
    CLOUDINARY_CLOUD_NAME="your_name"
    CLOUDINARY_API_KEY="your_key"
    CLOUDINARY_API_SECRET="your_secret"
    SESSION_SECRET="your_random_string"
    NEXT_PUBLIC_URL="http://localhost:3000"
    ```

3.  **Database Migration**
    Execute the scripts found in `/scripts` against your SQL editor:
    ```sql
    -- Run in order:
    1. setup-database.sql
    2. setup-chat.sql
    3. seed-users.sql
    ```

4.  **Run Development**
    ```bash
    npm run dev
    ```

---

## 📈 SEO & Performance
* **SSR/SSG:** Optimized page loading using Next.js rendering patterns.
* **Meta Excellence:** Dynamic JSON-LD structured data and Open Graph tags.
* **Visibility:** Automated `sitemap.xml` and `robots.txt` generation.
* **Analytics:** Integrated Vercel Speed Insights and Google Search Console.

---

## 👨‍💻 Admin Access
For testing the management suite:
* **URL:** `/admin`
* **Default Credentials:** * *Email:* `admin@expressnetcafe.com`
    * *Password:* `admin123`
    > **Note:** Please change credentials immediately after the first login.

---

## 🤝 Contact
**Express Net Cafe**
📍 346, Medalanda, Dompe, Elpitiya, Sri Lanka.
📞 [0702882883](tel:0702882883)

**Developer:** [Lahindu2001](https://github.com/Lahindu2001)

---
*Built with ❤️ for a better mobile service experience.*
