const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Serve static files in the uploads directory
app.use('/uploads', express.static('uploads'));

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


// Fetch products from MySQL with optional filter, sort, and search functionality
app.get('/api/products', (req, res) => {
  let query = 'SELECT * FROM products';
  let conditions = [];

  // Handle filtering by category
  if (req.query.filter === 'category' && req.query.category) {
    conditions.push(`category = ?`);
  }

  // Handle searching by product name
  if (req.query.search) {
    conditions.push(`name LIKE ?`);
  }

  // Append conditions to the query if there are any
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // Handle sorting options
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'name_asc':
        query += ' ORDER BY name ASC';
        break;
      case 'name_desc':
        query += ' ORDER BY name DESC';
        break;
      case 'price_asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price DESC';
        break;
      case 'date_asc':
        query += ' ORDER BY created_at ASC';
        break;
      case 'date_desc':
        query += ' ORDER BY created_at DESC';
        break;
      default:
        break;
    }
  }

  // Execute the query with sanitized inputs
  connection.query(query, [req.query.category ? req.query.category : '%'+req.query.search+'%'], (error, results) => {
    if (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Error fetching products');
    } else {
      res.send(results);
    }
  });
});




// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending the file extension
  }
});
const upload = multer({ storage });
// Product Route
app.post('/api/products', upload.single('image'), (req, res) => {
  try {
    const { name, price, seller, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : ''; // Store relative URL

    // Insert product into the SQL database
    const query = 'INSERT INTO products (name, description, price, seller, image_url) VALUES (?, ?, ?, ?, ?)';
    const values = [name, description, price, seller, imageUrl];

    connection.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error adding product', error: error.message });
      }
      res.status(201).json({
        message: 'Product added successfully',
        product: {
          id: results.insertId,
          name,
          price,
          seller,
          description,
          imageUrl
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// Delete a product from the products table
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  const deleteQuery = 'DELETE FROM products WHERE id = ?';
  connection.query(deleteQuery, [productId], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({ message: 'Product deleted successfully' });
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


// Fetch all items from the cart table
app.get('/api/cart', (req, res) => {
  connection.query('SELECT * FROM cart', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    // Ensure the results are sent as JSON
    res.json(results); // Use res.json() to send a valid JSON response
  });
});



// Add an item to the cart
app.post('/api/cart', (req, res) => {
  console.log('Request received to add to cart:', req.body); // Log the request body

  const { productId, quantity } = req.body;
  const defaultUserId = 1; // Simulated or default user for educational purposes

  const fetchProductSql = 'SELECT * FROM products WHERE id = ?';
  connection.query(fetchProductSql, [productId], (err, productResults) => {
    if (err) {
      console.error('Error fetching product:', err); // Log the error
      return res.status(500).json({ error: err.message });
    }
    if (productResults.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResults[0];

    const checkCartSql = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
    connection.query(checkCartSql, [defaultUserId, productId], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking cart:', checkErr); // Log the error
        return res.status(501).json({ error: checkErr.message });
      }

      if (checkResults.length > 0) {
        // Update quantity if item already exists in cart
        const existingItem = checkResults[0];
        const updateSql = `UPDATE cart SET quantity = quantity + ? WHERE id = ?`;

        connection.query(updateSql, [quantity, existingItem.id], (updateErr) => {
          if (updateErr) {
            console.error('Error updating cart quantity:', updateErr); // Log the error
            return res.status(502).json({ error: updateErr.message });
          }
          return res.status(200).json({ message: 'Item quantity updated in cart' });
        });
      } else {
        // Insert new item into cart
        const insertSql = `INSERT INTO cart (user_id, product_id, quantity, product_name, product_description, product_price, product_category, product_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(insertSql, [
          defaultUserId,
          productId,
          quantity,
          product.name,
          product.description,
          product.price,
          product.category,
          product.image_url
        ], (insertErr) => {
          if (insertErr) {
            console.error('Error inserting into cart:', insertErr); // Log the error
            return res.status(503).json({ error: insertErr.message });
          }
          res.status(201).json({ message: 'Item added to cart for default user' });
        });
      }
    });
  });
});


// Remove item from cart
app.delete('/api/cart/item/:cartItemId', (req, res) => {
  const cartItemId = req.params.cartItemId;

  const query = 'DELETE FROM cart WHERE id = ?';
  connection.query(query, [cartItemId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart item deleted successfully' });
  });
});



// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
