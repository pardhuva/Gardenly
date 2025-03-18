const products = [
  {
      id: '1',
      name: 'Peace Lily, Spathiphyllum - Plant',
      price: 165,
      image: '/public/images/plantspics/p1.png',
      rating: 5,
      description: 'The Peace Lily, scientifically known as Spathiphyllum, is a stunning houseplant celebrated for its elegant white blooms and lush green foliage. Native to the tropical rainforests of Central and South America, this plant thrives in low-light conditions, making it an ideal choice for indoor spaces.',
      inStock: true
  },
  {
      id: '2',
      name: 'Parijat Tree, Parijatak, Night Flowering Jasmine - Plant',
      price: 259,
      image: '/public/images/plantspics/p2.png',
      rating: 5,
      description: 'The Parijat tree, also called Night-Flowering Jasmine or Coral Jasmine, is known for its nocturnal blooms that spread a sweet, floral aroma. Revered in Indian mythology, it symbolizes love, devotion, and resilience. Its fragrant white flowers with orange centers bloom at night and fall gracefully by morning.',
      inStock: true
  },
  {
      id: '3',
      name: 'Raat Ki Rani, Raat Rani, Night Blooming Jasmine - Plant',
      price: 499,
      image: '/public/images/plantspics/p3.png',
      description: 'Raat Ki Rani (*Cestrum nocturnum*), also known as Night Blooming Jasmine, is a fragrant shrub native to the Caribbean and Central America. This captivating plant produces small, tubular white flowers that only bloom after dusk. The flowers release a potent, sweet fragrance that fills the air, making it a favorite for evening gardens.',
      inStock: true
  },
  {
      id: '4',
      name: 'Damascus Rose, Scented Rose (Any Color) - Plant',
      price: 475,
      image: '/public/images/plantspics/p4.png',
      rating: 5,
      description: 'The Damascus Rose, also known as Rosa damascena, is a timeless symbol of beauty and romance. Renowned for its exquisite fragrance and delicate petals, this plant produces stunning blooms in various colors, making it a favorite among gardeners and floral enthusiasts alike. Historically cherished for its essential oils, the Damascus Rose.',
      inStock: false
  },
  {
      id: '5',
      name: 'Rosemary - Plant',
      price: 799,
      image: '/public/images/plantspics/p5.png',
      rating: 4,
      description: 'Rosemary (Rosmarinus officinalis) is a fragrant evergreen herb native to the Mediterranean region. Known for its needle-like leaves and woody stems, this versatile plant is not only a culinary delight but also a symbol of remembrance and fidelity. With its rich aroma and robust flavor, rosemary enhances a variety of dishes, making it a staple in kitchens worldwide.',
      inStock: true
  },
  {
      id: '6',
      name: 'Rhoeo Plant, Rhoeo discolor (Tricolor, Variegated) - Plant',
      price: 999,
      image: '/public/images/plantspics/p6.png',
      rating: 4,
      description: 'The Rhoeo discolor, commonly known as the Tricolor or Variegated Rhoeo, is a stunning perennial plant native to the tropical regions of Mexico and the Caribbean. With its striking green, white, and purple leaves, this plant adds a vibrant touch to any indoor or outdoor space. Known for its resilience.',
      inStock: true
    },
  {
      id: '7',
      name: 'Madhumalti Dwarf, Rangoon Creeper - Plant',
      price: 475,
      image: '/public/images/plantspics/p7.png',
      rating: 4,
      description: 'The Madhumalti Dwarf, also known as the Rangoon Creeper (Quisqualis indica), is a stunning perennial vine that enchants with its fragrant, tubular flowers that transition from white to pink and finally to red. This versatile plant is perfect for gardens, balconies, and trellises, adding a touch of tropical elegance to any space.',
      inStock: true
  },
  {
      id: '8',
      name: 'Lemon Grass - Plant',
      price: 475,
      image: '/public/images/plantspics/p8.png',
      rating: 4,
      description: 'Lemon Grass (Cymbopogon citratus) is a tropical perennial grass known for its aromatic leaves and culinary versatility. This vibrant green plant thrives in warm climates and is a staple in many Asian cuisines, imparting a refreshing citrus flavor to dishes. Beyond its culinary uses, Lemon Grass is also celebrated for its medicinal properties, making it a valuable addition to any herb garden.',
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