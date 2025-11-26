const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all products
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM product ORDER BY product_id DESC';
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const query = 'SELECT * FROM product WHERE product_id = ?';
    const [rows] = await pool.execute(query, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Restock product using stored procedure
router.post('/:id/restock', async (req, res) => {
  try {
    const product_id = req.params.id;
    const { qty } = req.body;

    if (!qty || qty <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    // Call stored procedure
    await pool.execute('CALL pr_restock_product(?, ?)', [product_id, qty]);

    // Get updated product
    const [rows] = await pool.execute('SELECT * FROM product WHERE product_id = ?', [product_id]);
    
    res.json({
      message: 'Product restocked successfully',
      product: rows[0]
    });
  } catch (error) {
    console.error('Error restocking product:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

