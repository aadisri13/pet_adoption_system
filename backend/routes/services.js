const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all services (service bookings/requests)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.*,
        fn_adopter_fullname(s.adopter_id) as adopter_fullname,
        CONCAT_WS(', ',
          CASE WHEN s.grooming_service = 1 THEN 'Grooming' END,
          CASE WHEN s.vet_service = 1 THEN 'Veterinary' END,
          CASE WHEN s.training_service = 1 THEN 'Training' END
        ) as service_types
      FROM service s
      ORDER BY s.service_date DESC
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get services for a specific adopter (must come before /:id route)
router.get('/adopter/:adopter_id', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.*,
        fn_adopter_fullname(s.adopter_id) as adopter_fullname
      FROM service s
      WHERE s.adopter_id = ?
      ORDER BY s.service_date DESC
    `;
    const [rows] = await pool.execute(query, [req.params.adopter_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching adopter services:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.*,
        fn_adopter_fullname(s.adopter_id) as adopter_fullname
      FROM service s
      WHERE s.service_id = ?
    `;
    const [rows] = await pool.execute(query, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new service booking/request
router.post('/', async (req, res) => {
  try {
    const { adopter_id, service_date, grooming_service, vet_service, training_service } = req.body;

    if (!adopter_id) {
      return res.status(400).json({ error: 'Missing required field: adopter_id' });
    }

    // At least one service must be selected
    if (!grooming_service && !vet_service && !training_service) {
      return res.status(400).json({ error: 'At least one service must be selected' });
    }

    const query = `
      INSERT INTO service (adopter_id, service_date, grooming_service, vet_service, training_service)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
      adopter_id,
      service_date || new Date().toISOString().slice(0, 19).replace('T', ' '),
      grooming_service ? 1 : 0,
      vet_service ? 1 : 0,
      training_service ? 1 : 0
    ]);

    res.status(201).json({
      message: 'Service booking created successfully',
      service_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

