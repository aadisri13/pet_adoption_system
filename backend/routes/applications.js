const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all applications with adopter fullname using stored function
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        fn_adopter_fullname(a.adopter_id) as adopter_fullname,
        p.name as pet_name,
        p.species,
        p.breed
      FROM adoption_application a
      LEFT JOIN pet p ON a.pet_id = p.pet_id
      ORDER BY a.app_date DESC
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create adoption application using stored procedure
// This will trigger trg_adoption_before_insert
router.post('/', async (req, res) => {
  try {
    const { adopter_id, pet_id, app_fee } = req.body;

    if (!adopter_id || !pet_id || app_fee === undefined) {
      return res.status(400).json({ error: 'Missing required fields: adopter_id, pet_id, app_fee' });
    }

    // Call stored procedure
    const [result] = await pool.execute(
      'CALL pr_create_adoption_application(?, ?, ?, @new_app_no)',
      [adopter_id, pet_id, app_fee]
    );

    // Get the output parameter
    const [output] = await pool.execute('SELECT @new_app_no as new_app_no');
    const new_app_no = output[0].new_app_no;

    res.status(201).json({
      message: 'Adoption application created successfully',
      app_no: new_app_no
    });
  } catch (error) {
    console.error('Error creating application:', error);
    
    // Handle trigger errors
    if (error.message.includes('Pet not found') || error.message.includes('not available')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Get application by ID
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        fn_adopter_fullname(a.adopter_id) as adopter_fullname,
        p.name as pet_name,
        p.species,
        p.breed,
        fn_pet_age_years(p.pet_id) as pet_age_years
      FROM adoption_application a
      LEFT JOIN pet p ON a.pet_id = p.pet_id
      WHERE a.app_no = ?
    `;
    const [rows] = await pool.execute(query, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

