const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all pets with age using stored function and pending applications count
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        fn_pet_age_years(p.pet_id) as age_years,
        s.shelter_name,
        s.city as shelter_city,
        COALESCE((
          SELECT COUNT(*) 
          FROM adoption_application a 
          WHERE a.pet_id = p.pet_id AND a.status = 'pending'
        ), 0) as pending_applications_count
      FROM pet p
      LEFT JOIN shelter s ON p.shelter_id = s.shelter_id
      ORDER BY p.pet_id DESC
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get available pets only
router.get('/available', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        fn_pet_age_years(p.pet_id) as age_years,
        s.shelter_name,
        s.city as shelter_city
      FROM pet p
      LEFT JOIN shelter s ON p.shelter_id = s.shelter_id
      WHERE p.status = 'available'
      ORDER BY p.pet_id DESC
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching available pets:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get pet by ID
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        fn_pet_age_years(p.pet_id) as age_years,
        s.shelter_name,
        s.city as shelter_city,
        s.state as shelter_state
      FROM pet p
      LEFT JOIN shelter s ON p.shelter_id = s.shelter_id
      WHERE p.pet_id = ?
    `;
    const [rows] = await pool.execute(query, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

