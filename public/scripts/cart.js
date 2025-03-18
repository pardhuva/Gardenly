
const products = [
    {
        id: '1',
        name: 'Bone Meal Fertilizer - 5 kg',
        price: 165,
        image: '/fertilizerspics/product1.jpg',
        rating: 5,
        description: 'Perfect for plant growth & blooming, Gardenly Bone Meal Fertilizer is made of fish bones decomposed in a sterilized environment.',
        inStock: true,
        quantity: 1
    },
    {
        id: '2',
        name: 'Epsom Salt - 1 kg',
        price: 275,
        image: './fertilizerspics/p3.jpg',
        rating: 5,
        description: 'Helping flowering plants bloom better, Epsom Salt is a magnesium sulphate compound and is extensively for ornamental.',
        inStock: true,
        quantity: 1
    },
    {
        id: '3',
        name: 'Humic Acid Powder Spray - 500 ml',
        price: 345,
        image: './fertilizerspics/p9.png',
        description: 'Promoting root development & plant resilience, Gardenly HumiGrow helps revitalize your plants. It is an organic humic acid.',
        inStock: true,
        quantity: 1
    },
    {
id: '4',
name: 'Garden Pebbles (Mix Color)',
price: 475,
image: './pebblespic/p1.png',
rating: 5,
description: 'Transform your creative projects with our premium Stone Sand (Blue). This 1 kg pack of vibrant blue sand is perfect for a variety of applications, from arts and crafts to landscaping. Its fine texture and striking color make it an ideal choice for adding a unique touch to your designs.',
inStock: false,
quantity: 1
},
{
id: '5',
name: 'River Pebbles (White)',
price: 475,
image: './pebblespic/p2.png',
rating: 4,
description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
inStock: true,
quantity: 1
},
{
id: '6',
name: 'Aquarium Pebbles (Yellow)',
price: 475,
image: './pebblespic/p3.png',
rating: 4,
description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
inStock: true,
quantity: 1
},

{
id: '7',
name: 'Rosemary - Plant',
price: 799,
image: './plantspics/p5.png',
rating: 4,
description: 'Rosemary (Rosmarinus officinalis) is a fragrant evergreen herb native to the Mediterranean region. Known for its needle-like leaves and woody stems, this versatile plant is not only a culinary delight but also a symbol of remembrance and fidelity. With its rich aroma and robust flavor, rosemary enhances a variety of dishes, making it a staple in kitchens worldwide.',
inStock: true,
quantity:1
},

{
id: '8',
name: '6.5 inch (17 cm) Hexa No. 2 Plastic Planter (Terracotta)',
price: 475,
image: './potspics/p8.png',
rating: 4,
description: 'Elevate your gardening experience with our 6.5 inch (17 cm) Hexa No. 2 Plastic Planter in a charming terracotta color. This set of 6 planters is perfect for both indoor and outdoor use, allowing you to showcase your favorite plants in style. Crafted from durable, lightweight plastic, these planters are designed to withstand the elements while providing excellent drainage for healthy plant growth..',
inStock: true,
quantity: 1
},

];

let cart = [...products];

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach(product => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.onclick = () => showProductDetails(product);
        
        itemDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="item-details">
                <div class="item-info">
                    <h3>${product.name}</h3>
                    <p>Price: ₹${product.price}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${product.id}', -1); event.stopPropagation();">-</button>
                    <span>${product.quantity}</span>
                    <button onclick="updateQuantity('${product.id}', 1); event.stopPropagation();">+</button>
                    <button class="remove-btn" onclick="removeItem('${product.id}'); event.stopPropagation();">Remove</button>
                </div>
            </div>
        `;
        cartItems.appendChild(itemDiv);
    });

    updateTotal();
}

function updateQuantity(productId, change) {
    const product = cart.find(p => p.id === productId);
    if (product) {
        product.quantity = Math.max(1, product.quantity + change);
        renderCart();
    }
}

function removeItem(productId) {
    cart = cart.filter(p => p.id !== productId);
    renderCart();
}

function updateTotal() {
    const total = cart.reduce((sum, product) => 
        sum + (product.price * product.quantity), 0);
    document.getElementById('cart-total').textContent = total;
}

function showProductDetails(product) {
    const modal = document.getElementById('product-modal');
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-price').textContent = product.price;
    document.getElementById('modal-rating').textContent = product.rating;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Initial render
renderCart();

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
