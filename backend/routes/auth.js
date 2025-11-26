const express = require('express');
const router = express.Router();
const pool = require('../db');

// Employee login
router.post('/login', async (req, res) => {
  try {
    const { emp_id, password } = req.body;

    if (!emp_id || !password) {
      return res.status(400).json({ error: 'Employee ID and password are required' });
    }

    // Check if employee exists and password matches
    const query = `
      SELECT 
        emp_id,
        shelter_id,
        firstname,
        lastname,
        role,
        hire_date
      FROM employee
      WHERE emp_id = ? AND password = ?
    `;
    
    const [rows] = await pool.execute(query, [emp_id, password]);
    
    // Debug: Check if employee exists at all
    if (rows.length === 0) {
      // Check if employee exists but password is wrong
      const [empCheck] = await pool.execute('SELECT emp_id, password FROM employee WHERE emp_id = ?', [emp_id]);
      if (empCheck.length > 0) {
        console.log('Employee found but password mismatch. DB password:', empCheck[0].password);
        return res.status(401).json({ error: 'Invalid password' });
      }
      return res.status(401).json({ error: 'Invalid employee ID or password' });
    }

    // Return employee info (without password)
    res.json({
      message: 'Login successful',
      employee: rows[0]
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current employee info (for checking if logged in)
router.get('/me', async (req, res) => {
  try {
    const { emp_id } = req.query;
    
    if (!emp_id) {
      return res.status(400).json({ error: 'Employee ID required' });
    }

    const query = `
      SELECT 
        emp_id,
        shelter_id,
        firstname,
        lastname,
        role,
        hire_date
      FROM employee
      WHERE emp_id = ?
    `;
    
    const [rows] = await pool.execute(query, [emp_id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

