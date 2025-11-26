const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        t.*,
        p.product_name,
        fn_adopter_fullname(t.adopter_id) as adopter_fullname
      FROM transactions t
      LEFT JOIN product p ON t.product_id = p.product_id
      ORDER BY t.txn_date DESC
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
// This will trigger trg_transactions_after_insert
router.post('/', async (req, res) => {
  try {
    const {
      status,
      mode,
      amount,
      provider_ref,
      product_id,
      adopter_id
    } = req.body;

    if (!status || !mode || !amount || !adopter_id) {
      return res.status(400).json({ error: 'Missing required fields: status, mode, amount, adopter_id' });
    }

    const query = `
      INSERT INTO transactions (txn_date, status, mode, amount, provider_ref, product_id, adopter_id)
      VALUES (NOW(), ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      status,
      mode,
      amount,
      provider_ref || null,
      product_id || null,
      adopter_id
    ]);

    // Get the created transaction
    const [rows] = await pool.execute('SELECT * FROM transactions WHERE txn_id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: rows[0]
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT 
        t.*,
        p.product_name,
        fn_adopter_fullname(t.adopter_id) as adopter_fullname
      FROM transactions t
      LEFT JOIN product p ON t.product_id = p.product_id
      WHERE t.txn_id = ?
    `;
    const [rows] = await pool.execute(query, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

