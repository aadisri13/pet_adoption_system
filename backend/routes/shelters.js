const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all shelters with available pets count using stored function
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.*,
        fn_shelter_pets_available(s.shelter_id) as available_pets_count
      FROM shelter s
      ORDER BY s.shelter_id
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching shelters:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get shelter by ID with available pets
router.get('/:id', async (req, res) => {
  try {
    const shelterQuery = `
      SELECT 
        s.*,
        fn_shelter_pets_available(s.shelter_id) as available_pets_count
      FROM shelter s
      WHERE s.shelter_id = ?
    `;
    const [shelterRows] = await pool.execute(shelterQuery, [req.params.id]);
    
    if (shelterRows.length === 0) {
      return res.status(404).json({ error: 'Shelter not found' });
    }

    const petsQuery = `
      SELECT 
        p.*,
        fn_pet_age_years(p.pet_id) as age_years
      FROM pet p
      WHERE p.shelter_id = ? AND p.status = 'available'
      ORDER BY p.pet_id DESC
    `;
    const [petsRows] = await pool.execute(petsQuery, [req.params.id]);

    res.json({
      ...shelterRows[0],
      available_pets: petsRows
    });
  } catch (error) {
    console.error('Error fetching shelter:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

