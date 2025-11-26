const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all adopters with fullname using stored function
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        fn_adopter_fullname(a.adopter_id) as fullname
      FROM adopter a
      ORDER BY a.adopter_id DESC
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching adopters:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get adopter by ID
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        fn_adopter_fullname(a.adopter_id) as fullname
      FROM adopter a
      WHERE a.adopter_id = ?
    `;
    const [rows] = await pool.execute(query, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Adopter not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching adopter:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new adopter
router.post('/', async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      dob,
      nationality,
      govt_id,
      email,
      city,
      country,
      zipcode
    } = req.body;

    if (!firstname || !lastname || !email) {
      return res.status(400).json({ error: 'Missing required fields: firstname, lastname, email' });
    }

    const query = `
      INSERT INTO adopter (firstname, lastname, dob, nationality, govt_id, email, city, country, zipcode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      firstname,
      lastname,
      dob || null,
      nationality || null,
      govt_id || null,
      email,
      city || null,
      country || null,
      zipcode || null
    ]);

    res.status(201).json({
      message: 'Adopter created successfully',
      adopter_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating adopter:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

