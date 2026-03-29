const express = require('express');
const { getDb } = require('../db/database');

const router = express.Router();

const CART_QUERY = `
  SELECT ci.id, ci.quantity,
         p.id AS product_id, p.name, p.price, p.emoji
  FROM   cart_items ci
  JOIN   products   p ON p.id = ci.product_id
  ORDER  BY ci.id
`;

// GET /api/cart
router.get('/', (_req, res) => {
  try {
    const items = getDb().prepare(CART_QUERY).all();
    const total = parseFloat(
      items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
    );
    res.json({ items, total });
  } catch {
    res.status(500).json({ error: 'Failed to fetch cart.' });
  }
});

// POST /api/cart — add item (merges if already present)
router.post('/', (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const pid = parseInt(product_id, 10);
    const qty = parseInt(quantity, 10);

    if (!Number.isInteger(pid) || pid < 1 || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: 'product_id and quantity must be positive integers.' });
    }

    const db = getDb();
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(pid);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const existing = db.prepare('SELECT id, quantity FROM cart_items WHERE product_id = ?').get(pid);
    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?')
        .run(existing.quantity + qty, existing.id);
    } else {
      db.prepare('INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)').run(pid, qty);
    }

    res.status(201).json({ message: 'Item added to cart.' });
  } catch {
    res.status(500).json({ error: 'Failed to add item to cart.' });
  }
});

// PUT /api/cart/:id — update quantity
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const qty = parseInt(req.body.quantity, 10);

    if (!Number.isInteger(id) || id < 1 || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: 'id and quantity must be positive integers.' });
    }

    const db = getDb();
    const item = db.prepare('SELECT id FROM cart_items WHERE id = ?').get(id);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(qty, id);
    res.json({ message: 'Cart updated.' });
  } catch {
    res.status(500).json({ error: 'Failed to update cart.' });
  }
});

// DELETE /api/cart/:id — remove item
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid cart item ID.' });
    }

    const db = getDb();
    const item = db.prepare('SELECT id FROM cart_items WHERE id = ?').get(id);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    db.prepare('DELETE FROM cart_items WHERE id = ?').run(id);
    res.json({ message: 'Item removed.' });
  } catch {
    res.status(500).json({ error: 'Failed to remove cart item.' });
  }
});

module.exports = router;
