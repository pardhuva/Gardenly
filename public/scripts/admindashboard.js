document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('.section');
    const menu = document.getElementById('menu');
    const navbar = document.querySelector('.navbar');

    // Navigation Handling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            if (sectionId === 'logout') {
                window.location.href = '/logout';
                return;
            }

            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                menu.classList.remove('fa-times');
            }
        });
    });

    menu.addEventListener('click', () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    });

    // Fetch Overview Data
    async function fetchOverview() {
        try {
            const usersRes = await fetch('/api/users');
            const users = await usersRes.json();
            document.getElementById('total-users').textContent = users.length;

            const productsRes = await fetch('/api/products');
            const products = await productsRes.json();
            document.getElementById('total-products').textContent = products.length;

            const ticketsRes = await fetch('/api/tickets/all');
            const tickets = await ticketsRes.json();
            const openTickets = tickets.filter(t => t.status === 'Open').length;
            document.getElementById('open-tickets').textContent = openTickets;

            // Calculate total revenue from orders
            const ordersRes = await fetch('/api/orders');
            const orders = await ordersRes.json();
            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
            document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
        } catch (error) {
            console.error('Error fetching overview:', error);
        }
    }

    // Fetch Users
    async function fetchUsers() {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();
            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = '';
            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>${user.email}</td>
                    <td>${user.mobile}</td>
                    <td>
                        <button onclick="editUser(${user.id})">Edit</button>
                        <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Fetch Products
    async function fetchProducts() {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            const tbody = document.getElementById('products-table-body');
            tbody.innerHTML = '';
            products.forEach(product => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.quantity}</td>
                    <td>${product.seller_id}</td>
                    <td>
                        <button onclick="editProduct(${product.id})">Edit</button>
                        <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Fetch Tickets
    async function fetchTickets() {
        try {
            const response = await fetch('/api/tickets/all');
            const tickets = await response.json();
            const tbody = document.getElementById('tickets-table-body');
            tbody.innerHTML = '';
            tickets.forEach(ticket => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${ticket.id}</td>
                    <td>${ticket.requester}</td>
                    <td>${ticket.subject}</td>
                    <td>${ticket.type}</td>
                    <td>
                        <select onchange="updateTicketStatus(${ticket.id}, this.value)">
                            <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
                            <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
                        </select>
                    </td>
                    <td>${ticket.expert_id}</td>
                    <td>
                        <button onclick="viewTicket(${ticket.id})">View</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    }

    // Fetch Orders
    async function fetchOrders() {
        try {
            const response = await fetch('/api/orders');
            const orders = await response.json();
            const tbody = document.getElementById('orders-table-body');
            tbody.innerHTML = '';
            orders.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.customer}</td>
                    <td>${order.product}</td>
                    <td>$${parseFloat(order.amount).toFixed(2)}</td>
                    <td>
                        <button class="delete" onclick="deleteOrder('${order.id}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            const tbody = document.getElementById('orders-table-body');
            tbody.innerHTML = '<tr><td colspan="5">Failed to load orders</td></tr>';
        }
    }

    // CRUD Functions for Users
    window.editUser = async (id) => {
        const newRole = prompt('Enter new role (Admin, Seller, Buyer, Expert, Delivery Manager):');
        if (newRole && ['Admin', 'Seller', 'Buyer', 'Expert', 'Delivery Manager'].includes(newRole)) {
            try {
                const response = await fetch(`/api/users/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: newRole })
                });
                if (response.ok) {
                    fetchUsers();
                    alert('User updated successfully');
                } else {
                    alert('Failed to update user');
                }
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    window.deleteUser = async (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/users/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchUsers();
                    alert('User deleted successfully');
                } else {
                    alert('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    // CRUD Functions for Products
    window.editProduct = async (id) => {
        const newPrice = prompt('Enter new price:');
        const newQuantity = prompt('Enter new quantity:');
        if (newPrice && newQuantity) {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ price: parseFloat(newPrice), quantity: parseInt(newQuantity) })
                });
                if (response.ok) {
                    fetchProducts();
                    alert('Product updated successfully');
                } else {
                    alert('Failed to update product');
                }
            } catch (error) {
                console.error('Error updating product:', error);
            }
        }
    };

    window.deleteProduct = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchProducts();
                    alert('Product deleted successfully');
                } else {
                    alert('Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    // CRUD Functions for Tickets
    window.updateTicketStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                fetchTickets();
                fetchOverview();
                alert('Ticket status updated');
            } else {
                alert('Failed to update ticket status');
            }
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    window.viewTicket = (id) => {
        alert(`View details for ticket ID: ${id} (Implement modal here)`);
    };

    // CRUD Functions for Orders
    window.createOrder = async () => {
        const customer_username = prompt('Enter customer username:');
        const product_names = prompt('Enter product names (comma-separated):');
        const amount = prompt('Enter order amount:');
        
        if (customer_username && product_names && amount) {
            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ customer_username, product_names, amount })
                });
                if (response.ok) {
                    fetchOrders();
                    fetchOverview();
                    alert('Order created successfully');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to create order: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error creating order:', error);
                alert('Error creating order');
            }
        }
    };

    window.deleteOrder = async (id) => {
        if (confirm('Are you sure you want to delete this order?')) {
            try {
                const response = await fetch(`/api/orders/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchOrders();
                    fetchOverview();
                    alert('Order deleted successfully');
                } else {
                    alert('Failed to delete order');
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Error deleting order');
            }
        }
    };

    // Initial Data Fetch
    fetchOverview();
    fetchUsers();
    fetchProducts();
    fetchTickets();
    fetchOrders();
});