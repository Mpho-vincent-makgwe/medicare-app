const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kHing$!x6',
    database: 'medicare_db'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Fetch products from MySQL
app.get('/api/products', (req, res) => {
    connection.query('SELECT * FROM products', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { fullName, email, username, password } = req.body;

  const checkUser = 'SELECT * FROM users WHERE email = ? OR username = ?';
  
  // Using 'connection' instead of 'db'
  connection.query(checkUser, [email, username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email or Username already exists' });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10); // Hashing password
      const sql = 'INSERT INTO users (full_name, email, username, password) VALUES (?, ?, ?, ?)';

      connection.query(sql, [fullName, email, username, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User registered successfully' });
        console.log('Registered user successfully');
      });
    }
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';

  connection.query(sql, [username], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });

      const user = results[0];
      if (bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: 'Login successful', user });
      } else {
          res.status(401).json({ message: 'Invalid password' });
      }
  });
});

// Add item to cart
app.post('/api/cart', (req, res) => {
  const { userId, productId, quantity } = req.body;
  const sql = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?';

  connection.query(sql, [userId, productId, quantity, quantity], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Item added to cart' });
  });
});

// Fetch cart items
app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `
      SELECT c.id, p.name, p.price, c.quantity 
      FROM cart c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?
  `;

  connection.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
  });
});

// Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM cart WHERE id = ?';

  connection.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(204).send();
  });
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
