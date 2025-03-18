const products = [
  {
      id: '1',
      name: '5.1 inch (13 cm) Round Plastic Thermoform Pot (Mix Color)',
      price: 165,
      image: '/public/images/potspics/p1.png',
      rating: 5,
      description: 'Elevate your gardening experience with our vibrant 5.1 inch (13 cm) Round Plastic Thermoform Pots, available in a delightful mix of colors including terracotta, black, white, yellow, and green. This pack of 20 pots is perfect for both novice and experienced gardeners, providing a stylish and functional solution for all your planting needs. Made from durable, lightweight plastic, these pots are designed to withstand the elements while adding a pop of color to your indoor or outdoor space..',
      inStock: true
  },
  {
      id: '2',
      name: '4.5 inch (11 cm) Ronda No. 1110 Round Plastic Planter',
      price: 259,
      image: '/public/images/potspics/p2.png',
      rating: 5,
      description: 'The Ronda No. 1110 Round Plastic Planter is the perfect blend of style and functionality. Measuring 4.5 inches (11 cm) in diameter, this lightweight yet durable planter is designed to enhance your indoor and outdoor spaces. Its sleek, modern design complements any decor, making it an ideal choice for both home and office settings. Crafted from high-quality plastic, it ensures longevity while being easy to clean and maintain..',
      inStock: true
  },
  {
      id: '3',
      name: '6.6 inch (17 cm) Tulsi Vrindavan Matt ',
      price: 499,
      image: '/public/images/potspics/p3.png',
      description: 'Enhance your home decor with our exquisite 6.6 inch (17 cm) Tulsi Vrindavan Matt Finish Rectangle Ceramic Pot in a soothing light brown hue. Crafted from high-quality ceramic, this pot is designed to bring a touch of elegance and spirituality to your living space. Its unique rectangular shape and matt finish make it a perfect addition to any room, whether placed on a shelf, table, or windowsill.',
      inStock: true
  },
  {
      id: '4',
      name: '2 inch (5 cm) Square Glass Vase (9 inch (23 cm) Height)',
      price: 475,
      image: '/public/images/potspics/p4.png',
      rating: 5,
      description: 'This elegant 2-inch square glass vase stands at a striking 9 inches tall, making it a perfect centerpiece for any occasion. Crafted from high-quality, clear glass, it beautifully showcases your favorite flowers, decorative stones, or even candles. Its minimalist design complements any decor style, from modern to traditional, adding a touch of sophistication to your home or event.',
      inStock: false
  },
  {
      id: '5',
      name: '11.8 inch (30 cm) Bello Window Planter No. 30 Rectangle ',
      price: 799,
      image: '/public/images/potspics/p5.png',
      rating: 4,
      description: 'The Bello Window Planter No. 30 is a stylish and functional addition to your gardening collection. Measuring 11.8 inches (30 cm) in length, this rectangular plastic pot is perfect for a variety of plants, from vibrant flowers to lush herbs. The sleek black finish adds a modern touch to any space, making it ideal for both indoor and outdoor use. This set of 6 planters allows you to create a cohesive look in your garden or on your windowsill..',
      inStock: true
  },
  {
      id: '6',
      name: '4 inch (10.1 cm) Round Ceramic ',
      price: 999,
      image: '/public/images/potspics/p6.png',
      rating: 4,
      description: 'Elevate your home decor with our exquisite set of 3 round ceramic pots, each measuring 4 inches (10.1 cm) in diameter. Crafted from high-quality ceramic, these pots feature a sleek white finish that complements any interior style, from modern to rustic. Perfect for small plants, succulents, or herbs, they add a touch of elegance to your living space.',
      inStock : true ,
  },
  {
      id: '7',
      name: 'Warli Painting Ceramic Pots - Pack of 3',
      price: 475,
      image: '/public/images/potspics/p7.png',
      rating: 4,
      description: 'Elevate your home decor with our exquisite Warli Painting Ceramic Pots - Pack of 3. Each pot features intricate Warli art, a traditional Indian tribal painting style that beautifully captures the essence of rural life. Crafted from high-quality ceramic with a stunning marble finish, these pots are not only visually appealing but also durable, making them perfect for both indoor and outdoor use.',
      inStock: true
  },
  {
      id: '8',
      name: '6.5 inch (17 cm) Hexa No. 2 Plastic Planter (Terracotta)',
      price: 475,
      image: '/public/images/potspics/p8.png',
      rating: 4,
      description: 'Elevate your gardening experience with our 6.5 inch (17 cm) Hexa No. 2 Plastic Planter in a charming terracotta color. This set of 6 planters is perfect for both indoor and outdoor use, allowing you to showcase your favorite plants in style. Crafted from durable, lightweight plastic, these planters are designed to withstand the elements while providing excellent drainage for healthy plant growth..',
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