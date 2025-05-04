document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("seller-product-form");
    const productList = document.getElementById("seller-product-list");
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
    const sizesContainer = document.getElementById("sizes-container");
    const addSizeButton = document.getElementById("add-size");

    let products = [];

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
        productDiv.className = "seller-product";
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Quantity: ${product.quantity}</p>
            <p>Sold: ${product.sold}</p>
            <button class="seller-details-btn" data-product-id="${product.id}">View Details</button>
            <button class="seller-edit-btn" data-product-id="${product.id}">Edit</button>
            <button class="seller-delete-btn" data-product-id="${product.id}">Delete</button>
        `;

        // Add event listeners for the buttons
        productDiv.querySelector(".seller-details-btn").addEventListener("click", () => showProductDetails(product));
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
        
        productModal.style.display = "block";
        overlay.style.display = "block";
    }

    // Function to edit a product
    async function editProduct(product) {
        const newName = prompt("Enter new product name:", product.name);
        const newPrice = prompt("Enter new price (e.g., 10.99):", product.price.replace('$', ''));
        const newQuantity = prompt("Enter new quantity:", product.quantity);
        const newDescription = prompt("Enter new description:", product.description);

        if (newName && newPrice && newQuantity && newDescription) {
            try {
                const response = await fetch(`/api/products/${product.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: newName,
                        price: newPrice,
                        quantity: newQuantity,
                        description: newDescription
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
            } catch (error) {
                console.error('Error updating product:', error);
                alert(error.message || 'Failed to update product. Please try again.');
            }
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
            } catch (error) {
                console.error('Error deleting product:', error);
                alert(error.message || 'Failed to delete product. Please try again.');
            }
        }
    }

    // Function to render all products
    async function renderProducts() {
        productList.innerHTML = "";
        topSales.innerHTML = "";
        recentSales.innerHTML = "";

        try {
            // Fetch products from the server
            const response = await fetch('/api/seller/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            products = await response.json();

            // Render all products
            products.forEach(product => {
                const productCard = createProductCard(product);
                productList.appendChild(productCard);
            });

            // Fetch and render top sales
            const topProducts = await fetchTopSales();
            topProducts.forEach(product => {
                const productCard = createProductCard(product);
                topSales.appendChild(productCard);
            });

            // Fetch and render recent sales
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

    // Add event listener for adding new size fields
    addSizeButton.addEventListener("click", () => {
        const sizeEntry = document.createElement("div");
        sizeEntry.className = "size-entry";
        sizeEntry.innerHTML = `
            <input type="text" class="size-name" placeholder="Size (e.g., Small, Medium)" required>
            <input type="number" class="size-price" placeholder="Price ($)" step="0.01" required>
            <input type="number" class="size-quantity" placeholder="Quantity" min="1" required>
            <button type="button" class="remove-size">Remove</button>
        `;
        sizesContainer.appendChild(sizeEntry);
    });

    // Add event delegation for remove size buttons
    sizesContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-size")) {
            if (sizesContainer.children.length > 1) {
                e.target.parentElement.remove();
            } else {
                alert("At least one size is required");
            }
        }
    });

    // Form submission handler
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('seller-product-name').value.trim();
        const description = document.getElementById('seller-product-description').value.trim();
        const category = document.getElementById('seller-product-category').value.trim();
        const imageFile = document.getElementById('seller-product-image').files[0];

        if (!name) {
            alert('Please enter a product name');
            return;
        }

        if (!imageFile) {
            alert('Please select a product image');
            return;
        }

        if (!category) {
            alert('Please enter a category');
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('image', imageFile);

        // Collect size information
        const sizeInputs = document.querySelectorAll('.size-entry');
        const sizes = [];
        let hasValidSize = false;

        sizeInputs.forEach(input => {
            const size = input.querySelector('.size-name').value.trim();
            const price = input.querySelector('.size-price').value;
            const quantity = input.querySelector('.size-quantity').value;
            
            if (size && price && quantity) {
                const priceNum = parseFloat(price);
                const quantityNum = parseInt(quantity);
                
                if (!isNaN(priceNum) && !isNaN(quantityNum) && priceNum > 0 && quantityNum > 0) {
                    sizes.push({
                        size,
                        price: priceNum,
                        quantity: quantityNum
                    });
                    hasValidSize = true;
                }
            }
        });

        if (!hasValidSize) {
            alert('Please add at least one size with valid price and quantity');
            return;
        }

        formData.append('sizes', JSON.stringify(sizes));

        try {
            const response = await fetch('/addproduct', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log('Server response:', result);
            
            if (result.success) {
                // Reset the form
                e.target.reset();
                // Clear the sizes container
                const sizesContainer = document.getElementById('sizes-container');
                sizesContainer.innerHTML = '';
                // Add one empty size entry
                addSizeEntry();
                
                // Add the new product to the UI
                const category = result.product.category || 'Uncategorized';
                const categoryId = category.toLowerCase().replace(/\s+/g, '-');
                
                // Find or create the category section
                let categorySection = document.querySelector(`.category-section h3:contains('${category}')`)?.parentElement;
                
                if (!categorySection) {
                    const sellerProducts = document.querySelector('.seller-products');
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
                
                // Create product card
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute('data-product-id', result.product.id);
                productCard.innerHTML = `
                    <img src="${result.product.image}" alt="${result.product.name}">
                    <h3>${result.product.name}</h3>
                    <p class="price">${result.product.price}</p>
                    <p class="quantity">Quantity: ${result.product.quantity}</p>
                    <p class="sold">Sold: ${result.product.sold}</p>
                    <button class="view-details-btn">View Details</button>
                `;
                
                // Add product to category list
                categoryList.insertBefore(productCard, categoryList.firstChild);
                
                // Add to recent sales
                const recentSales = document.getElementById('seller-recent-sales');
                recentSales.insertBefore(productCard.cloneNode(true), recentSales.firstChild);
                
                // Show success message
                alert('Product added successfully!');
            } else {
                alert(result.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    });

    // Event listeners
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    // Initial render
    renderProducts();
});
