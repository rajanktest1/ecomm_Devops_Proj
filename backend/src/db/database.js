const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// DB_PATH env var allows overriding the database location in Docker/Kubernetes
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../../data/shop.db');

let db;

function getDb() {
  if (!db) {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initializeDatabase() {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      description TEXT,
      price       REAL    NOT NULL,
      emoji       TEXT    NOT NULL,
      category    TEXT
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id  INTEGER NOT NULL,
      reviewer    TEXT    NOT NULL,
      rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment     TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id  INTEGER NOT NULL UNIQUE,
      quantity    INTEGER NOT NULL CHECK (quantity > 0),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  const { count } = database.prepare('SELECT COUNT(*) AS count FROM products').get();
  if (count === 0) {
    seedData(database);
  }
}

function seedData(database) {
  const products = [
    { name: 'Wireless Headphones',  emoji: '🎧', price: 79.99,  category: 'Electronics',    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and immersive spatial audio.' },
    { name: 'Smartphone Pro',        emoji: '📱', price: 699.99, category: 'Electronics',    description: 'Latest-generation smartphone with a 6.7" OLED display, 5G, 200MP triple camera, and all-day battery.' },
    { name: 'Running Shoes',         emoji: '👟', price: 89.99,  category: 'Footwear',       description: 'Lightweight trail runners with advanced foam cushioning, breathable mesh upper, and carbon-fiber plate.' },
    { name: 'Gaming Controller',     emoji: '🎮', price: 54.99,  category: 'Gaming',         description: 'Ergonomic wireless controller compatible with PC and consoles, with haptic feedback and 40h battery.' },
    { name: 'JavaScript: The Guide', emoji: '📚', price: 39.99,  category: 'Books',          description: 'Comprehensive guide to modern JavaScript — ES2024, async patterns, React, Node, and beyond.' },
    { name: 'Coffee Maker Deluxe',   emoji: '☕', price: 129.99, category: 'Kitchen',        description: 'Programmable 12-cup drip coffee maker with built-in burr grinder and double-walled thermal carafe.' },
    { name: 'Indoor Succulent',      emoji: '🌿', price: 19.99,  category: 'Home & Garden',  description: 'Low-maintenance succulent collection in decorative ceramic pots — perfect for desk or windowsill.' },
    { name: 'Polarized Sunglasses',  emoji: '🕶️', price: 44.99,  category: 'Accessories',    description: 'UV400 polarized sunglasses with lightweight titanium frames and scratch-resistant lenses.' },
    { name: 'Hiking Backpack 30L',   emoji: '🎒', price: 64.99,  category: 'Bags',           description: 'Water-resistant 30L hiking pack with laptop sleeve, hip-belt pockets, and ventilated back panel.' },
    { name: '27" 4K Monitor',        emoji: '🖥️', price: 349.99, category: 'Electronics',    description: '4K IPS display, 144Hz refresh rate, HDR600, 1ms response time, USB-C 90W Power Delivery.' },
    { name: 'Mechanical Keyboard',   emoji: '⌨️', price: 99.99,  category: 'Electronics',    description: 'Compact TKL layout with Cherry MX Red switches, per-key RGB, and aircraft-grade aluminium frame.' },
    { name: 'Wireless Mouse',        emoji: '🖱️', price: 34.99,  category: 'Electronics',    description: 'Precision 4000 DPI wireless mouse, ergonomic right-handed design, 70-day battery life.' },
    { name: 'Acoustic Guitar',       emoji: '🎸', price: 189.99, category: 'Music',          description: 'Full-size dreadnought with solid spruce top, mahogany back/sides, and bone nut for rich tone.' },
    { name: 'Daily Skincare Set',    emoji: '🧴', price: 59.99,  category: 'Beauty',         description: 'Complete routine: gentle cleanser, hydrating toner, vitamin-C serum, and SPF 50 moisturiser.' },
    { name: 'Adjustable Dumbbells',  emoji: '🏋️', price: 149.99, category: 'Sports',         description: 'Space-saving set adjustable from 5–50 lbs (2.5 lb increments) with compact storage cradle.' },
    { name: 'Smart Watch Series 5',  emoji: '⌚', price: 249.99, category: 'Electronics',    description: 'Health-focused smartwatch with ECG, SpO2, GPS, sleep tracking, and 7-day battery life.' },
    { name: 'Professional Art Kit',  emoji: '🎨', price: 49.99,  category: 'Art',            description: '120-piece artist set: coloured pencils, watercolours, brushes, blending tools, and A4 sketchbook.' },
    { name: 'Giant Teddy Bear',      emoji: '🧸', price: 24.99,  category: 'Toys',           description: '18-inch ultra-soft plush teddy bear, hypoallergenic filling, machine washable — gift-ready.' },
    { name: 'Yoga Mat Pro',          emoji: '🧘', price: 29.99,  category: 'Sports',         description: 'Non-slip 6mm eco-TPE yoga mat with laser-printed alignment lines and microfibre top surface.' },
    { name: 'LED Desk Lamp',         emoji: '💡', price: 34.99,  category: 'Home & Office',  description: 'Touch-control LED lamp, 5 colour temps, 5 brightness levels, USB-C charging pad built in.' },
  ];

  const sampleReviews = [
    { reviewer: 'Alice Johnson', rating: 5, comment: 'Absolutely love this! Exceeded all my expectations.' },
    { reviewer: 'Bob Smith',     rating: 4, comment: 'Great quality for the price. Would definitely recommend.' },
    { reviewer: 'Carol White',   rating: 5, comment: 'Perfect product. Works exactly as described.' },
    { reviewer: 'David Brown',   rating: 3, comment: 'Decent overall, though the packaging could be better.' },
    { reviewer: 'Emma Davis',    rating: 4, comment: 'Solid build quality, fast delivery. Very happy with it.' },
    { reviewer: 'Frank Lee',     rating: 5, comment: 'Top-notch! This is my second purchase and still impressed.' },
    { reviewer: 'Grace Kim',     rating: 4, comment: 'Good value for money. Minor setup hassle but worth it.' },
  ];

  const insertProduct = database.prepare(
    'INSERT INTO products (name, description, price, emoji, category) VALUES (?, ?, ?, ?, ?)'
  );
  const insertReview = database.prepare(
    'INSERT INTO reviews (product_id, reviewer, rating, comment) VALUES (?, ?, ?, ?)'
  );

  const seedAll = database.transaction(() => {
    products.forEach((p, idx) => {
      const { lastInsertRowid: pid } = insertProduct.run(p.name, p.description, p.price, p.emoji, p.category);
      // Give each product 2–3 staggered reviews
      const reviewCount = 2 + (idx % 2);
      for (let i = 0; i < reviewCount; i++) {
        const r = sampleReviews[(idx + i) % sampleReviews.length];
        insertReview.run(pid, r.reviewer, r.rating, r.comment);
      }
    });
  });

  seedAll();
  console.log('Database seeded with 20 products.');
}

module.exports = { getDb, initializeDatabase };
