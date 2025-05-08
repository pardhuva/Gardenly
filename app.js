const express = require('express');
const path = require('path');
const session = require('express-session');
const { User, Product, Ticket, Order, Cart, initializeDatabase } = require('./database');
const bcrypt = require('bcrypt');
const multer = require('multer');
const app = express();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    if (req.path.startsWith('/api/') || req.path === '/addproduct') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.redirect('/login');
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Admin') return next();
    if (req.path.startsWith('/api/')) {
        return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    res.status(403).send('Access denied: Admin privileges required');
};

const isSeller = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Seller') return next();
    if (req.path.startsWith('/api/') || req.path === '/addproduct') {
        return res.status(403).json({ message: 'Access denied: Seller privileges required' });
    }
    res.status(403).send('Access denied: Seller privileges required');
};

const isExpert = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Expert') return next();
    if (req.path.startsWith('/api/')) {
        return res.status(403).json({ message: 'Access denied: Expert privileges required' });
    }
    res.status(403).send('Access denied: Expert privileges required');
};

const isBuyer = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Buyer') return next();
    if (req.path.startsWith('/api/')) {
        return res.status(403).json({ message: 'Access denied: Buyer privileges required' });
    }
    res.status(403).send('Access denied: Buyer privileges required');
};

// Registration route
app.post('/register', async (req, res) => {
    const { username, password, role, email, mobile } = req.body;

    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    if (!usernameRegex.test(username)) {
        return res.status(400).render('register', { 
            error: 'Username must be 3-20 characters (letters, numbers, _, - only)',
            user: null
        });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).render('register', { 
            error: 'Password must be 8+ characters with at least 1 uppercase, 1 number, and 1 symbol',
            user: null
        });
    }

    if (!['Buyer', 'Seller', 'Admin'].includes(role)) {
        return res.status(400).render('register', { 
            error: 'Invalid role selected',
            user: null
        });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).render('register', { 
            error: 'Invalid email format',
            user: null
        });
    }
    if (!mobileRegex.test(mobile)) {
        return res.status(400).render('register', { 
            error: 'Mobile number must be exactly 10 digits',
            user: null
        });
    }

    try {
        const existingUser = await User.findOne({
            $or: [
                { username },
                { email },
                { mobile }
            ]
        });

        if (existingUser) {
            return res.status(400).render('register', { 
                error: 'Username, email, or mobile already exists',
                user: null
            });
        }

        const newUser = new User({
            username,
            password,
            role,
            email,
            mobile
        });

        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).render('register', { 
            error: 'Server error during registration',
            user: null
        });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).render('login', { error: 'Invalid username or password' });
        }
        if (user.role.toLowerCase() !== role.toLowerCase()) {
            return res.status(401).render('login', { error: 'Role mismatch' });
        }

        req.session.user = user;
        console.log(`User logged in: ${username}, Role: ${role}, ID: ${user._id}`);

        switch (user.role) {
            case 'Expert':
                return res.redirect('/expert-dashboard');
            case 'Seller':
                return res.redirect('/seller');
            case 'Buyer':
                return res.redirect('/');
            case 'Admin':
                return res.redirect('/admindashboard');
            case 'Delivery Manager':
                return res.redirect('/deliverymanager');
            default:
                return res.redirect('/');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('login', { error: 'Server error during login' });
    }
});

// Product routes
app.post('/addproduct', isAuthenticated, isSeller, upload.single('image'), async (req, res) => {
    try {
        console.log('Received addproduct request:', req.body);
        
        const { name, description, category, price, quantity } = req.body;
        const imageFile = req.file;

        if (!name || !imageFile || !price || !quantity) {
            return res.status(400).json({ success: false, message: 'Product name, image, price, and quantity are required' });
        }

        if (!category) {
            return res.status(400).json({ success: false, message: 'Category is required' });
        }

        const priceNum = parseFloat(price);
        const quantityNum = parseInt(quantity);
        if (isNaN(priceNum) || priceNum <= 0) {
            return res.status(400).json({ success: false, message: 'Price must be a positive number' });
        }
        if (isNaN(quantityNum) || quantityNum <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be a positive integer' });
        }

        // Process the image file
        const imageBuffer = imageFile.buffer;
        const base64Image = imageBuffer.toString('base64');
        const imageDataUrl = `data:${imageFile.mimetype};base64,${base64Image}`;

        const product = new Product({
            name,
            description,
            category,
            image: imageDataUrl,
            seller_id: req.session.user._id,
            price: priceNum,
            quantity: quantityNum,
            sold: 0
        });

        const savedProduct = await product.save();
        console.log('Product saved successfully:', savedProduct);

        res.status(200).json({
            success: true,
            message: 'Product added successfully',
            product: {
                id: savedProduct._id,
                name: savedProduct.name,
                price: `₹${savedProduct.price.toFixed(2)}`,
                image: savedProduct.image,
                quantity: savedProduct.quantity,
                sold: savedProduct.sold,
                description: savedProduct.description,
                category: savedProduct.category,
                type: 'recent'
            }
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Failed to add product' });
    }
});

app.put('/api/products/:id', isAuthenticated, isSeller, async (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    const productId = req.params.id;
    const seller_id = req.session.user._id;

    if (!name || !price || !quantity) {
        return res.status(400).json({ message: 'Product name, price, and quantity are required' });
    }

    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity);
    if (isNaN(priceNum) || priceNum <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
    }
    if (isNaN(quantityNum) || quantityNum < 0) {
        return res.status(400).json({ message: 'Quantity must be a non-negative integer' });
    }

    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId, seller_id },
            { 
                name,
                description,
                category,
                price: priceNum,
                quantity: quantityNum
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found or not owned by seller' });
        }

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Database error', error: error.message });
    }
});

app.delete('/api/products/:id', isAuthenticated, isSeller, async (req, res) => {
    const productId = req.params.id;
    const seller_id = req.session.user._id;

    try {
        const result = await Product.findOneAndDelete({ _id: productId, seller_id });
        if (!result) {
            return res.status(404).json({ message: 'Product not found or not owned by seller' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Database error', error: error.message });
    }
});

// Cart routes
app.get('/api/cart', isAuthenticated, isBuyer, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.session.user._id }).populate('items.product_id');
        if (!cart) {
            return res.json({ items: [] });
        }
        res.json({
            items: cart.items.map(item => ({
                id: item.product_id._id.toString(),
                product_id: item.product_id._id.toString(),
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                category: item.category
            }))
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/cart/add', isAuthenticated, isBuyer, async (req, res) => {
    const { product_id, quantity } = req.body;
    const quantityNum = parseInt(quantity) || 1;

    if (!product_id || quantityNum <= 0) {
        return res.status(400).json({ message: 'Valid product ID and positive quantity are required' });
    }

    try {
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.quantity < quantityNum) {
            return res.status(400).json({ message: 'Insufficient product stock' });
        }

        let cart = await Cart.findOne({ user_id: req.session.user._id });
        if (!cart) {
            cart = new Cart({
                user_id: req.session.user._id,
                items: []
            });
        }

        const existingItem = cart.items.find(item => item.product_id.toString() === product_id);
        if (existingItem) {
            existingItem.quantity += quantityNum;
        } else {
            cart.items.push({
                product_id,
                name: product.name,
                price: product.price,
                quantity: quantityNum,
                image: product.image,
                category: product.category
            });
        }

        cart.updated_at = new Date();
        await cart.save();

        res.json({ message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/cart/update', isAuthenticated, isBuyer, async (req, res) => {
    const { product_id, quantity } = req.body;
    const quantityNum = parseInt(quantity);

    if (!product_id || quantityNum <= 0) {
        return res.status(400).json({ message: 'Valid product ID and positive quantity are required' });
    }

    try {
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.quantity < quantityNum) {
            return res.status(400).json({ message: 'Insufficient product stock' });
        }

        const cart = await Cart.findOne({ user_id: req.session.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.product_id.toString() === product_id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantityNum;
        cart.updated_at = new Date();
        await cart.save();

        res.json({ message: 'Cart updated' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/cart/remove/:product_id', isAuthenticated, isBuyer, async (req, res) => {
    const { product_id } = req.params;

    try {
        const cart = await Cart.findOne({ user_id: req.session.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
        cart.updated_at = new Date();
        await cart.save();

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/cart/clear', isAuthenticated, isBuyer, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.session.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.updated_at = new Date();
        await cart.save();

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Order route
app.post('/api/delivery/create-order', isAuthenticated, isBuyer, async (req, res) => {
    const { customer_name, address, phone_number, email, payment_method, comments, items } = req.body;

    // Server-side validation
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validPaymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Cash on Delivery'];

    if (!customer_name || !address || !phone_number || !email || !payment_method || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'All required fields (name, address, phone number, email, payment method, items) must be provided' });
    }

    if (!phoneRegex.test(phone_number)) {
        return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits' });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (!validPaymentMethods.includes(payment_method)) {
        return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }

    try {
        const cart = await Cart.findOne({ user_id: req.session.user._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Validate items and stock
        for (const item of cart.items) {
            const product = await Product.findById(item.product_id);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
            }
        }

        // Calculate total
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create order
        const orderId = 'ORD' + Date.now();
        const order = new Order({
            user_id: req.session.user._id,
            items: cart.items,
            total,
            customer_name,
            address,
            status: 'Pending',
            order_id: orderId
        });

        // Update product stock and sold
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product_id, {
                $inc: { quantity: -item.quantity, sold: item.quantity },
                sold_at: new Date()
            });
        }

        // Save order and clear cart
        await order.save();
        cart.items = [];
        cart.updated_at = new Date();
        await cart.save();

        res.json({ success: true, message: 'Order placed successfully', orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Ticket routes
app.post('/submit-ticket', isAuthenticated, upload.single('attachment'), async (req, res) => {
    const { requester, subject, type, description } = req.body;
    const attachmentFile = req.file;

    if (!requester || !subject || !type || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const expertiseMap = {
        'general': 'General',
        'technical': 'Technical',
        'billing': 'Billing'
    };

    const expertise = expertiseMap[type.toLowerCase()];
    try {
        const expert = await User.findOne({ role: 'Expert', expertise });
        if (!expert) {
            return res.status(500).json({ message: 'No expert available for this type' });
        }

        let attachmentDataUrl = null;
        if (attachmentFile) {
            const attachmentBuffer = attachmentFile.buffer;
            const base64Attachment = attachmentBuffer.toString('base64');
            attachmentDataUrl = `data:${attachmentFile.mimetype};base64,${base64Attachment}`;
        }

        const newTicket = new Ticket({
            requester,
            subject,
            type,
            description,
            expert_id: expert._id,
            attachment: attachmentDataUrl
        });

        await newTicket.save();
        res.status(201).json({ message: 'Ticket submitted successfully', ticketId: newTicket._id });
    } catch (error) {
        console.error('Error submitting ticket:', error);
        res.status(500).json({ message: 'Server error saving ticket' });
    }
});

// Expert submit resolution route
app.post('/api/tickets/:id/resolve', isAuthenticated, isExpert, async (req, res) => {
    const { resolution } = req.body;
    const ticketId = req.params.id;
    const expertId = req.session.user._id;

    if (!resolution) {
        return res.status(400).json({ message: 'Resolution is required' });
    }

    try {
        const updatedTicket = await Ticket.findOneAndUpdate(
            { _id: ticketId, expert_id: expertId },
            { resolution, status: 'Resolved' },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found or not assigned to this expert' });
        }

        res.json({ message: 'Resolution submitted successfully' });
    } catch (error) {
        console.error('Error submitting resolution:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User tickets route
app.get('/api/user-tickets', isAuthenticated, async (req, res) => {
    try {
        const tickets = await Ticket.find({ requester: req.session.user.username })
            .populate('expert_id', 'username');
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching user tickets:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Expert dashboard and API routes
app.get('/expert-dashboard', isAuthenticated, isExpert, async (req, res) => {
    try {
        const expertId = req.session.user._id;
        const tickets = await Ticket.find({ expert_id: expertId });
        res.render('expert_dashboard', { user: req.session.user, tickets: tickets || [] });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/tickets', isAuthenticated, isExpert, async (req, res) => {
    try {
        const expertId = req.session.user._id;
        const tickets = await Ticket.find({ expert_id: expertId });
        res.json(tickets || []);
    } catch (error) {
        console.error('API: Error fetching tickets:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin API routes
app.get('/api/users', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, 'username role email mobile');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/users/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { role } = req.body;
    const userId = req.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Database error' });
    }
});

app.delete('/api/users/:id', isAuthenticated, isAdmin, async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Database error' });
    }
});

app.get('/api/products', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const products = await Product.find({}, 'name price quantity seller_id');
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/tickets/all', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.find({});
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/tickets/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { status } = req.body;
    const ticketId = req.params.id;

    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json({ message: 'Ticket updated successfully' });
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ message: 'Database error' });
    }
});

app.get('/api/orders', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user_id', 'username')
            .lean();
        const formattedOrders = orders.map(order => ({
            id: order.order_id,
            customer: order.user_id ? order.user_id.username : 'Unknown',
            product: order.items.map(item => item.name).join(', '),
            amount: order.total
        }));
        res.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/orders', isAuthenticated, isAdmin, async (req, res) => {
    const { customer_username, product_names, amount } = req.body;

    if (!customer_username || !product_names || !amount) {
        return res.status(400).json({ message: 'Customer username, product names, and amount are required' });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    try {
        const user = await User.findOne({ username: customer_username });
        if (!user) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const productArray = product_names.split(',').map(name => name.trim());
        const items = [];
        for (const name of productArray) {
            const product = await Product.findOne({ name });
            if (!product) {
                return res.status(404).json({ message: `Product ${name} not found` });
            }
            items.push({
                product_id: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
                category: product.category
            });
        }

        const orderId = 'ORD' + Date.now();
        const order = new Order({
            user_id: user._id,
            items,
            total: amountNum,
            customer_name: user.username,
            address: 'Admin Created', // Placeholder
            status: 'Pending',
            order_id: orderId
        });

        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/orders/:id', isAuthenticated, isAdmin, async (req, res) => {
    const orderId = req.params.id;

    try {
        const result = await Order.findOneAndDelete({ order_id: orderId });
        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// General routes
app.get('/', async (req, res) => {
    try {
        // Fetch the latest 8 products, including those with category 'Plants'
        const newProducts = await Product.find({})
            .sort({ created_at: -1 }) // Sort by creation date (newest first)
            .limit(8);

        const formattedNewProducts = newProducts.map((product) => ({
            id: product._id.toString(),
            name: product.name,
            image: product.image,
            rating: 4.5, // Static rating as per original code
            price: product.price,
            originalPrice: product.price * 1.45, // As per original code
            description: product.description || 'No description available',
            inStock: product.quantity > 0,
            available: product.quantity,
            category: product.category // Include category for use in client-side logic
        }));

        // Static best products as per original code
        const bestProducts = [
            { id: 1, name: "Bonsai", image: "/public/images/best-products/s1.jpg" },
            { id: 2, name: "Indoor", image: "/public/images/best-products/s2.jpg" },
            { id: 3, name: "Areca Palm", image: "/public/images/best-products/s3.jpg" },
            { id: 4, name: "Seeds", image: "/public/images/best-products/s4.jpg" }
        ];

        res.render('homepage', { 
            user: req.session.user || null,
            newProducts: formattedNewProducts.length > 0 ? formattedNewProducts : [],
            bestProducts: bestProducts
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).render('homepage', { 
            user: req.session.user || null,
            newProducts: [],
            bestProducts: []
        });
    }
});

app.get('/register', (req, res) => res.render('register', { user: req.session.user || null, error: null }));
app.get('/pots', async (req, res) => {
    try {
        const products = await Product.find({ category: 'Pots' });
        const formattedProducts = products.map(product => ({
            id: product._id.toString(),
            name: product.name,
            image: product.image,
            rating: 4.5,
            price: product.price,
            description: product.description,
            inStock: product.quantity > 0,
            material: 'Plastic' // Default material
        }));
        res.render('pots', { 
            user: req.session.user || null,
            products: formattedProducts
        });
    } catch (error) {
        console.error('Error fetching pots:', error);
        res.status(500).render('pots', { 
            user: req.session.user || null,
            products: []
        });
    }
});
app.get('/seeds', async (req, res) => {
    try {
        const products = await Product.find({ category: 'Seeds' });
        const formattedProducts = products.map(product => ({
            id: product._id.toString(),
            name: product.name,
            image: product.image,
            rating: 4.5,
            price: product.price,
            description: product.description,
            inStock: product.quantity > 0,
            material: 'Plastic' // Default material
        }));
        res.render('seeds', { 
            user: req.session.user || null,
            products: formattedProducts
        });
    } catch (error) {
        console.error('Error fetching seeds:', error);
        res.status(500).render('seeds', { 
            user: req.session.user || null,
            products: []
        });
    }
});
app.get('/plants', async (req, res) => {
    try {
        // Fetch all products with category 'Plants'
        const plants = await Product.find({ category: 'Plants' });
        const formattedProducts = plants.map(product => ({
            id: product._id.toString(),
            name: product.name,
            image: product.image,
            rating: 4.5,
            price: parseFloat(product.price),
            originalPrice: product.price * 1.45,
            description: product.description || 'No description available',
            inStock: product.quantity > 0,
            available: product.quantity,
            material: 'Plastic', // Default material
            category: product.category
        }));
        res.render('plants', { 
            user: req.session.user || null,
            products: formattedProducts
        });
    } catch (error) {
        console.error('Error fetching plants:', error);
        res.status(500).render('plants', { 
            user: req.session.user || null,
            products: []
        });
    }
});
app.get('/pebbles', async (req, res) => {
    try {
        const products = await Product.find({ category: 'Pebbles' });
        const formattedProducts = products.map(product => ({
            id: product._id.toString(),
            name: product.name,
            image: product.image,
            rating: 4.5,
            price: product.price,
            description: product.description,
            inStock: product.quantity > 0,
            material: 'Plastic' // Default material
        }));
        res.render('pebbles', { 
            user: req.session.user || null,
            products: formattedProducts
        });
    } catch (error) {
        console.error('Error fetching pebbles:', error);
        res.status(500).render('pebbles', { 
            user: req.session.user || null,
            products: []
        });
    }
});
app.get('/tools', async (req, res) => {
    try {
        const products = await Product.find({ category: 'Tools' });
        const formattedProducts = products.map(product => ({
            id: product._id.toString(),
            name: product.name,
            image: product.image,
            rating: 4.5,
            price: product.price,
            description: product.description,
            inStock: product.quantity > 0,
            material: 'Plastic' // Default material
        }));
        res.render('tools', { 
            user: req.session.user || null,
            products: formattedProducts
        });
    } catch (error) {
        console.error('Error fetching tools:', error);
        res.status(500).render('tools', { 
            user: req.session.user || null,
            products: []
        });
    }
});
app.get('/fertilizers', async (req, res) => {
    try {
        const products = await Product.find({ category: 'Fertilizers' });
        const formattedProducts = products.map(product => ({
            id: product._id.toString(),
            name: product.name,
            image: product.image,
            rating: 4.5,
            price: product.price,
            description: product.description,
            inStock: product.quantity > 0,
            material: 'Plastic' // Default material
        }));
        res.render('fertilizers', { 
            user: req.session.user || null,
            products: formattedProducts
        });
    } catch (error) {
        console.error('Error fetching fertilizers:', error);
        res.status(500).render('fertilizers', { 
            user: req.session.user || null,
            products: []
        });
    }
});
app.get('/login', (req, res) => res.render('login', { error: null }));
app.get('/expert_support', (req, res) => res.render('expert_support', { user: req.session.user || null }));
app.get('/cart', isAuthenticated, isBuyer, (req, res) => res.render('cart', { user: req.session.user || null }));
app.get('/beforeseller', (req, res) => res.render('beforeseller', { user: req.session.user || null }));

app.get('/seller', isAuthenticated, isSeller, async (req, res) => {
    try {
        // Fetch only the seller's products from the database
        const products = await Product.find({ seller_id: req.session.user._id });
        
        // Group products by category
        const productsByCategory = products.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});

        // Fetch recent sales (last 5 products by creation date)
        const recentSales = await Product.find({ 
            seller_id: req.session.user._id 
        })
        .sort({ created_at: -1 })
        .limit(5);

        // Fetch top sales (top 5 by sold quantity)
        const topSales = await Product.find({ 
            seller_id: req.session.user._id 
        })
        .sort({ sold: -1 })
        .limit(5);

        res.render('seller', { 
            user: req.session.user,
            productsByCategory,
            recentSales,
            topSales
        });
    } catch (error) {
        console.error('Error fetching seller data:', error);
        res.status(500).send('Error loading seller page');
    }
});

app.get('/api/recent-sales', isAuthenticated, isSeller, async (req, res) => {
    try {
        const products = await Product.find({ 
            seller_id: req.session.user._id
        })
        .sort({ _id: -1 })
        .limit(5);
        
        res.json(products.map(p => ({
            id: p._id,
            name: p.name,
            price: `₹${p.price.toFixed(2)}`,
            image: p.image,
            quantity: p.quantity,
            sold: p.sold,
            description: p.description,
            category: p.category,
            type: 'recent'
        })));
    } catch (error) {
        console.error('Error fetching recent sales:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Blog routes
app.get('/article1', (req, res) => res.render('blogs/article1', { user: req.session.user || null }));
app.get('/article2', (req, res) => res.render('blogs/article2', { user: req.session.user || null }));
app.get('/article3', (req, res) => res.render('blogs/article3', { user: req.session.user || null }));
app.get('/article4', (req, res) => res.render('blogs/article4', { user: req.session.user || null }));
app.get('/basics', (req, res) => res.render('blogs/basics', { user: req.session.user || null }));
app.get('/blog', (req, res) => res.render('blogs/blog', { user: req.session.user || null }));
app.get('/kitchen', (req, res) => res.render('blogs/kitchen', { user: req.session.user || null }));
app.get('/maintenance', (req, res) => res.render('blogs/maintenance', { user: req.session.user || null }));

// Protected dashboard routes
app.get('/admindashboard', isAuthenticated, isAdmin, (req, res) => {
    res.render('admindashboard', { user: req.session.user || null });
});

// Seller Dashboard route
app.get('/sellerdashboard', isSeller, async (req, res) => {
    try {
        const sellerId = req.session.user._id;
        const products = await Product.find({ seller_id: sellerId });

        const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.sold), 0);
        const totalProducts = products.length;
        const totalSales = products.reduce((sum, product) => sum + product.sold, 0);
        const activeProducts = products.filter(product => product.quantity > 0).length;

        const topSales = products
            .filter(product => product.sold > 0)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5)
            .map(product => ({
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity,
                sold: product.sold,
                description: product.description,
                type: 'recent'
            }));

        const revenueData = await Product.aggregate([
            { $match: { seller_id: sellerId, sold: { $gt: 0 } } },
            { $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$sold_at" } },
                revenue: { $sum: { $multiply: ["$price", "$sold"] } }
            }},
            { $sort: { _id: 1 } }
        ]);

        const categoryData = await Product.aggregate([
            { $match: { seller_id: sellerId, sold: { $gt: 0 } } },
            { $group: {
                _id: "$category",
                revenue: { $sum: { $multiply: ["$price", "$sold"] } },
                count: { $sum: 1 }
            }}
        ]);

        res.render('sellerdashboard', {
            user: req.session.user,
            products,
            metrics: {
                totalRevenue,
                totalProducts,
                totalSales,
                activeProducts
            },
            revenueData,
            categoryData,
            topSales: topSales.length > 0 ? topSales : []
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).send('Error loading dashboard');
    }
});

app.get('/deliverymanagerdashboard', (req, res) => {
    const data = {
        currentPage: 'dashboard',
        user: { name: 'Pardhuva' },
        metrics: { pendingDeliveries: 24, pendingChange: -15, inTransit: 18, inTransitChange: 12, deliveredToday: 32, deliveredChange: 28, activeAgents: 8 },
        recentOrders: [
            { id: '#ORD-001', customer: 'Pardhuva', address: '123 Garden St', agent: 'Alex Johnson', status: 'delivered' },
            { id: '#ORD-002', customer: 'Sri harsha', address: '456 Plant Ave', agent: 'Michael Brown', status: 'in-transit' }
        ],
        chartData: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], data: [12, 19, 3, 5, 2, 3, 10] }
    };
    res.render('dashboard', { ...data, user: req.session.user || null });
});

app.get('/deliverymanager', isAuthenticated, (req, res) => {
    if (req.session.user.role !== 'Delivery Manager') {
        return res.status(403).send('Access denied: Only Delivery Managers can access this page');
    }
    res.render('deliverymanager', { user: req.session.user || null });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Something went wrong!' });
        }
        res.redirect('/login');
    });
});

// Authentication check route
app.get('/api/check-auth', (req, res) => {
    res.json({ isAuthenticated: !!req.session.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Seller products API endpoint
app.get('/api/seller/products', isAuthenticated, isSeller, async (req, res) => {
    try {
        const products = await Product.find({ 
            seller_id: req.session.user._id
        });

        res.json(products.map(p => ({
            id: p._id,
            name: p.name,
            price: `₹${p.price.toFixed(2)}`,
            image: p.image,
            quantity: p.quantity,
            sold: p.sold,
            description: p.description,
            category: p.category,
            type: 'recent'
        })));
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Top sales API endpoint
app.get('/api/top-sales', isAuthenticated, isSeller, async (req, res) => {
    try {
        const products = await Product.find({ 
            seller_id: req.session.user._id
        })
        .sort({ sold: -1 })
        .limit(5);
        
        res.json(products.map(p => ({
            id: p._id,
            name: p.name,
            price: `₹${p.price.toFixed(2)}`,
            image: p.image,
            quantity: p.quantity,
            sold: p.sold,
            description: p.description,
            category: p.category,
            type: 'top'
        })));
    } catch (error) {
        console.error('Error fetching top sales:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
const PORT = process.env.PORT || 7000;
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });