// Product data
const newProducts = [
    {
        id: 1,
        name: "Money Plant Golden",
        image: "./public/images/new-products/p6.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "A beautiful low-maintenance plant that brings prosperity.",
        inStock: true
    },
    {
        id: 2,
        name: "Growing round Plastic pot",
        image: "./public/images/new-products/p7.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Durable plastic pot perfect for small plants.",
        inStock: true
    },
    {
        id: 3,
        name: "Spinach Seeds",
        image: "./public/images/new-products/p5.jpg",
        rating: 4.5,
        price: 5,
        originalPrice: 7.60,
        description: "High-quality seeds for growing fresh spinach.",
        inStock: true
    },
    {
        id: 4,
        name: "Pruning Secateur",
        image: "./public/images/new-products/p1.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Sharp tool for precise plant pruning.",
        inStock: false
    },
    {
        id: 5,
        name: "Onex Pebbles - 1Kg",
        image: "./public/images/new-products/p3.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Decorative pebbles for garden aesthetics.",
        inStock: true
    },
    {
        id: 6,
        name: "Parijat Tree",
        image: "./public/images/new-products/p4.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Fragrant flowering tree for your garden.",
        inStock: true
    },
    {
        id: 7,
        name: "Fungo Gaurd - 500ml",
        image: "./public/images/new-products/p2.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Fungicide to protect plants from fungal diseases.",
        inStock: true
    },
    {
        id: 8,
        name: "Coco Husk Block - 5kg",
        image: "./public/images/new-products/p8.jpg",
        rating: 4.5,
        price: 10,
        originalPrice: 14.50,
        description: "Natural growing medium for healthy plants.",
        inStock: true
    }
];

const bestProducts = [
    {
        id: 1,
        name: "Bonsai",
        image: "public/images/best-products/s1.jpg"
    },
    {
        id: 2,
        name: "Indoor",
        image: "public/images/best-products/s2.jpg"
    },
    {
        id: 3,
        name: "Areca Palm",
        image: "public/images/best-products/s3.jpg"
    },
    {
        id: 4,
        name: "Seeds",
        image: "public/images/best-products/s4.jpg"
    }
];

/* Home Slider */
var swiper = new Swiper(".home-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    loop: true,
});

// Function to create star rating HTML
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    }

    return starsHTML;
}

// Helper function to create star rating for product detail
function createStarRatingSVG(rating) {
    return Array(5).fill('').map((_, index) => 
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${index < Math.floor(rating) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>`
    ).join('');
}

// Render new products (unchanged)
function renderNewProducts() {
    const newProductsContainer = document.querySelector('.product .box-container');
    if (newProductsContainer) {
        newProductsContainer.innerHTML = newProducts.map(product => `
            <div class="box" data-product-id="${product.id}">
                <div class="icons">
                    <a href="#" class="fas fa-heart"></a>
                    <a href="#" class="fas fa-share"></a>
                    <a href="#" class="fas fa-eye"></a>
                </div>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="stars">
                    ${createStarRating(product.rating)}
                </div>
                <div class="quantity">
                    <span>Quantity</span>
                    <input type="number" min="1" max="50" value="1">
                </div>
                <div class="price">
                    $${product.price} <span>$${product.originalPrice}</span>
                </div>
                <a href="#" class="btn">Add to Cart</a>
            </div>
        `).join('');
    }
}

// Render best products (unchanged)
function renderBestProducts() {
    const bestProductsContainer = document.querySelector('.sell .box-container');
    if (bestProductsContainer) {
        bestProductsContainer.innerHTML = bestProducts.map(product => `
            <div class="box" data-product-id="${product.id}">
                <div class="image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="content">
                    <h3>${product.name}</h3>
                    <div class="icons">
                        <i class="fas fa-shopping-cart"></i>
                        <i class="fas fa-heart"></i>
                        <i class="fas fa-eye"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Show product detail with quantity selector and dynamic price
function showProductDetail(productId) {
    const product = newProducts.find(p => p.id == productId);
    const productDetail = document.getElementById('product-detail');
    const detailContent = productDetail.querySelector('.detail-content');

    detailContent.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div>
            <h1>${product.name}</h1>
            <div class="rating">
                ${createStarRatingSVG(product.rating)}
            </div>
            <p class="price">$${product.price}</p>
            <p class="description">${product.description}</p>
            <button ${!product.inStock ? 'disabled' : ''}>
                ${product.inStock ? 'Add to Cart' : 'Sold Out'}
            </button>
            ${product.inStock ? `
                <button class="buy-now">
                    Buy Now
                </button>
                <div class="quantity">
                    <button class="decrement">-</button>
                    <span class="quantity-value">1</span>
                    <button class="increment">+</button>
                </div>` : ''}
        </div>
    `;

    if (product.inStock) {
        const decrementBtn = detailContent.querySelector('.decrement');
        const incrementBtn = detailContent.querySelector('.increment');
        const quantityValue = detailContent.querySelector('.quantity-value');
        const priceElement = detailContent.querySelector('.price');
        let quantity = 1;

        // Update quantity and price
        const updateQuantityAndPrice = () => {
            quantityValue.textContent = quantity;
            priceElement.textContent = `$${product.price * quantity}`;
            decrementBtn.disabled = quantity <= 1;
        };

        // Increment quantity
        incrementBtn.addEventListener('click', () => {
            quantity++;
            updateQuantityAndPrice();
        });

        // Decrement quantity
        decrementBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                updateQuantityAndPrice();
            }
        });
    }

    productDetail.classList.add('active');
}

// Handle product actions (unchanged)
function handleProductAction(action, productId) {
    switch (action) {
        case 'favorite':
            console.log(`Added product ${productId} to favorites`);
            break;
        case 'share':
            console.log(`Sharing product ${productId}`);
            break;
        case 'view':
            console.log(`Viewing product ${productId} details`);
            break;
        case 'cart':
            console.log(`Added product ${productId} to cart`);
            break;
    }
}

// Handle add to cart (unchanged)
function handleAddToCart(productId, quantity) {
    console.log(`Added ${quantity} of product ${productId} to cart`);
}

// Initialize products and add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Render products
    renderNewProducts();
    renderBestProducts();

    // Add event listeners (unchanged except for click event)
    document.querySelectorAll('.box').forEach(box => {
        // Handle quantity changes
        const quantityInput = box.querySelector('input[type="number"]');
        if (quantityInput) {
            quantityInput.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                if (value < 1) e.target.value = '1';
                if (value > 50) e.target.value = '50';
            });
        }

        // Handle icon clicks
        box.querySelectorAll('.icons a, .icons i').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.target.classList.contains('fa-heart') ? 'favorite' :
                            e.target.classList.contains('fa-share') ? 'share' :
                            e.target.classList.contains('fa-eye') ? 'view' :
                            e.target.classList.contains('fa-shopping-cart') ? 'cart' : null;
                
                if (action) {
                    const productId = box.getAttribute('data-product-id');
                    if (action === 'view') {
                        showProductDetail(productId); // Show product detail on eye icon click
                    } else {
                        handleProductAction(action, productId);
                    }
                }
            });
        });

        // Handle add to cart button
        const addToCartBtn = box.querySelector('.btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = box.getAttribute('data-product-id');
                const quantity = box.querySelector('input[type="number"]')?.value || '1';
                handleAddToCart(productId, parseInt(quantity));
            });
        }

        // Add click event to the entire box to show product detail
        box.addEventListener('click', (e) => {
            // Prevent triggering if clicking on icons or buttons
            if (!e.target.closest('.icons') && !e.target.closest('.btn')) {
                const productId = box.getAttribute('data-product-id');
                showProductDetail(productId);
            }
        });
    });

    // Back button functionality for product detail
    const backBtn = document.querySelector('.back-btn');
    const productDetail = document.getElementById('product-detail');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            productDetail.classList.remove('active');
        });
    }
});