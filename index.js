const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'uv060203P',
  database: 'real_estate_db'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Endpoint to get all properties
app.get('/properties', (req, res) => {
  db.query('SELECT * FROM Properties', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// Endpoint to get a specific property by ID
app.get('/properties/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Properties WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.status(200).json(result[0]);
  });
});

// Endpoint to add a new property
app.post('/properties', (req, res) => {
  const { title, description, price, location } = req.body;
  if (!title || !description || !price || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.query('INSERT INTO Properties (title, description, price, location) VALUES (?, ?, ?, ?)', 
    [title, description, price, location], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Property added successfully', propertyId: result.insertId });
    });
});

// Endpoint to update a property
app.put('/properties/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, price, location } = req.body;
  db.query(
    'UPDATE Properties SET title = ?, description = ?, price = ?, location = ? WHERE id = ?',
    [title, description, price, location, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Property not found' });
      res.status(200).json({ message: 'Property updated successfully' });
    }
  );
});

// Endpoint to delete a property
app.delete('/properties/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Properties WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Property deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
