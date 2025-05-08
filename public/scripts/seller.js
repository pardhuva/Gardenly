document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("seller-product-form");
    const topSales = document.getElementById("seller-top-sales");
    const recentSales = document.getElementById("seller-recent-sales");
    const productModal = document.getElementById("seller-product-modal");
    const overlay = document.getElementById("seller-overlay");
    const modalImg = document.getElementById("seller-modal-img");
    const modalTitle = document.getElementById("seller-modal-title");
    const modalPrice = document.getElementById("seller-modal-price");
    const modalQuantity = document.getElementById("seller-modal-quantity");
    const modalSold = document.getElementById("seller-modal-sold");
    const modalDescription = document.getElementById("seller-modal-description");
    const closeBtn = document.querySelector(".seller-close");

    let products = [];
    let isSubmitting = false;

    // Function to fetch top sales from server
    async function fetchTopSales() {
        try {
            const response = await fetch('/api/top-sales');
            if (!response.ok) throw new Error('Failed to fetch top sales');
            return await response.json();
        } catch (error) {
            console.error('Error loading top sales:', error);
            return [];
        }
    }

    // Function to fetch recent sales from server
    async function fetchRecentSales() {
        try {
            const response = await fetch('/api/recent-sales');
            if (!response.ok) throw new Error('Failed to fetch recent sales');
            return await response.json();
        } catch (error) {
            console.error('Error loading recent sales:', error);
            return [];
        }
    }

    // Function to create a product card
    function createProductCard(product) {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.setAttribute('data-product-id', product.id);
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <p class="quantity">Quantity: ${product.quantity}</p>
            <p class="sold">Sold: ${product.sold}</p>
            <button class="view-details-btn">View Details</button>
            <button class="seller-edit-btn">Edit</button>
            <button class="seller-delete-btn">Delete</button>
        `;

        // Add event listeners for the buttons
        productDiv.querySelector(".view-details-btn").addEventListener("click", () => showProductDetails(product));
        productDiv.querySelector(".seller-edit-btn").addEventListener("click", () => editProduct(product));
        productDiv.querySelector(".seller-delete-btn").addEventListener("click", () => deleteProduct(product));

        return productDiv;
    }

    // Function to show product details
    function showProductDetails(product) {
        modalImg.src = product.image;
        modalTitle.textContent = product.name;
        modalPrice.textContent = `Price: ${product.price}`;
        modalQuantity.textContent = `Quantity: ${product.quantity}`;
        modalSold.textContent = `Sold: ${product.sold}`;
        modalDescription.textContent = product.description || "No description available";
        
        productModal.classList.add('active');
        overlay.classList.add('active');
    }

    // Function to edit a product
    async function editProduct(product) {
        const newName = prompt("Enter new product name:", product.name);
        const newDescription = prompt("Enter new description:", product.description || "");
        const newCategory = prompt("Enter new category:", product.category || "");
        const newPrice = prompt("Enter new price (e.g., 10.99):", product.price.replace('$', ''));
        const newQuantity = prompt("Enter new quantity:", product.quantity);

        if (newName && newDescription !== null && newCategory && newPrice && newQuantity) {
            const priceNum = parseFloat(newPrice);
            const quantityNum = parseInt(newQuantity);
            if (isNaN(priceNum) || priceNum <= 0) {
                alert('Price must be a positive number.');
                return;
            }
            if (isNaN(quantityNum) || quantityNum < 0) {
                alert('Quantity must be a non-negative integer.');
                return;
            }

            try {
                const response = await fetch(`/api/products/${product.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: newName,
                        description: newDescription,
                        category: newCategory,
                        price: priceNum,
                        quantity: quantityNum
                    })
                });

                const rawResponse = await response.text();
                console.log('Edit response:', rawResponse);

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = JSON.parse(rawResponse);
                    } catch {
                        throw new Error('Server returned an unexpected response: ' + rawResponse);
                    }
                    throw new Error(errorData.message || 'Failed to update product');
                }

                await renderProducts();
                alert('Product updated successfully!');
            } catch (error) {
                console.error('Error updating product:', error);
                alert(error.message || 'Failed to update product. Please try again.');
            }
        } else {
            alert('All fields are required.');
        }
    }

    // Function to delete a product
    async function deleteProduct(product) {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`/api/products/${product.id}`, {
                    method: 'DELETE'
                });

                const rawResponse = await response.text();
                console.log('Delete response:', rawResponse);

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = JSON.parse(rawResponse);
                    } catch {
                        throw new Error('Server returned an unexpected response: ' + rawResponse);
                    }
                    throw new Error(errorData.message || 'Failed to delete product');
                }

                products = products.filter(p => p.id !== product.id);
                await renderProducts();
                alert('Product deleted successfully!');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert(error.message || 'Failed to delete product. Please try again.');
            }
        }
    }

    // Function to render all products
    async function renderProducts() {
        // Clear top and recent sales
        topSales.innerHTML = "";
        recentSales.innerHTML = "";

        try {
            // Fetch products from the server
            const response = await fetch('/api/seller/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            products = await response.json();

            // Clear existing product lists within categories
            document.querySelectorAll('.product-list').forEach(list => list.innerHTML = "");

            // Group products by category
            const productsByCategory = products.reduce((acc, product) => {
                const category = product.category || 'Uncategorized';
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(product);
                return acc;
            }, {});

            // Get the seller products container
            const sellerProducts = document.querySelector('.seller-products');

            // Ensure the "Your Products" heading exists
            if (!sellerProducts.querySelector('h2')) {
                sellerProducts.innerHTML = '<h2>Your Products</h2>';
            }

            // Handle empty state
            if (Object.keys(productsByCategory).length === 0) {
                const emptyMessage = document.createElement('p');
                emptyMessage.textContent = 'No products found. Add a product to get started!';
                sellerProducts.appendChild(emptyMessage);
            } else {
                // Remove empty state message if it exists
                const emptyMessage = sellerProducts.querySelector('p');
                if (emptyMessage) {
                    emptyMessage.remove();
                }

                // Render products for each category
                Object.keys(productsByCategory).forEach(category => {
                    const categoryId = category.toLowerCase().replace(/\s+/g, '-');
                    // Check for existing category section (case-insensitive)
                    let categorySection = Array.from(document.querySelectorAll('.category-section h3'))
                        .find(h3 => h3.textContent.toLowerCase() === category.toLowerCase())?.parentElement;

                    if (!categorySection) {
                        // Create new category section if it doesn't exist
                        categorySection = document.createElement('div');
                        categorySection.className = 'category-section';
                        categorySection.innerHTML = `
                            <h3>${category}</h3>
                            <div class="product-list" id="seller-product-list-${categoryId}"></div>
                        `;
                        sellerProducts.appendChild(categorySection);
                    }

                    // Get the product list for this category
                    const categoryList = categorySection.querySelector(`#seller-product-list-${categoryId}`);
                    productsByCategory[category].forEach(product => {
                        const productCard = createProductCard(product);
                        categoryList.appendChild(productCard);
                    });
                });
            }

            // Render top sales
            const topProducts = await fetchTopSales();
            topProducts.forEach(product => {
                const productCard = createProductCard(product);
                topSales.appendChild(productCard);
            });

            // Render recent sales
            const recentProducts = await fetchRecentSales();
            recentProducts.forEach(product => {
                const productCard = createProductCard(product);
                recentSales.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error rendering products:', error);
            alert('Failed to load products. Please refresh the page.');
        }
    }

    // Function to compress image
    async function compressImage(file, maxWidth = 800, quality = 0.7) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const scale = Math.min(maxWidth / img.width, 1);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
            };
            reader.readAsDataURL(file);
        });
    }

    // Form submission handler
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        const name = document.getElementById('seller-product-name').value.trim();
        const description = document.getElementById('seller-product-description').value.trim();
        const category = document.getElementById('seller-product-category').value.trim();
        const price = document.getElementById('seller-product-price').value;
        const quantity = document.getElementById('seller-product-quantity').value;
        const imageFile = document.getElementById('seller-product-image').files[0];

        if (!name) {
            alert('Please enter a product name');
            isSubmitting = false;
            return;
        }

        if (!imageFile) {
            alert('Please select a product image');
            isSubmitting = false;
            return;
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            alert('Image file size exceeds 5MB. Please select a smaller image.');
            isSubmitting = false;
            return;
        }

        if (!category) {
            alert('Please enter a category');
            isSubmitting = false;
            return;
        }

        const priceNum = parseFloat(price);
        const quantityNum = parseInt(quantity);
        if (!price || isNaN(priceNum) || priceNum <= 0) {
            alert('Please enter a valid positive price');
            isSubmitting = false;
            return;
        }
        if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
            alert('Please enter a valid positive quantity');
            isSubmitting = false;
            return;
        }

        // Compress the image
        let compressedImage;
        try {
            compressedImage = await compressImage(imageFile);
        } catch (error) {
            console.error('Error compressing image:', error);
            alert('Failed to compress image');
            isSubmitting = false;
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', priceNum);
        formData.append('quantity', quantityNum);

        const blob = await fetch(compressedImage).then(res => res.blob());
        formData.append('image', blob, imageFile.name);

        try {
            const response = await fetch('/addproduct', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log('Server response:', result);
            
            if (result.success) {
                e.target.reset();
                await renderProducts();
                alert('Product added successfully!');
            } else {
                alert(result.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        } finally {
            isSubmitting = false;
        }
    });

    // Event listeners
    closeBtn.addEventListener("click", () => {
        productModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener("click", () => {
        productModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Initial render
    renderProducts();
});