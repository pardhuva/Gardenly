const products = [
 
  {
      id: '2',
      name: 'Pebbles Coloured - 1 kg',
      price: 275,
      image: '/public/images/pebblespic/pebbles.webp',
      rating: 5,
      description: 'Decorative colored pebbles perfect for garden decoration and potted plants.',
      inStock: true
  },
  {
      id: '3',
      name: 'Black Polished Pebbles - 1 kg',
      price: 345,
      image: '/public/images/pebblespic/blackpebbles.webp',
      description: 'Premium black polished pebbles for garden decoration.',
      inStock: true
  },
  {
      id: '4',
      name: 'Garden Pebbles (Mix Color)',
      price: 475,
      image: '/public/images/pebblespic/p1.png',
      rating: 5,
      description: 'Transform your creative projects with our premium Stone Sand (Blue). This 1 kg pack of vibrant blue sand is perfect for a variety of applications, from arts and crafts to landscaping. Its fine texture and striking color make it an ideal choice for adding a unique touch to your designs.',
      inStock: false
  },
  {
      id: '5',
      name: 'River Pebbles (White)',
      price: 475,
      image: '/public/images/pebblespic/p2.png',
      rating: 4,
      description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
      inStock: true
  },
  {
      id: '6',
      name: 'Aquarium Pebbles (Yellow)',
      price: 475,
      image: '/public/images/pebblespic/p3.png',
      rating: 4,
      description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
      inStock: true
  },
  
  
  {
      id: '1',
      name:'onyx-yellow-polished-pebbles',
      price: 475,
      image: '/public/images/pebblespic/onyx-yellow-polished-pebbles.webp',
      rating: 4,
      description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
      inStock: true
  },
  {
      id: '7',
      name: 'oynx pebbles',
      price: 475,
      image: '/public/images/pebblespic/oynx pebbles.webp',
      rating: 4,
      description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
      inStock: true
  },
  {
    id: '7',
    name: 'Onex Pebbles (Blue)',
    price: 475,
    image: '/public/images/pebblespic/p4.png',
    rating: 4,
    description: 'Beautiful ruby-colored polished pebbles for garden decoration.',
    inStock: true
}
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

// Show product detail
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
              </button>` : ''}
              
      </div>
  `;

  if (product.inStock) {
      const buyNowButton = detailContent.querySelector('.buy-now');
      buyNowButton.addEventListener('click', () => {
          alert(`You are buying: ${product.name} for ₹${product.price}`);
      });
  }

  productDetail.classList.add('active');
}

// Show popup for Add to Cart
function showCartPopup(productName) {
  const popup = document.createElement('div');
  popup.className = 'cart-popup';
  popup.innerHTML = `
      <div class="popup-content">
          <p>${productName} has been added to your cart!</p>
          <button class="close-popup">OK</button>
      </div>
  `;
  document.body.appendChild(popup);

  const closeButton = popup.querySelector('.close-popup');
  closeButton.addEventListener('click', () => {
      document.body.removeChild(popup);
  });

  setTimeout(() => {
      if (document.body.contains(popup)) {
          document.body.removeChild(popup);
      }
  }, 3000); // Auto-close after 3 seconds
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

  // Add to Cart button functionality with popup
  document.addEventListener('click', (e) => {
      const button = e.target.closest('.product-card button, .detail-content button:not(.buy-now)');
      if (button && !button.disabled) {
          e.stopPropagation();
          const productName = button.closest('.content')?.querySelector('h3')?.textContent ||
                             button.closest('.detail-content')?.querySelector('h1')?.textContent;
          button.innerHTML = 'Added ✓';
          button.style.background = 'linear-gradient(135deg, #38a169, #2f855a)';
          showCartPopup(productName);
          setTimeout(() => {
              button.innerHTML = 'Add to Cart';
              button.style.background = 'linear-gradient(135deg, #38d39f, #17d797)';
          }, 1500);
      }
  });
});
function increaseQty() {
  let qty = document.getElementById("qty");
  qty.value = parseInt(qty.value) + 1;
}

function decreaseQty() {
  let qty = document.getElementById("qty");
  if (parseInt(qty.value) > 1) {
      qty.value = parseInt(qty.value) - 1;
  }
}

document.addEventListener('DOMContentLoaded', () => {
    // Existing code...

    // Home button navigation
    const homeBtn = document.querySelector('.home-btn');
    homeBtn.addEventListener('click', () => {
        window.location.href = '/'; // Adjust this path to your main homepage URL
    });

    // Rest of the existing code...
});