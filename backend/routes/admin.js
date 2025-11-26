const express = require('express');
const router = express.Router();
const pool = require('../db');

// Approve adoption using stored procedure
// This will trigger trg_adoption_after_update
router.post('/approve/:app_no', async (req, res) => {
  try {
    const app_no = req.params.app_no;

    // Call stored procedure
    await pool.execute('CALL pr_approve_adoption(?)', [app_no]);

    res.json({
      message: 'Adoption application approved successfully',
      app_no: app_no
    });
  } catch (error) {
    console.error('Error approving adoption:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reject adoption application
router.post('/reject/:app_no', async (req, res) => {
  try {
    const app_no = req.params.app_no;

    // Check if application exists and is pending
    const [apps] = await pool.execute(
      'SELECT app_no, status, pet_id FROM adoption_application WHERE app_no = ?',
      [app_no]
    );

    if (apps.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (apps[0].status !== 'pending') {
      return res.status(400).json({ 
        error: `Cannot reject application. Current status: ${apps[0].status}` 
      });
    }

    // Update application status to rejected
    await pool.execute(
      'UPDATE adoption_application SET status = ? WHERE app_no = ?',
      ['rejected', app_no]
    );

    // Check if pet should be set back to available
    // (if no other pending applications exist for this pet)
    const [pendingApps] = await pool.execute(
      'SELECT COUNT(*) as count FROM adoption_application WHERE pet_id = ? AND status = ?',
      [apps[0].pet_id, 'pending']
    );

    if (pendingApps[0].count === 0) {
      // No more pending applications, set pet back to available
      await pool.execute(
        'UPDATE pet SET status = ? WHERE pet_id = ? AND status = ?',
        ['available', apps[0].pet_id, 'pending']
      );
    }

    res.json({
      message: 'Adoption application rejected successfully',
      app_no: app_no
    });
  } catch (error) {
    console.error('Error rejecting adoption:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all pending applications
router.get('/pending', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        fn_adopter_fullname(a.adopter_id) as adopter_fullname,
        p.name as pet_name,
        p.species,
        p.breed,
        s.shelter_name
      FROM adoption_application a
      LEFT JOIN pet p ON a.pet_id = p.pet_id
      LEFT JOIN shelter s ON p.shelter_id = s.shelter_id
      WHERE a.status = 'pending'
      ORDER BY a.app_date DESC
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pending applications:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all approved applications
router.get('/approved', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        fn_adopter_fullname(a.adopter_id) as adopter_fullname,
        p.name as pet_name,
        p.species,
        p.breed,
        s.shelter_name
      FROM adoption_application a
      LEFT JOIN pet p ON a.pet_id = p.pet_id
      LEFT JOIN shelter s ON p.shelter_id = s.shelter_id
      WHERE a.status = 'approved'
      ORDER BY a.app_date DESC
    `;
    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching approved applications:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

