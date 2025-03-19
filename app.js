const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const app = express();

// Database setup
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    }
    console.log('Connected to the SQLite database.');
});
 
// Middleware setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Use true only in HTTPS
}));

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Admin') {
        return next();
    }
    res.status(403).send('Access denied: Admin privileges required');
};

// Function to initialize database

async function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Create users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                role TEXT
            )`, (err) => {
                if (err) return reject(err);

                // Insert default users only after users table exists
                const defaultUsers = [
                    ['admin', 'admin123', 'Admin'],
                    ['seller1', 'seller123', 'Seller'],
                    ['buyer1', 'buyer123', 'Buyer'],
                    ['admin2', 'admin456', 'Admin'],
                    ['seller2', 'seller789', 'Seller'],
                    ['seller3', 'seller101', 'Seller'],
                    ['buyer2', 'buyer456', 'Buyer'],
                    ['buyer3', 'buyer789', 'Buyer']
                ];

                let completed = 0;
                defaultUsers.forEach(([username, password, role]) => {
                    db.run('INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)',
                        [username, password, role],
                        (err) => {
                            if (err) console.error('Error inserting user:', err);
                            completed++;
                            if (completed === defaultUsers.length) {
                                
                                // After inserting users, create products table
                                db.run(`CREATE TABLE IF NOT EXISTS products (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    name TEXT,
                                    description TEXT,
                                    price REAL,
                                    category TEXT,
                                    image TEXT,
                                    seller_id INTEGER,
                                    FOREIGN KEY (seller_id) REFERENCES users(id)
                                )`, (err) => {
                                    if (err) return reject(err);
                                    resolve();
                                });
                            }
                        }
                    );
                });

                // In case the users array is empty (unlikely), still resolve
                if (defaultUsers.length === 0) {
                    resolve();
                }
            });
        });
    });
}
app.post('/addproduct', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Seller') {
      return res.status(403).json({ message: 'Access denied: Only sellers can add products' });
    }
  
    const { name, description, price, category, image } = req.body;
    const seller_id = req.session.user.id;
  
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    db.run(
      `INSERT INTO products (name, description, price, category, image, seller_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, price, category, image, seller_id],
      function (err) {
        if (err) {
          console.error('Error adding product:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.status(201).json({ message: 'Product added successfully' });
      }
    );
  });

// Routes
app.get('/', (req, res) => {
    res.render('homepage', { user: req.session.user || null });
});


app.get('/seeds', (req, res) => {
    res.render('seeds');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/pots', (req, res) => {
    res.render('pots');
});

app.get('/plants', (req, res) => {
    res.render('plants');
});

app.get('/pebbles', (req, res) => {
    res.render('pebbles');
});

app.get('/tools', (req, res) => {
    res.render('tools');
});

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.get('/fertilizers', (req, res) => {
    res.render('fertilizers');
});

app.get('/expert_support', (req, res) => {
    res.render('expert_support');
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

app.get('/seller', (req, res) => {
    res.render('seller');
});

// Blog routes
app.get('/article1', (req, res) => {
    res.render('blogs/article1');
});

app.get('/article2', (req, res) => {
    res.render('blogs/article2');
});

app.get('/article3', (req, res) => {
    res.render('blogs/article3');
});

app.get('/article4', (req, res) => {
    res.render('blogs/article4');
});

app.get('/basics', (req, res) => {
    res.render('blogs/basics');
});

app.get('/blog', (req, res) => {
    res.render('blogs/blog');
});

app.get('/kitchen', (req, res) => {
    res.render('blogs/kitchen');
});

app.get('/maintenance', (req, res) => {
    res.render('blogs/maintenance');
});

// Protected dashboard routes
app.get('/admindashboard', isAuthenticated, isAdmin, (req, res) => {
    res.render('admindashboard');
});

app.get('/sellerdashboard', isAuthenticated, (req, res) => {
    db.all('SELECT * FROM products WHERE seller_id = ?', [req.session.user.id], (err, products) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        }
        res.render('sellerdashboard', { products });
    });
});

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Store user data globally
    next();
});


app.post('/login', (req, res) => {
    const { username, password, role } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ? AND password = ? AND role = ?', 
        [username, password, role], 
        (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Server error');
            }
            
            if (user) {
                req.session.user = user;
                
                if (user.role === 'Seller') {
                    return res.redirect('/seller');
                } else if (user.role === 'Buyer') {
                    return res.redirect('/');
                } else if (user.role === 'Admin') {
                    return res.redirect('/admindashboard');
                }
            } else {
                return res.status(401).render('login', { 
                    error: 'Invalid username, password, or role' 
                });
            }
        });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server after database initialization
const PORT = process.env.PORT || 7000;
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });

    
    