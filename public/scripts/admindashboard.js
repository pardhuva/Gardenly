document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeSelectorBtn = document.getElementById('theme-selector-btn');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('overlay');
    const navItems = document.querySelectorAll('.sidebar-nav li');
    const pages = document.querySelectorAll('.page');
    const addAgentBtn = document.getElementById('add-agent-btn');
    const settingsForm = document.getElementById('settings-form');
    const statusFilter = document.getElementById('status-filter');
    const agentSelects = document.querySelectorAll('.agent-select');

    // Initialize Charts
    initCharts();

    // Toggle Theme
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        updateThemeButtonText();
        // Reinitialize charts with new theme colors
        setTimeout(initCharts, 100);
    }

    function updateThemeButtonText() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (themeSelectorBtn) {
            themeSelectorBtn.innerHTML = isDarkMode ?
                '<i class="fas fa-sun"></i> Light Mode' :
                '<i class="fas fa-moon"></i> Dark Mode';
        }
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (themeSelectorBtn) themeSelectorBtn.addEventListener('click', toggleTheme);

    // Mobile Menu Toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            sidebar.classList.add('active');
            overlay.style.display = 'block';
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', function () {
            sidebar.classList.remove('active');
            overlay.style.display = 'none';
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function () {
            sidebar.classList.remove('active');
            overlay.style.display = 'none';
        });
    }

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Update active nav item
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding page
            const pageId = this.getAttribute('data-page') + '-page';
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                overlay.style.display = 'none';
            }
        });
    });

    // Add Agent Button
    if (addAgentBtn) {
        addAgentBtn.addEventListener('click', function () {
            alert('Add Agent functionality will be implemented here.');
        });
    }

    // Settings Form
    if (settingsForm) {
        settingsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Settings saved successfully!');
        });
    }

    // Status Filter
    if (statusFilter) {
        statusFilter.addEventListener('change', function () {
            const value = this.value;
            const rows = document.querySelectorAll('#orders-table tbody tr');

            rows.forEach(row => {
                const statusCell = row.querySelector('td:nth-child(6)');
                const statusText = statusCell.textContent.trim().toLowerCase();

                if (value === 'all' || statusText.includes(value)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Agent Assignment
    agentSelects.forEach(select => {
        select.addEventListener('change', function () {
            if (this.value) {
                const agentName = this.options[this.selectedIndex].text;
                const row = this.closest('tr');
                const statusCell = row.querySelector('td:nth-child(6) span');

                // Update the cell with the selected agent
                this.parentNode.innerHTML = agentName;

                // Update status from "Pending" to "Processing"
                if (statusCell.classList.contains('pending')) {
                    statusCell.classList.remove('pending');
                    statusCell.classList.add('processing');
                    statusCell.textContent = 'Processing';
                }

                alert(`Order assigned to ${agentName} successfully!`);
            }
        });
    });

    // Initialize Charts
    function initCharts() {
        // Get colors from CSS variables
        const primaryColor = '#22c55e';
        const secondaryColor = '#3b82f6';
        const tertiaryColor = '#f59e0b';
        const quaternaryColor = '#8b5cf6';
        const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border');
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground');
        const mutedTextColor = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground');

        // Delivery Performance Chart
        const deliveryCtx = document.getElementById('delivery-chart');
        if (deliveryCtx) {
            new Chart(deliveryCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Deliveries',
                        data: [12, 19, 15, 17, 22, 18, 15],
                        borderColor: primaryColor,
                        tension: 0.3,
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: borderColor },
                            ticks: { color: mutedTextColor }
                        },
                        x: {
                            grid: { color: borderColor },
                            ticks: { color: mutedTextColor }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: textColor }
                        }
                    }
                }
            });
        }

        // Delivery Status Chart
        const statusCtx = document.getElementById('status-chart');
        if (statusCtx) {
            new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'],
                    datasets: [{
                        data: [15, 10, 18, 32, 5],
                        backgroundColor: [tertiaryColor, secondaryColor, quaternaryColor, primaryColor, '#ef4444'],
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: textColor }
                        }
                    }
                }
            });
        }

        // Weekly Performance Chart
        const weeklyCtx = document.getElementById('weekly-performance-chart');
        if (weeklyCtx) {
            new Chart(weeklyCtx, {
                type: 'bar',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [
                        {
                            label: 'On-Time Deliveries',
                            data: [65, 72, 78, 82],
                            backgroundColor: primaryColor,
                        },
                        {
                            label: 'Delayed Deliveries',
                            data: [8, 6, 5, 3],
                            backgroundColor: tertiaryColor,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: borderColor },
                            ticks: { color: mutedTextColor }
                        },
                        x: {
                            grid: { color: borderColor },
                            ticks: { color: mutedTextColor }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: textColor }
                        }
                    }
                }
            });
        }

        // Zone Performance Chart
        const zoneCtx = document.getElementById('zone-performance-chart');
        if (zoneCtx) {
            new Chart(zoneCtx, {
                type: 'bar',
                data: {
                    labels: ['North', 'South', 'East', 'West', 'Central'],
                    datasets: [{
                        label: 'Avg. Delivery Time (min)',
                        data: [38, 42, 40, 36, 45],
                        backgroundColor: secondaryColor,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: borderColor },
                            ticks: { color: mutedTextColor }
                        },
                        x: {
                            grid: { color: borderColor },
                            ticks: { color: mutedTextColor }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: textColor }
                        }
                    }
                }
            });
        }
    }

    // Initialize Google Map
    function initMap() {
        const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // New York
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: defaultLocation,
        });

        new google.maps.Marker({
            position: defaultLocation,
            map: map,
            title: 'New York',
        });
    }

    // Load Google Maps API
    function loadGoogleMaps() {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.defer = true;
        script.async = true;
        document.head.appendChild(script);
    }

    loadGoogleMaps();
});