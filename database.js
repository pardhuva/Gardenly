const mongoose = require('mongoose');

// Connect to MongoDB with better error handling and increased timeout
mongoose.connect('mongodb://127.0.0.1:27017/gardenly', {
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    bufferCommands: false // Disable command buffering
})
.then(() => {
    console.log('Successfully connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err.message);
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
    sold_at: { type: Date }
});

// Ticket Schema
const ticketSchema = new mongoose.Schema({
    requester: { type: String, required: true },
    subject: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'Open' },
    expert_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    attachment: { type: String }, // Store base64-encoded image
    resolution: { type: String }  // Store expert's resolution
});

// Order Schema
const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        category: { type: String }
    }],
    total: { type: Number, required: true },
    customer_name: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    order_id: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        category: { type: String }
    }],
    updated_at: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Ticket = mongoose.model('Ticket', ticketSchema);
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);

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
        name: 'Peace Lily, Spathiphyllum - Plant', 
        description: 'The Peace Lily, scientifically known as Spathiphyllum, is a stunning houseplant celebrated for its elegant white blooms and lush green foliage. Native to the tropical rainforests of Central and South America, this plant thrives in low-light conditions, making it an ideal choice for indoor spaces.', 
        price: 165.00, 
        category: 'Plants', 
        image: './public/images/plantspics/p1.png', 
        quantity: 20, 
        sold: 5
    },
    { 
        name: 'Parijat Tree, Parijatak, Night Flowering Jasmine - Plant', 
        description: 'The Parijat tree, also called Night-Flowering Jasmine or Coral Jasmine, is known for its nocturnal blooms that spread a sweet, floral aroma. Revered in Indian mythology, it symbolizes love, devotion, and resilience. Its fragrant white flowers with orange centers bloom at night and fall gracefully by morning.', 
        price: 259.00, 
        category: 'Plants', 
        image: './public/images/plantspics/p2.png', 
        quantity: 15, 
        sold: 3
    },
    { 
        name: 'Raat Ki Rani, Raat Rani, Night Blooming Jasmine - Plant', 
        description: 'Raat Ki Rani (*Cestrum nocturnum*), also known as Night Blooming Jasmine, is a fragrant shrub native to the Caribbean and Central America. This captivating plant produces small, tubular white flowers that only bloom after dusk. The flowers release a potent, sweet fragrance that fills the air, making it a favorite for evening gardens.', 
        price: 499.00, 
        category: 'Plants', 
        image: './public/images/plantspics/p3.png', 
        quantity: 10, 
        sold: 2
    },
    { 
        name: 'Damascus Rose, Scented Rose (Any Color) - Plant', 
        description: 'The Damascus Rose, also known as Rosa damascena, is a timeless symbol of beauty and romance. Renowned for its exquisite fragrance and delicate petals, this plant produces stunning blooms in various colors, making it a favorite among gardeners and floral enthusiasts alike. Historically cherished for its essential oils, the Damascus Rose.', 
        price: 475.00, 
        category: 'Plants', 
        image: './public/images/plantspics/p4.png', 
        quantity: 0, 
        sold: 4
    },
    { 
        name: 'Rosemary - Plant', 
        description: 'Rosemary (Rosmarinus officinalis) is a fragrant evergreen herb native to the Mediterranean region. Known for its needle-like leaves and woody stems, this versatile plant is not only a culinary delight but also a symbol of remembrance and fidelity. With its rich aroma and robust flavor, rosemary enhances a variety of dishes, making it a staple in kitchens worldwide.', 
        price: 799.00, 
        category: 'Plants', 
        image: './public/images/plantspics/p5.png', 
        quantity: 12, 
        sold: 1
    },
    { 
        name: 'Rhoeo Plant, Rhoeo discolor (Tricolor, Variegated) - Plant', 
        description: 'The Rhoeo discolor, commonly known as the Tricolor or Variegated Rhoeo, is a stunning perennial plant native to the tropical regions of Mexico and the Caribbean. With its striking green, white, and purple leaves, this plant adds a vibrant touch to any indoor or outdoor space. Known for its resilience.', 
        price: 999.00, 
        category: 'Plants', 
        image: './public/images/plantspics/p6.png', 
        quantity: 8, 
        sold: 0
    },
    { 
        name: 'Madhumalti Dwarf, Rangoon Creeper - Plant', 
        description: 'The Madhumalti Dwarf, also known as the Rangoon Creeper (Quisqualis indica), is a stunning perennial vine that enchants with its fragrant, tubular flowers that transition from white to pink and finally to red. This versatile plant is perfect for gardens, balconies, and trellises, adding a touch of tropical elegance to any space.', 
        price: 475.00, 
        category: 'Plants', 
        image: './public/images/plantspics/p7.png', 
        quantity: 15, 
        sold: 2
    },
    { 
        name: 'Lemon Grass - Plant', 
        description: 'Lemon Grass (Cymbopogon citratus) is a tropical perennial grass known for its aromatic leaves and culinary versatility. This vibrant green plant thrives in warm climates and is a staple in many Asian cuisines, imparting a refreshing citrus flavor to dishes. Beyond its culinary uses, Lemon Grass is also celebrated for its medicinal properties, making it a valuable addition to any herb garden.', 
        price: 475.00, 
        category: 'Plants', 
        image: './public/images/plantspics/p8.png', 
        quantity: 20, 
        sold: 3
    },
    { 
        name: 'Money Plant Golden', 
        description: 'A beautiful low-maintenance plant that brings prosperity.', 
        price: 10.00, 
        category: 'Plants', 
        image: './public/images/new-products/p6.jpg', 
        quantity: 20, 
        sold: 15
    },
    { 
        name: 'Growing round Plastic pot', 
        description: 'Durable plastic pot perfect for small plants.', 
        price: 10.00, 
        category: 'Pots', 
        image: './public/images/new-products/p7.jpg', 
        quantity: 15, 
        sold: 12
    },
    { 
        name: 'Spinach Seeds', 
        description: 'High-quality seeds for growing fresh spinach.', 
        price: 5.00, 
        category: 'Seeds', 
        image: './public/images/new-products/p5.jpg', 
        quantity: 50, 
        sold: 30
    },
    { 
        name: 'Parijat Tree', 
        description: 'Fragrant flowering tree for your garden.', 
        price: 10.00, 
        category: 'Plants', 
        image: './public/images/new-products/p4.jpg', 
        quantity: 10, 
        sold: 5
    },
    { 
        name: 'Marigold Flower Seeds', 
        description: 'Bright and cheerful marigold seeds, perfect for adding color to your garden.', 
        price: 680.00, 
        category: 'Seeds', 
        image: '/public/images/seedspic/p1.jpg', 
        quantity: 50, 
        sold: 0
    },
    { 
        name: 'Tomato Seeds', 
        description: 'High-yield tomato seeds for growing fresh, juicy tomatoes at home.', 
        price: 350.00, 
        category: 'Seeds', 
        image: '/public/images/seedspic/p2.png', 
        quantity: 50, 
        sold: 0
    },
    { 
        name: 'Basil Herb Seeds', 
        description: 'Aromatic basil seeds, ideal for culinary use and home herb gardens.', 
        price: 90.00, 
        category: 'Seeds', 
        image: '/public/images/seedspic/p3.png', 
        quantity: 50, 
        sold: 0
    },
    { 
        name: 'Sunflower Seeds', 
        description: 'Tall and vibrant sunflower seeds, great for ornamental gardens.', 
        price: 150.00, 
        category: 'Seeds', 
        image: '/public/images/seedspic/p5.png', 
        quantity: 0, 
        sold: 0
    },
    { 
        name: 'Carrot Seeds', 
        description: 'Sweet and crunchy carrot seeds for your vegetable patch.', 
        price: 110.00, 
        category: 'Seeds', 
        image: '/public/images/seedspic/p6.png', 
        quantity: 50, 
        sold: 0
    },
    { 
        name: 'Mint Herb Seeds', 
        description: 'Refreshing mint seeds, perfect for teas and garnishes.', 
        price: 85.00, 
        category: 'Seeds', 
        image: '/public/images/seedspic/p7.png', 
        quantity: 50, 
        sold: 0
    },
    { 
        name: 'Zinnia Flower Seeds', 
        description: 'Colorful zinnia seeds to brighten up any garden space.', 
        price: 495.00, 
        category: 'Seeds', 
        image: '/public/images/seedspic/p8.png', 
        quantity: 50, 
        sold: 0
    },
    { 
        name: 'Cucumber Seeds', 
        description: 'Fast-growing cucumber seeds for fresh summer harvests.', 
        price: 630.00, 
        category: 'Seeds', 
        image: '/public/images/seedspic/p9.png', 
        quantity: 50, 
        sold: 0
    },
    { 
        name: '5.1 inch (13 cm) Round Plastic Thermoform Pot (Mix Color)', 
        description: 'Elevate your gardening experience with our vibrant 5.1 inch (13 cm) Round Plastic Thermoform Pots.', 
        price: 365.00, 
        category: 'Pots', 
        image: '/public/images/potspics/p1.png', 
        quantity: 20, 
        sold: 0
    },
    { 
        name: '4.5 inch (11 cm) Ronda No. 1110 Round Plastic Planter', 
        description: 'The Ronda No. 1110 Round Plastic Planter is the perfect blend of style and functionality.', 
        price: 259.00, 
        category: 'Pots', 
        image: '/public/images/potspics/p2.png', 
        quantity: 15, 
        sold: 0
    },
    { 
        name: '6.6 inch (17 cm) Tulsi Vrindavan Matt', 
        description: 'Enhance your home decor with our exquisite 6.6 inch (17 cm) Tulsi Vrindavan Matt Finish Rectangle Ceramic Pot.', 
        price: 499.00, 
        category: 'Pots', 
        image: '/public/images/potspics/p3.png', 
        quantity: 10, 
        sold: 0
    },
    { 
        name: '2 inch (5 cm) Square Glass Vase (9 inch Height)', 
        description: 'This elegant 2-inch square glass vase stands at a striking 9 inches tall.', 
        price: 475.00, 
        category: 'Pots', 
        image: '/public/images/potspics/p4.png', 
        quantity: 0, 
        sold: 0
    },
    { 
        name: '11.8 inch (30 cm) Bello Window Planter No. 30 Rectangle', 
        description: 'The Bello Window Planter No. 30 is a stylish and functional addition to your gardening collection.', 
        price: 799.00, 
        category: 'Pots', 
        image: '/public/images/potspics/p5.png', 
        quantity: 12, 
        sold: 0
    },
    { 
        name: '4 inch (10.1 cm) Round Ceramic', 
        description: 'Elevate your home decor with our exquisite set of 3 round ceramic pots.', 
        price: 999.00, 
        category: 'Pots', 
        image: '/public/images/potspics/p6.png', 
        quantity: 8, 
        sold: 0
    },
    { 
        name: 'Warli Painting Ceramic Pots - Pack of 3', 
        description: 'Elevate your home decor with our exquisite Warli Painting Ceramic Pots.', 
        price: 475.00, 
        category: 'Pots', 
        image: '/public/images/potspics/p7.png', 
        quantity: 15, 
        sold: 0
    },
    { 
        name: '6.5 inch (17 cm) Hexa No. 2 Plastic Planter (Terracotta)', 
        description: 'Elevate your gardening experience with our 6.5 inch Hexa No. 2 Plastic Planter.', 
        price: 475.00, 
        category: 'Pots', 
        image: '/public/images/potspics/p8.png', 
        quantity: 20, 
        sold: 0
    }
];

// Initialize database with default data
async function initializeDatabase() {
    try {
        console.log('Starting database initialization...');

        // Wait for the connection to be established
        await mongoose.connection.asPromise();
        console.log('MongoDB connection established');

        // Clear existing collections
        console.log('Clearing users collection...');
        await User.deleteMany({}).catch(err => {
            console.error('Error clearing users collection:', err.message);
            throw err;
        });
        console.log('Cleared users collection');

        console.log('Clearing products collection...');
        await Product.deleteMany({}).catch(err => {
            console.error('Error clearing products collection:', err.message);
            throw err;
        });
        console.log('Cleared products collection');

        console.log('Clearing tickets collection...');
        await Ticket.deleteMany({}).catch(err => {
            console.error('Error clearing tickets collection:', err.message);
            throw err;
        });
        console.log('Cleared tickets collection');

        console.log('Clearing orders collection...');
        await Order.deleteMany({}).catch(err => {
            console.error('Error clearing orders collection:', err.message);
            throw err;
        });
        console.log('Cleared orders collection');

        console.log('Clearing carts collection...');
        await Cart.deleteMany({}).catch(err => {
            console.error('Error clearing carts collection:', err.message);
            throw err;
        });
        console.log('Cleared carts collection');

        // Insert default users
        console.log('Inserting default users...');
        const users = await User.insertMany(defaultUsers).catch(err => {
            console.error('Error inserting default users:', err.message);
            throw err;
        });
        console.log('Default users inserted:', users.length);

        // Update seller_id in default products
        const seller = users.find(u => u.username === 'seller1');
        if (!seller) {
            throw new Error('Default seller not found');
        }

        const updatedProducts = defaultProducts.map(product => ({
            ...product,
            seller_id: seller._id,
            sold_at: product.sold > 0 ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) : null
        }));

        // Insert default products
        console.log('Inserting default products...');
        const products = await Product.insertMany(updatedProducts).catch(err => {
            console.error('Error inserting default products:', err.message);
            throw err;
        });
        console.log('Default products inserted:', products.length);

        console.log('Database initialization completed successfully');
        return true;
    } catch (error) {
        console.error('Error initializing database:', error.message);
        throw error;
    }
}

module.exports = {
    User,
    Product,
    Ticket,
    Order,
    Cart,
    initializeDatabase
};