const express = require('express');
const { getDb } = require('../db/database');

const router = express.Router();

// GET /api/products — list all products
router.get('/', (_req, res) => {
  try {
    const products = getDb().prepare('SELECT * FROM products ORDER BY id').all();
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// GET /api/products/:id — single product + reviews
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    const product = getDb().prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const reviews = getDb().prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY id').all(id);
    res.json({ ...product, reviews });
  } catch {
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

module.exports = router;
