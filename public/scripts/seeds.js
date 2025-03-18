const products = [
    {
        id: '1',
        name: 'Tomato Ped - Desi Vegetable Seeds',
        price: 165,
        image: '/public/images/seedspic/p1.jpg',
        rating: 5,
        description: '. Whether you’re a seasoned gardener or a newbie with a green thumb, planting tomato seeds is like casting a spell of deliciousness. Just remember, patience is key; good things come to those who wait—especially when it comes to homegrown tomatoes.',
        inStock: true
    },
    {
        id: '2',
        name: 'Cherry Tomato, Cherry Tomato Honey - Vegetable Seeds',
        price: 275,
        image: '/public/images/seedspic/p3.png',
        rating: 5,
        description: 'Discover the delightful world of Cherry Tomato Honey seeds, perfect for home gardeners and culinary enthusiasts alike. These vibrant, bite-sized tomatoes are not only sweet and juicy but also packed with essential nutrients, making them a fantastic addition to your garden.',
        inStock: true
    },
    {
        id: '3',
        name: 'Spinach All Green - Desi Vegetable Seeds',
        price: 345,
        image: '/public/images/seedspic/p9.png',
        description: 'Introducing the Spinach All Green - Desi Vegetable Seeds, a premium variety of spinach that thrives in diverse climates. Known for its vibrant green leaves and rich nutritional profile, this spinach is a staple in many cuisines. Packed with vitamins A, C, and K, as well as iron and calcium.',
        inStock: true
    },
    {
        id: '4',
        name: '10 Easy Growing Best Vegetable Seeds Kit ',
        price: 475,
        image: '/public/images/seedspic/p5.png',
        rating: 5,
        description: 'Promoting better blooming & fruiting, it consists of carrot , pumpkin ,ridgeguard , ladyfinger, Tomato , Spongeguard , chilli , French beans etc good for farming'
    },
    {
        id: '5',
        name: 'Coriander Panipat - Desi Vegetable Seeds',
        price: 475,
        image: '/public/images/seedspic/p6.png',
        rating: 4,
        description: 'Coriander Panipat is a premium variety of coriander seeds, cherished for its aromatic leaves and seeds. Known scientifically as Coriandrum sativum, this herb is a staple in Indian cuisine, adding a fresh, zesty flavor to dishes. ',
        inStock: true
    },
    {
        id: '6',
        name: 'Strawberry - Fruit Seedss',
        price: 475,
        image: '/public/images/seedspic/p2.png',
        rating: 4,
        description: 'Discover the joy of growing your own strawberries with our premium Strawberry Fruit Seeds. Known scientifically as Fragaria × ananassa, these seeds yield delicious, sweet, and juicy berries that are perfect for snacking, baking, or adding to your favorite dishes. With a rich history dating back to ancient Rome, strawberries have been cherished for their flavor and health benefits for centuries.',
        inStock: true
    },
    {
        id: '7',
        name: 'Lavender - Flower Seeds',
        price: 475,
        image: '/public/images/seedspic/p7.png',
        rating: 4,
        description: 'Transform your garden into a fragrant oasis with our premium Lavender Flower Seeds. Known for their stunning purple blooms and soothing aroma, these seeds yield plants that not only beautify your space but also attract pollinators like bees and butterflies. Lavender (Lavandula angustifolia) is a hardy perennial that thrives in various climates, making it a favorite among gardeners worldwide.',
        inStock: true
    },
    {
        id: '8',
        name: 'Portulaca Double Mixed Color - Desi Flower Seeds',
        price: 475,
        image: '/public/images/seedspic/p8.png',
        rating: 4,
        description: ' Known for their lush, double blooms, these flowers come in a variety of shades, including pink, yellow, orange, and white. Portulaca, also known as moss rose, is a hardy succulent that thrives in sunny environments, making it perfect for gardens, borders, and containers.',
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