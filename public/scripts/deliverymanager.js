document.addEventListener('DOMContentLoaded', function () {
    // Sample data for demonstration
    let deliveries = [
        // Pending Deliveries
        { id: 1, orderId: 'ORD123', customer: 'John Doe', address: '123 Main St', status: 'Pending' },
        { id: 2, orderId: 'ORD124', customer: 'Jane Smith', address: '456 Elm St', status: 'Pending' },
        { id: 3, orderId: 'ORD125', customer: 'Alice Johnson', address: '789 Oak St', status: 'Pending' },

        // In Progress Deliveries
        { id: 4, orderId: 'ORD126', customer: 'Bob Brown', address: '321 Pine St', status: 'In Progress' },
        { id: 5, orderId: 'ORD127', customer: 'Charlie Davis', address: '654 Maple St', status: 'In Progress' },
        { id: 6, orderId: 'ORD128', customer: 'Eve White', address: '987 Cedar St', status: 'In Progress' },

        // Completed Deliveries
        { id: 7, orderId: 'ORD129', customer: 'Frank Green', address: '135 Birch St', status: 'Completed' },
        { id: 8, orderId: 'ORD130', customer: 'Grace Hall', address: '246 Walnut St', status: 'Completed' },
        { id: 9, orderId: 'ORD131', customer: 'Henry King', address: '357 Cherry St', status: 'Completed' }
    ];

    // Function to render deliveries based on status
    function renderDeliveries(deliveries) {
        const pendingList = document.getElementById('pending-delivery-list');
        const inProgressList = document.getElementById('in-progress-delivery-list');
        const completedList = document.getElementById('completed-delivery-list');

        // Clear existing lists
        pendingList.innerHTML = '';
        inProgressList.innerHTML = '';
        completedList.innerHTML = '';

        deliveries.forEach(delivery => {
            const deliveryItem = document.createElement('div');
            deliveryItem.className = 'delivery-item';
            deliveryItem.innerHTML = `
                <div class="delivery-info">
                    <strong>Order ID:</strong> ${delivery.orderId}<br>
                    <strong>Customer:</strong> ${delivery.customer}<br>
                    <strong>Address:</strong> ${delivery.address}<br>
                    <strong>Status:</strong> ${delivery.status}
                </div>
                <div class="delivery-actions">
                    <button class="update-status" data-id="${delivery.id}">Update Status</button>
                    <button class="view-details" data-id="${delivery.id}">View Details</button>
                </div>
            `;

            // Append to the appropriate list based on status
            if (delivery.status === 'Pending') {
                pendingList.appendChild(deliveryItem);
            } else if (delivery.status === 'In Progress') {
                inProgressList.appendChild(deliveryItem);
            } else if (delivery.status === 'Completed') {
                completedList.appendChild(deliveryItem);
            }
        });

        // Add event listeners to buttons
        addEventListeners();
    }

    // Function to add event listeners to buttons
    function addEventListeners() {
        // Update Status Button
        document.querySelectorAll('.update-status').forEach(button => {
            button.addEventListener('click', function () {
                const deliveryId = this.getAttribute('data-id');
                updateDeliveryStatus(deliveryId);
            });
        });

        // View Details Button
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function () {
                const deliveryId = this.getAttribute('data-id');
                viewDeliveryDetails(deliveryId);
            });
        });
    }

    // Function to update delivery status
    function updateDeliveryStatus(deliveryId) {
        const delivery = deliveries.find(d => d.id == deliveryId);
        if (delivery) {
            // Cycle through statuses: Pending -> In Progress -> Completed
            if (delivery.status === 'Pending') {
                delivery.status = 'In Progress';
            } else if (delivery.status === 'In Progress') {
                delivery.status = 'Completed';
            } else if (delivery.status === 'Completed') {
                delivery.status = 'Pending';
            }
            alert(`Status updated for Order ID: ${delivery.orderId}. New Status: ${delivery.status}`);
            renderDeliveries(deliveries); // Re-render the list
        }
    }
    function updateDeliveryStatus(orderId, status) {
        // Find the delivery object
        let delivery = deliveries.find(d => d.orderId === orderId);
        if (delivery) {
            delivery.status = status;
            renderDeliveries(deliveries); // Re-render UI
        }
    }
    
    // Function to view delivery details
    function viewDeliveryDetails(deliveryId) {
        const delivery = deliveries.find(d => d.id == deliveryId);
        if (delivery) {
            alert(`Order ID: ${delivery.orderId}\nCustomer: ${delivery.customer}\nAddress: ${delivery.address}\nStatus: ${delivery.status}`);
        }
    }

    // Render deliveries on page load
    renderDeliveries(deliveries);
});