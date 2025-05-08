// Get products from the data attribute
const productsData = document.getElementById('products-data');
const products = JSON.parse(productsData.dataset.products);

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
                <p class="price">₹${product.price.toFixed(2)}</p>
                <div class="rating">
                    ${createStarRating(product.rating)}
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Sold Out'}
                </button>
            </div>
        </div>
    `).join('');

    // Attach event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation(); // Prevent other click events
            const productId = button.dataset.id;
            const product = products.find(p => p.id === productId);
            if (product && product.inStock) {
                console.log('Adding to cart:', product); // Debug log
                await addToCart({
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price), // Ensure price is a number
                    image: product.image,
                    rating: product.rating,
                    description: product.description || 'No description available',
                    inStock: product.inStock,
                    quantity: 1,
                    category: product.category || 'Plants' // Use product.category
                });
            } else {
                console.error('Product not found or out of stock:', productId);
                alert('Product not found or out of stock');
            }
        });
    });
}

// Add to cart function
async function addToCart(product) {
    try {
        const response = await fetch('/api/check-auth', {
            credentials: 'include'
        });
        const authData = await response.json();
        if (!authData.isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        const cartResponse = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: product.id,
                quantity: product.quantity
            })
        });

        const cartData = await cartResponse.json();
        if (cartResponse.ok) {
            const button = document.querySelector(`.add-to-cart-btn[data-id="${product.id}"]`);
            if (button) {
                button.innerHTML = '<i class="fas fa-check"></i> Added';
                button.style.backgroundColor = '#4CAF50';
                setTimeout(() => {
                    button.innerHTML = 'Add to Cart';
                    button.style.backgroundColor = '';
                }, 2000);
            }
            alert(`${product.name} has been added to your cart!`);
        } else {
            alert(cartData.message || 'Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart');
    }
}

// Filter and sort products
function applyFiltersAndSort() {
    let filteredProducts = [...products];

    // Material filter
    // const selectedMaterials = Array.from(document.querySelectorAll('.filter-material:checked')).map(cb => cb.value);
    // if (selectedMaterials.length > 0) {
    //     filteredProducts = filteredProducts.filter(product => selectedMaterials.includes(product.material));
    // }

    // Price filter
    const selectedPrices = Array.from(document.querySelectorAll('.filter-price:checked')).map(cb => cb.value);
    if (selectedPrices.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return selectedPrices.some(range => {
                if (range === '0-300') return product.price <= 300;
                if (range === '300-600') return product.price > 300 && product.price <= 600;
                if (range === '600+') return product.price > 600;
            });
        });
    }

    // Availability filter
    const selectedAvailability = Array.from(document.querySelectorAll('.filter-availability:checked')).map(cb => cb.value);
    if (selectedAvailability.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            if (selectedAvailability.includes('inStock') && product.inStock) return true;
            if (selectedAvailability.includes('outOfStock') && !product.inStock) return true;
            return false;
        });
    }

    // Rating filter
    const selectedRatings = Array.from(document.querySelectorAll('.filter-rating:checked')).map(cb => parseInt(cb.value));
    if (selectedRatings.length > 0) {
        filteredProducts = filteredProducts.filter(product => selectedRatings.some(rating => product.rating >= rating));
    }

    return filteredProducts;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    const homeBtn = document.querySelector('.home-btn');
    homeBtn.addEventListener('click', () => {
        window.location.href = '/';
    });

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
            let sortedProducts = applyFiltersAndSort();

            if (sortType === 'Price, low to high') {
                sortedProducts.sort((a, b) => a.price - b.price);
            } else if (sortType === 'Price, high to low') {
                sortedProducts.sort((a, b) => b.price - a.price);
            } else if (sortType === 'Rating, high to low') {
                sortedProducts.sort((a, b) => b.rating - a.rating);
            } else if (sortType === 'Name, A to Z') {
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortType === 'Name, Z to A') {
                sortedProducts.sort((a, b) => b.name.localeCompare(b.name));
            }

            renderProducts(sortedProducts);
            sortMenu.classList.remove('active');
        });
    });

    // Filter menu toggle and functionality
    const filterBtn = document.querySelector('.filter-btn');
    const filterMenu = document.querySelector('.filter-menu');
    const applyFiltersBtn = document.querySelector('.apply-filters');

    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterMenu.classList.toggle('active');
    });

    applyFiltersBtn.addEventListener('click', () => {
        const filteredProducts = applyFiltersAndSort();
        renderProducts(filteredProducts);
        filterMenu.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
        if (!sortMenu.contains(e.target) && !sortBtn.contains(e.target)) {
            sortMenu.classList.remove('active');
        }
        if (!filterMenu.contains(e.target) && !filterBtn.contains(e.target)) {
            filterMenu.classList.remove('active');
        }
    });
});