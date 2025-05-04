// database.js
const mongoose = require('mongoose');

// Connect to MongoDB with better error handling
mongoose.connect('mongodb://localhost:27017/gardenly', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if we can't connect to the database
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    expertise: { type: String },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true }
});

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, default: 'General' },
    image: { type: String },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    sold_at: { type: Date },
    sizes: [{
        size: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 0 }
    }]
});

// Ticket Schema
const ticketSchema = new mongoose.Schema({
    requester: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'Open' },
    expert_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Ticket = mongoose.model('Ticket', ticketSchema);

// Default users data
const defaultUsers = [
    { username: 'admin', password: 'admin123', role: 'Admin', expertise: null, email: 'admin@example.com', mobile: '1234567890' },
    { username: 'seller1', password: 'seller123', role: 'Seller', expertise: null, email: 'seller1@example.com', mobile: '2345678901' },
    { username: 'buyer1', password: 'buyer123', role: 'Buyer', expertise: null, email: 'buyer1@example.com', mobile: '3456789012' },
    { username: 'admin2', password: 'admin456', role: 'Admin', expertise: null, email: 'admin2@example.com', mobile: '4567890123' },
    { username: 'seller2', password: 'seller789', role: 'Seller', expertise: null, email: 'seller2@example.com', mobile: '5678901234' },
    { username: 'seller3', password: 'seller101', role: 'Seller', expertise: null, email: 'seller3@example.com', mobile: '6789012345' },
    { username: 'buyer2', password: 'buyer456', role: 'Buyer', expertise: null, email: 'buyer2@example.com', mobile: '7890123456' },
    { username: 'buyer3', password: 'buyer789', role: 'Buyer', expertise: null, email: 'buyer3@example.com', mobile: '8901234567' },
    { username: 'delivery1', password: 'delivery123', role: 'Delivery Manager', expertise: null, email: 'delivery1@example.com', mobile: '9012345678' },
    { username: 'expert1', password: 'expert123', role: 'Expert', expertise: 'General', email: 'expert1@example.com', mobile: '0123456789' },
    { username: 'expert2', password: 'expert456', role: 'Expert', expertise: 'Technical', email: 'expert2@example.com', mobile: '1234509876' },
    { username: 'expert3', password: 'expert789', role: 'Expert', expertise: 'Billing', email: 'expert3@example.com', mobile: '2345098761' }
];

// Default products data
const defaultProducts = [
    { 
        name: 'Money Plant Golden', 
        description: 'A beautiful low-maintenance plant that brings prosperity.', 
        price: 10.00, 
        category: 'Plants', 
        image: './public/images/new-products/p6.jpg', 
        quantity: 20, 
        sold: 15,
        sizes: [
            { size: 'Small', price: 8.00, quantity: 10 },
            { size: 'Medium', price: 10.00, quantity: 5 },
            { size: 'Large', price: 15.00, quantity: 5 }
        ]
    },
    { 
        name: 'Growing round Plastic pot', 
        description: 'Durable plastic pot perfect for small plants.', 
        price: 10.00, 
        category: 'Pots', 
        image: './public/images/new-products/p7.jpg', 
        quantity: 15, 
        sold: 12,
        sizes: [
            { size: '4 inch', price: 5.00, quantity: 8 },
            { size: '6 inch', price: 10.00, quantity: 5 },
            { size: '8 inch', price: 15.00, quantity: 2 }
        ]
    },
    { name: 'Spinach Seeds', description: 'High-quality seeds for growing fresh spinach.', price: 5.00, category: 'Seeds', image: './public/images/new-products/p5.jpg', quantity: 50, sold: 30 },
    { name: 'Pruning Secateur', description: 'Sharp tool for precise plant pruning.', price: 10.00, category: 'Tools', image: './public/images/new-products/p1.jpg', quantity: 0, sold: 8 },
    { name: 'Onex Pebbles - 1Kg', description: 'Decorative pebbles for garden aesthetics.', price: 10.00, category: 'Pebbles', image: './public/images/new-products/p3.jpg', quantity: 30, sold: 25 },
    { name: 'Parijat Tree', description: 'Fragrant flowering tree for your garden.', price: 10.00, category: 'Plants', image: './public/images/new-products/p4.jpg', quantity: 10, sold: 5 },
    { name: 'Fungo Gaurd - 500ml', description: 'Fungicide to protect plants from fungal diseases.', price: 10.00, category: 'Fertilizers', image: './public/images/new-products/p2.jpg', quantity: 25, sold: 20 },
    { name: 'Coco Husk Block - 5kg', description: 'Natural growing medium for healthy plants.', price: 10.00, category: 'Fertilizers', image: './public/images/new-products/p8.jpg', quantity: 12, sold: 10 }
];

// Initialize database with default data
async function initializeDatabase() {
    try {
        console.log('Starting database initialization...');
        
        // Clear existing collections
        await User.deleteMany({});
        console.log('Cleared users collection');
        
        await Product.deleteMany({});
        console.log('Cleared products collection');
        
        await Ticket.deleteMany({});
        console.log('Cleared tickets collection');

        // Insert default users
        const users = await User.insertMany(defaultUsers);
        console.log('Default users inserted:', users.length);

        // Update seller_id in default products
        const seller = users.find(u => u.username === 'seller1');
        if (!seller) {
            throw new Error('Default seller not found');
        }

        const updatedProducts = defaultProducts.map(product => ({
            ...product,
            seller_id: seller._id,
            sold_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        }));

        // Insert default products
        const products = await Product.insertMany(updatedProducts);
        console.log('Default products inserted:', products.length);

        console.log('Database initialization completed successfully');
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

module.exports = {
    User,
    Product,
    Ticket,
    initializeDatabase
};