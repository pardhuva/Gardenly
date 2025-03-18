const products = [
    {
        id: '1',
        name: 'Double Prong Weeder',
        price: 165,
        image: '/public/images/toolspic/doubble-prong-weeder.jpg',
        rating: 5,
        description: 'Perfect for removing weeds and aerating soil. Features a comfortable wooden handle and durable metal prongs.',
        inStock: true
    },
    {
        id: '2',
        name: 'Hedge Shear with Wooden Handle',
        price: 275,
        image: '/public/images/toolspic/p1.png',
        rating: 5,
        description: 'The Hedge Shear with Wooden Handle No. MMI-78 is an essential gardening tool designed for precision trimming and shaping of hedges and shrubs. Crafted with high-quality steel blades, this shear ensures clean cuts, promoting healthy growth and a polished appearance for your garden.',
        inStock: true
    },
    {
        id: '3',
        name: 'Transplanting Trowel No. MMI 83',
        price: 345,
        image: '/public/images/toolspic/p2.png',
        description: 'The Transplanting Trowel No. MMI 83 is an essential gardening tool designed for precision and ease. Crafted from high-quality stainless steel, this trowel features a sharp, pointed blade that effortlessly penetrates soil, making it perfect for transplanting seedlings and delicate plants.',
        inStock: true
    },
    {
        id: '4',
        name: 'Fruit Harvest Blade',
        price: 475,
        image: '/public/images/toolspic/fruit harvest blade.webp',
        rating: 5,
        description: 'Professional fruit harvesting blade with ergonomic handle.',
        inStock: false
    },
    {
        id: '5',
        name: 'five prong weeder',
        price: 475,
        image: '/public/images/toolspic/five prong weeder.jpg',
        rating: 4,
        description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
        inStock: true
    },
    {
        id: '6',
        name: 'the-watermatic-stake',
        price: 475,
        image: '/public/images/toolspic/the-watermatic-stake.webp',
        rating: 4,
        description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
        inStock: true
    },
    {
        id: '7',
        name: 'curve-pruning-saw',
        price: 475,
        image: '/public/images/toolspic/curve-pruning-saw.jpg',
        rating: 4,
        description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
        inStock: true
    },
    {
        id: '8',
        name: 'dom mettalic mister',
        price: 475,
        image: '/public/images/toolspic/dom mettalic mister.webp',
        rating: 4,
        description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
        inStock: true
    },
    
];

// Helper function to create star rating
function createStarRating(rating) {
    return Array(5).fill('').map((_, index) => 
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${index < rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${index < rating ? 'text-yellow-400' : 'text-gray-300'}">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>`
    ).join('');
  }
  
  // Render product cards
  function renderProducts(productList = products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = productList.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <div class="content">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price}</p>
                <div class="rating">
                    ${createStarRating(product.rating)}
                </div>
                <button ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Sold Out'}
                </button>
            </div>
        </div>
    `).join('');
  
    // Add click event listeners to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.id;
            showProductDetail(productId);
        });
    });
  }
  
  // Show product detail with quantity selector and dynamic price
  function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    const productDetail = document.getElementById('product-detail');
    const detailContent = productDetail.querySelector('.detail-content');
  
    detailContent.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div>
            <h1>${product.name}</h1>
            <div class="rating">
                ${createStarRating(product.rating)}
            </div>
            <p class="price">₹${product.price}</p>
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
            priceElement.textContent = `₹${product.price * quantity}`; // Update price based on quantity
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
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
  
    // Sort menu toggle and functionality
    const sortBtn = document.querySelector('.sort-btn');
    const sortMenu = document.querySelector('.sort-menu');
    const sortItems = sortMenu.querySelectorAll('li');
  
    sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortMenu.classList.toggle('active');
    });
  
    sortItems.forEach(item => {
        item.addEventListener('click', () => {
            const sortType = item.textContent;
            let sortedProducts = [...products];
  
            if (sortType === 'Price, low to high') {
                sortedProducts.sort((a, b) => a.price - b.price);
            } else if (sortType === 'Price, high to low') {
                sortedProducts.sort((a, b) => b.price - a.price);
            }
  
            renderProducts(sortedProducts);
            sortMenu.classList.remove('active');
        });
    });
  
    document.addEventListener('click', (e) => {
        if (!sortMenu.contains(e.target) && !sortBtn.contains(e.target)) {
            sortMenu.classList.remove('active');
        }
    });
  
    const backBtn = document.querySelector('.back-btn');
    const productDetail = document.getElementById('product-detail');
    backBtn.addEventListener('click', () => {
        productDetail.classList.remove('active');
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    // Existing code...

    // Home button navigation
    const homeBtn = document.querySelector('.home-btn');
    homeBtn.addEventListener('click', () => {
        window.location.href = '/'; // Adjust this path to your main homepage URL
    });

    // Rest of the existing code...
});