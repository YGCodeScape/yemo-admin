<div align="center">

<img src="public/icons/yemo-logo-bg.png" alt="Yemo Logo" width="110" style="border-radius: 24px;" />

# Yemo Admin — Artisanal Café Operations & POS Suite

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Turbopack](https://img.shields.io/badge/Turbopack-Blazing_Fast-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A state-of-the-art, design-forward café management platform engineered for specialty coffee roasteries, artisanal eateries, and modern dining venues.**

[Explore Features](#-core-operational-modules) • [What Sets Yemo Apart](#-why-yemo-is-different--modern) • [Getting Started](#-getting-started) • [Customer App](#-looking-for-the-customer-dining-app)

</div>

---

## 🌿 Philosophy: Why Yemo is Different & Modern

Most restaurant admin dashboards look like generic, cold corporate spreadsheets or cluttered legacy point-of-sale systems from 2012. **Yemo completely redefines café administration.**


* **Zero-Friction Live Floor Orchestration:** Real-time visibility into table occupancy, kitchen order queues, and barista ticket velocities without page refreshes or bloated navigation.
* **Staff Privacy Guard:** Built-in operational role protection. Staff members get full operational capability (taking orders, checking table states, serving guests, and viewing dietary allergies) while sensitive financial data, guest phone numbers, and lifetime spends are automatically masked.
* **BCG Menu Engineering Intelligence:** Goes beyond simple sales counts by categorizing your menu into *Stars*, *Plowhorses*, *Puzzles*, and *Underperformers*, showing exactly which items yield high margin and which require recipe tweaks.
* **Closed-Loop Loyalty Economy:** A native "Beans" loyalty program that balances customer lifetime value (LTV) with real-time redemption thresholds and tier perks.
* **Hardware & Thermal POS Ready:** Integrated ESC/POS kitchen order ticket (KOT) configurations, automated tax invoice settlement, and real-time audio chimes for fast-paced barista environments.

---

## 🚀 Core Operational Modules

### 1. Executive Dashboard & Live Floor Velocity
* Real-time gross revenue, order volume, active tables, and low inventory warnings.
* Dynamic operational greeting with synchronized real-time café clock.
* Quick-action shortcuts for registering walk-in diners, creating orders, and adjusting inventory.

### 2. Kitchen & Order Pipeline
* Interactive kanban & list views for live orders (`Pending`, `Preparing`, `Ready`, `Served`, `Completed`).
* Table-linked order tracking with preparation countdown timers.
* Auto-KOT thermal ticket triggers for barista and kitchen stations.

### 3. Interactive Table & Floor Plan Management
* Visual layout of café floor sections (Indoor Lounge, Window Counter, Outdoor Patio).
* Live table states: `Available`, `Occupied`, `Reserved`, and `Cleaning`.
* One-click generation of branded table QR codes with instant print/download for acrylic tabletop stands.

### 4. Artisanal Menu Engineering
* Granular categorization (Specialty Coffee, Pour Overs, Cold Brews, Artisanal Bakery, Savory).
* Dietary restriction tagging: 🌱 Vegetarian, 🌿 Vegan, 🌾 Gluten-Free, and ☕ Chef’s Special.
* Instant price adjustments, recipe margin calculations, and 86-item availability toggling.

### 5. Inventory & Supply Chain Control
* Real-time stock levels with automated low-stock warnings (`Warning` and `Critical`).
* Metric unit tracking (kilograms, liters, packages, bakery units).
* Quick stock adjustments with reason auditing (spillage, shift usage, waste reconciliation).

### 6. Restock History & Purchase Orders
* Procurement timeline tracking PO numbers, suppliers, and delivery dates.
* Status tracking (`Dispatched`, `In Transit`, `Delivered`).
* Total procurement spending reconciliations.

### 7. Customer CRM & Loyalty Bean Economy
* Guest dining history, visit frequency, favorite order items, and hospitality notes.
* Dietary allergy alerts displayed directly on customer profile drawers.
* Automated tier progression: **Bronze** (Welcome), **Silver** (Regular), and **Gold VIP** (Top Patron).
* Manual and automated Loyalty Beans crediting with reason auditing.
* Account deactivation and reactivation controls.

### 8. Business Analytics & Financial Insights
* Multi-period financial trajectories (Today, 7 Days, 30 Days, This Month, 90 Days).
* BCG Menu Matrix analyzing margin contribution vs. item sales velocity.
* Channel distribution analytics: Dine-in vs. Grab-and-Go vs. Table QR Self-Order.
* Settlement breakdown: UPI / QR Instant, Credit/Debit POS, and Cash Tendered.
* Peak hours heatmap identifying dining surges for optimized barista shift scheduling.

### 9. Store Configuration & Hardware Systems
* Café brand details, legal entity name, GSTIN compliance, and diner Wi-Fi credentials.
* Kitchen prep buffers and automated peak-hour surge buffers.
* Indian F&B GST tax rates (5% default) and optional service charge pooling.
* Team staff directory with 4-digit POS terminal quick-PIN access.
* ESC/POS network thermal printer testing and automatic receipt printing rules.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Partial Prefetching) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **UI & Styling** | [Tailwind CSS 4](https://tailwindcss.com/) & Vanilla CSS Design Tokens |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) |
| **Data Visualizations** | [Recharts](https://recharts.org/) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) with LocalStorage Persistence |
| **Typography** | Playfair Display, Lily Script One, Inter |

---

## 🏁 Getting Started

### Prerequisites
* Node.js 18.18+ or Node.js 20+
* npm, pnpm, or yarn

### 1. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/yemo-admin.git
cd yemo-admin
npm install
```

### 2. Development Server
Launch the local development environment with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the Yemo Admin Panel.

### 3. Production Build
Verify code quality and create an optimized production bundle:

```bash
# Typecheck
npm run typecheck # or npx tsc --noEmit

# Lint check
npm run lint

# Build production bundle
npm run build
```

---

## 📱 Looking for the Customer Dining App?

Yemo is a complete dual-experience café platform. While this repository powers the **Back-of-House Administration, POS, and Kitchen Operations**, our diner-facing web application allows guests to scan table QR codes, explore handcrafted menus, customize roasts, redeem loyalty beans, and order seamlessly.

> [!TIP]
> 🔗 **Live Customer App:** Experience the diner-facing ordering experience on Vercel at:  
> **[https://yemo-customer.vercel.app](https://yemo-customer.vercel.app)** *(replace with your live URL)*

---

<div align="center">

Crafted with care for **Yemo Café & Roastery** · *Driven by Data, Brewed with Passion.*

</div>
