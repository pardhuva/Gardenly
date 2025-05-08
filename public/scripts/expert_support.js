document.addEventListener('DOMContentLoaded', () => {
    const sections = {
        home: document.getElementById('homeSection'),
        knowledgeBase: document.getElementById('knowledgeBaseSection'),
        ticket: document.getElementById('ticketSection'),
        article: document.getElementById('articleSection'),
        articleList: document.getElementById('articleListSection'),
        messages: document.getElementById('messagesSection')
    };

    const navLinks = {
        home: document.getElementById('homeLink'),
        support: document.getElementById('supportLink'),
        knowledgeBase: document.getElementById('knowledgeBaseLink'),
        ticket: document.getElementById('submitTicketLink'),
        messages: document.getElementById('messagesLink')
    };

    const articles = {
        'buy-now-pay-later': {
            title: 'What is "Buy Now Pay Later" Payment Mode',
            modifiedDate: 'Fri, 2 Jun, 2023 at 9:50 AM',
            content: `
                <p>1. Pay Later is one of the payment modes of the Simpl payment gateway, in which you can checkout with 1 tap and pays later.</p>
                <p>2. All your purchases (done by Simpl-Pay Later on any website) get added to one convenient bill, which you can pay in one go, after every 15 days.</p>
                <p>3. Also, you can choose to pay for your transactions even before your bill is generated, with the help of UPI, Credit, or Debit Cards.</p>
                <p>You can do so by logging into your account via Simpl App or Website (<a href="https://getsimpl.com/signin">https://getsimpl.com/signin</a>).</p>
                <p>*By using the Simpl payment gateway (any mode), you will get 30% or Rs. 70 OFF (whichever is the minimum) on your order.</p>
            `
        },
        'cancel-refund': {
            title: 'Cancel/Replace/Refund/Return',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:31 PM',
            content: `
                <p>Once the order has been confirmed, it cannot be canceled, refunded, replaced, or returned.</p>
                <p>*We do not have a refund policy if you refuse the delivery.</p>
                <p>Please refer to the <a href="#">Refund Policy</a> for more details.</p>
            `
        },
        'order-status': {
            title: 'Order Status',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:13 PM',
            content: `
                <p>You can check the status of your order by logging into your account and visiting the 'My Orders' section.</p>
                <p>Order statuses include: Pending, Processing, Shipped, and Delivered.</p>
            `
        },
        'damage-product': {
            title: 'Damage/Wrong Product Received',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:33 PM',
            content: `
                <p>If you received a damaged or wrong product, please submit a ticket with details and photos of the issue.</p>
                <p>Our support team will review and provide a resolution within 48 hours.</p>
            `
        },
        'cashback': {
            title: 'Cashback Voucher/Cashback Coupon',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:38 PM',
            content: `
                <p>Cashback vouchers can be applied at checkout for eligible orders.</p>
                <p>Check the terms and conditions of each voucher for validity and usage details.</p>
            `
        },
        'what-is-simpl': {
            title: 'What is Simpl',
            modifiedDate: 'Fri, 2 Jun, 2023 at 9:45 AM',
            content: `
                <p>Simpl is a payment gateway that allows you to pay for your purchases later.</p>
                <p>It offers a seamless checkout experience with flexible payment options.</p>
            `
        },
        'pay-later-cod': {
            title: 'Is Pay Later and COD the same?',
            modifiedDate: 'Fri, 2 Jun, 2023 at 9:55 AM',
            content: `
                <p>No, Pay Later and Cash on Delivery (COD) are not the same.</p>
                <p>Pay Later allows you to settle your bill after 15 days via Simpl, while COD requires payment at the time of delivery.</p>
            `
        }
    };

    const articleLists = {
        'quick-help': [
            { id: 'order-status', title: 'Order Status' },
            { id: 'cancel-refund', title: 'Cancel/Replace/Refund/Return' },
            { id: 'damage-product', title: 'Damage/Wrong Product Received' },
            { id: 'cashback', title: 'Cashback Voucher/Cashback Coupon' }
        ],
        'payment-gateway': [
            { id: 'what-is-simpl', title: 'What is Simpl' },
            { id: 'buy-now-pay-later', title: 'What is "Buy Now Pay Later" Payment Mode' },
            { id: 'pay-later-cod', title: 'Is Pay Later and COD are same?' }
        ]
    };

    function showSection(sectionName) {
        Object.values(sections).forEach(section => section.classList.remove('active'));
        sections[sectionName].classList.add('active');

        Object.values(navLinks).forEach(link => link.classList.remove('active'));
        if (navLinks[sectionName]) navLinks[sectionName].classList.add('active');
    }

    function showArticle(articleId) {
        const article = articles[articleId];
        if (!article) return;

        const breadcrumb = sections.article.querySelector('.breadcrumb');
        const content = sections.article.querySelector('.article-content');

        breadcrumb.innerHTML = `
            <a href="#" data-section="home">Home</a> > 
            <a href="#" data-section="knowledgeBase">Knowledge Base</a> > ${article.title}
        `;
        content.innerHTML = `
            <h1>${article.title}</h1>
            <p class="modified-date">Modified on ${article.modifiedDate}</p>
            ${article.content}
        `;

        showSection('article');
    }

    function showArticleList(listId) {
        const list = articleLists[listId];
        if (!list) return;

        const breadcrumb = sections.articleList.querySelector('.breadcrumb');
        const content = sections.articleList.querySelector('.article-list');

        breadcrumb.innerHTML = `
            <a href="#" data-section="home">Home</a> > 
            <a href="#" data-section="knowledgeBase">Knowledge Base</a> > ${listId.replace('-', ' ')}
        `;
        content.innerHTML = `
            <h1>${listId.replace('-', ' ')}</h1>
            <ul>
                ${list.map(item => `<li><a href="#" data-article="${item.id}">${item.title}</a></li>`).join('')}
            </ul>
        `;

        showSection('articleList');
    }

    async function fetchUserTickets() {
        try {
            const response = await fetch('/api/user-tickets');
            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }
            const tickets = await response.json();
            const tbody = document.getElementById('userTicketsTableBody');
            tbody.innerHTML = tickets.map(ticket => `
                <tr>
                    <td>${ticket._id}</td>
                    <td>${ticket.subject}</td>
                    <td>${ticket.type}</td>
                    <td>${ticket.status}</td>
                    <td>${ticket.expert_id ? ticket.expert_id.username : 'Unassigned'}</td>
                    <td>${ticket.resolution || 'Pending'}</td>
                    <td><a href="#" data-ticket="${ticket._id}">View</a></td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching user tickets:', error);
            alert('Error fetching your tickets');
        }
    }

    function showTicketDetails(ticketId) {
        fetch('/api/user-tickets')
            .then(response => response.json())
            .then(tickets => {
                const ticket = tickets.find(t => t._id === ticketId);
                if (ticket) {
                    sections.ticket.innerHTML = `
                        <h1>Ticket Details</h1>
                        <div class="ticket-details">
                            <p><strong>ID:</strong> ${ticket._id}</p>
                            <p><strong>Subject:</strong> ${ticket.subject}</p>
                            <p><strong>Type:</strong> ${ticket.type}</p>
                            <p><strong>Description:</strong> ${ticket.description}</p>
                            <p><strong>Status:</strong> ${ticket.status}</p>
                            <p><strong>Expert:</strong> ${ticket.expert_id ? ticket.expert_id.username : 'Unassigned'}</p>
                            <p><strong>Resolution:</strong> ${ticket.resolution || 'Pending'}</p>
                            ${ticket.attachment ? `<p><strong>Attachment:</strong><br><img src="${ticket.attachment}" alt="Attachment" style="max-width: 100%;"></p>` : ''}
                            <button class="cancel-btn" id="backToMessages">Back to Messages</button>
                        </div>
                    `;
                    document.getElementById('backToMessages').addEventListener('click', () => {
                        showSection('messages');
                        fetchUserTickets();
                    });
                    showSection('ticket');
                }
            })
            .catch(error => {
                console.error('Error fetching ticket details:', error);
                alert('Error fetching ticket details');
            });
    }

    Object.keys(navLinks).forEach(key => {
        navLinks[key].addEventListener('click', (e) => {
            // Allow default navigation for 'home' and 'support' links
            if (key === 'home' || key === 'support') {
                return; // Let the browser handle the href navigation
            }
            e.preventDefault();
            showSection(key);
            if (key === 'messages') {
                fetchUserTickets();
            }
        });
    });

    document.getElementById('browseArticlesCard').addEventListener('click', () => {
        showSection('knowledgeBase');
    });

    document.getElementById('submitTicketCard').addEventListener('click', () => {
        showSection('ticket');
    });

    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-article]')) {
            e.preventDefault();
            showArticle(e.target.dataset.article);
        } else if (e.target.matches('[data-list]')) {
            e.preventDefault();
            showArticleList(e.target.dataset.list);
        } else if (e.target.matches('[data-section]')) {
            e.preventDefault();
            showSection(e.target.dataset.section);
        } else if (e.target.matches('[data-ticket]')) {
            e.preventDefault();
            showTicketDetails(e.target.dataset.ticket);
        }
    });

    document.querySelectorAll('.feedback-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            alert(`Feedback recorded: ${e.target.dataset.value}`);
        });
    });

    const ticketForm = document.getElementById('ticketForm');
    ticketForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('requester', document.getElementById('requester').value);
        formData.append('subject', document.getElementById('subject').value);
        formData.append('type', document.getElementById('type').value);
        formData.append('description', document.getElementById('description').value);
        const attachment = document.getElementById('attachment').files[0];
        if (attachment) {
            formData.append('attachment', attachment);
        }

        try {
            const response = await fetch('/submit-ticket', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                ticketForm.reset();
                showSection('home');
            } else {
                alert(result.message || 'Error submitting ticket');
            }
        } catch (error) {
            console.error('Error submitting ticket:', error);
            alert('Server error');
        }
    });

    ticketForm.querySelector('.cancel-btn').addEventListener('click', () => {
        ticketForm.reset();
        showSection('home');
    });

    showSection('home');
});