<<<<<<< HEAD
# ShopEase — Simple E-Commerce App

A full-stack e-commerce demo with **React** frontend, **Node.js/Express** backend, and **SQLite** database.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  React + React Router + Vite  (port 5173)                   │
│  Pages: Home · Product Detail · Shopping Cart               │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTP /api/* (Vite proxy)
┌──────────────────────────▼──────────────────────────────────┐
│                         BACKEND                             │
│  Node.js + Express  (port 3001)                             │
│  REST API: products · cart (add / update qty / remove)      │
└──────────────────────────┬──────────────────────────────────┘
                           │  better-sqlite3
┌──────────────────────────▼──────────────────────────────────┐
│                        DATABASE                             │
│  SQLite  (backend/data/shop.db)                             │
│  Tables: products · reviews · cart_items                    │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
.
├── backend/
│   ├── package.json
│   └── src/
│       ├── index.js               # Express entry point
│       ├── db/
│       │   └── database.js        # SQLite init + seed (20 products)
│       └── routes/
│           ├── products.js        # GET /api/products, GET /api/products/:id
│           └── cart.js            # GET/POST/PUT/DELETE /api/cart
└── frontend/
    ├── package.json
    ├── vite.config.js             # Proxies /api → localhost:3001
    ├── index.html
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── contexts/
        │   └── CartContext.jsx    # Cart count shared across app
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProductCard.jsx
        │   └── StarRating.jsx
        └── pages/
            ├── HomePage.jsx       # 20-product grid
            ├── ProductPage.jsx    # Detail, qty picker, add-to-cart, reviews
            └── CartPage.jsx       # Cart table, qty update, delete, order summary
```

## Quick Start

Open **two terminals** and run each server:

### Terminal 1 — Backend
```bash
cd backend
npm install        # first time only
npm start
# Server starts on http://localhost:3001
```

### Terminal 2 — Frontend
```bash
cd frontend
npm install        # first time only
npm run dev
# App opens on http://localhost:5173
```

Open your browser at **http://localhost:5173**.

## API Reference

| Method | Endpoint              | Description                                      |
|--------|-----------------------|--------------------------------------------------|
| GET    | `/api/products`       | List all 20 products                             |
| GET    | `/api/products/:id`   | Single product with reviews                      |
| GET    | `/api/cart`           | Cart items + total                               |
| POST   | `/api/cart`           | Add item `{ product_id, quantity }`              |
| PUT    | `/api/cart/:id`       | Update quantity `{ quantity }`                   |
| DELETE | `/api/cart/:id`       | Remove item                                      |

## Database Schema

```sql
CREATE TABLE products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  description TEXT,
  price       REAL    NOT NULL,
  emoji       TEXT    NOT NULL,
  category    TEXT
);

CREATE TABLE reviews (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  reviewer    TEXT    NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT
);

CREATE TABLE cart_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id  INTEGER NOT NULL UNIQUE REFERENCES products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0)
);
```
=======
# ecomm_Devops_Proj
A full-stack e-commerce demo proj for Devops practice
>>>>>>> 155c24045993a48ae0d81342eb98436f56abf29a
