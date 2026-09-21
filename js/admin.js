// admin.js - Admin Dashboard Logic (Day 17-19)

const ADMIN_USER = "admin";
const ADMIN_PASS = "vitech123";

// Helper function needed by services.js (normally in main.js)
window.getEl = function(id) {
    return document.getElementById(id);
};

document.addEventListener("DOMContentLoaded", () => {
    // Event Listeners for Login
    const loginBtn = document.getElementById("adminLoginBtn");
    const userInput = document.getElementById("adminUserInput");
    const passInput = document.getElementById("adminPassInput");
    const logoutBtn = document.getElementById("adminLogoutBtn");
    const exportCsvBtn = document.getElementById("exportCsvBtn");

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener("click", exportToCSV);
    }

    if (loginBtn && passInput && userInput) {
        loginBtn.addEventListener("click", () => handleLogin(userInput.value, passInput.value));
        passInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleLogin(userInput.value, passInput.value);
        });
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleLogin(userInput.value, passInput.value);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }
    
    // Day 22: Search and Filter Listeners
    const searchInput = document.getElementById("adminSearchInput");
    const statusFilter = document.getElementById("adminStatusFilter");
    
    if (searchInput) searchInput.addEventListener("input", renderAdminDashboard);
    if (statusFilter) statusFilter.addEventListener("change", renderAdminDashboard);
});

// ==========================================
// PHP AUTHENTICATION INTEGRATION
// ==========================================

async function handleLogin(username, password) {
    const errorMsg = document.getElementById("adminLoginError");
    const loginBtn = document.getElementById("adminLoginBtn");
    
    if (!username || !password) {
        errorMsg.textContent = "Please enter both Username and Password.";
        errorMsg.style.display = "block";
        return;
    }
    
    loginBtn.textContent = "Verifying...";
    loginBtn.disabled = true;

    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // PHP Session is set, reload the page to render the dashboard!
            window.location.reload();
        } else {
            errorMsg.textContent = result.error || "Incorrect Username or Password.";
            errorMsg.style.display = "block";
            loginBtn.textContent = "Login";
            loginBtn.disabled = false;
        }
    } catch (e) {
        console.error("Login Error:", e);
        errorMsg.textContent = "Server error. Please try again later.";
        errorMsg.style.display = "block";
        loginBtn.textContent = "Login";
        loginBtn.disabled = false;
    }
}

async function handleLogout() {
    try {
        await fetch('api/logout.php');
        window.location.href = 'admin.php'; // Redirect to clear PHP session view
    } catch (e) {
        console.error("Logout Error:", e);
    }
}

// ==========================================
// DAY 18 & 19: ADMIN BOOKINGS RENDERING & ACTIONS
// ==========================================

async function renderAdminDashboard() {
    // We reuse `getAutomatedBookings()` from services.js
    if (typeof getAutomatedBookings !== "function") {
        console.error("services.js not loaded.");
        return;
    }
    
    const bookings = await getAutomatedBookings();
    
    // Calculate metrics
    const totalRevenue = bookings.filter(b => b.status === "Paid" || b.status === "Completed").reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    const paid = bookings.filter(b => b.status === "Paid").length;
    const pending = bookings.filter(b => b.status === "Pending").length;
    const canceled = bookings.filter(b => b.status === "Canceled").length;

    // Format currency
    const formattedRevenue = new Intl.NumberFormat('en-NG').format(totalRevenue);

    document.getElementById("totalRevenueCount").textContent = formattedRevenue;
    document.getElementById("paidBookingsCount").textContent = paid;
    document.getElementById("pendingBookingsCount").textContent = pending;
    document.getElementById("canceledBookingsCount").textContent = canceled;

    // Render table rows
    const tbody = document.getElementById("adminBookingsTableBody");
    
    if (bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">No bookings found.</td></tr>`;
        if (typeof renderChart === "function") renderChart([]);
        return;
    }

    // Sort by newest
    const sorted = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Day 22: Apply Filters
    const searchQuery = document.getElementById("adminSearchInput") ? document.getElementById("adminSearchInput").value.toLowerCase() : "";
    const filterStatus = document.getElementById("adminStatusFilter") ? document.getElementById("adminStatusFilter").value : "All";

    const filtered = sorted.filter(b => {
        // Search by ID, Name, or Email
        const matchesSearch = b.id.toLowerCase().includes(searchQuery) || 
                              b.name.toLowerCase().includes(searchQuery) || 
                              b.email.toLowerCase().includes(searchQuery);
        
        // Filter by Status
        const matchesStatus = filterStatus === "All" || b.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">No matching bookings found.</td></tr>`;
        if (typeof renderChart === "function") renderChart([]);
        return;
    }

    const html = filtered.map(b => {
        const statusClass = b.status.toLowerCase();
        
        let actionBtns = '';
        if (b.status === "Pending" || b.status === "Paid") {
            actionBtns += `<button class="btn-icon approve" title="Mark as Completed" onclick="markBookingCompleted('${b.id}')"><i class="fas fa-check"></i></button>`;
        }
        actionBtns += `<button class="btn-icon delete" title="Delete Booking" onclick="deleteBooking('${b.id}')"><i class="fas fa-trash"></i></button>`;

        return `
            <tr>
                <td><strong>${b.id}</strong></td>
                <td>
                    <div>${b.name}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${b.email}</div>
                </td>
                <td>${b.service}</td>
                <td>${b.date}<br><small>${b.slot}</small></td>
                <td><span class="status-badge ${statusClass}">${b.status}</span></td>
                <td>
                    <div class="action-btns">
                        ${actionBtns}
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    tbody.innerHTML = html;
    
    // Day 23: Render Chart
    if (typeof renderChart === "function") {
        renderChart(filtered);
    }
}

// Action: Mark Completed
window.markBookingCompleted = async function(id) {
    if (!confirm("Are you sure you want to mark this booking as Completed?")) return;
    
    try {
        const response = await fetch('api/update_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, status: 'Completed' })
        });
        const result = await response.json();
        
        if (result.success) {
            showToast(`Booking ${id} marked as completed.`, "success");
            await renderAdminDashboard();
        } else {
            showToast(result.error || 'Failed to update.', "error");
        }
    } catch (error) {
        console.error("Error:", error);
        showToast('Error connecting to server.', "error");
    }
};

// Action: Delete Booking
window.deleteBooking = async function(id) {
    if (!confirm("Are you sure you want to permanently delete this booking? This cannot be undone.")) return;
    
    try {
        const response = await fetch('api/delete_booking.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        const result = await response.json();
        
        if (result.success) {
            showToast(`Booking ${id} deleted.`, "success");
            await renderAdminDashboard();
        } else {
            showToast(result.error || 'Failed to delete.', "error");
        }
    } catch (error) {
        console.error("Error:", error);
        showToast('Error connecting to server.', "error");
    }
};

// ==========================================
// DAY 23: ADMIN CHART & STATISTICS
// ==========================================

let adminChartInstance = null;

function renderChart(bookings) {
    const canvas = document.getElementById("adminChart");
    if (!canvas) return;

    // We will chart Bookings grouped by Status (Paid, Pending, Canceled, Completed)
    const statusCounts = {
        Paid: 0,
        Pending: 0,
        Canceled: 0,
        Completed: 0
    };

    bookings.forEach(b => {
        if (statusCounts[b.status] !== undefined) {
            statusCounts[b.status]++;
        }
    });

    // Destroy existing chart to prevent canvas overlap/flicker
    if (adminChartInstance) {
        adminChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    adminChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Paid', 'Pending', 'Canceled', 'Completed'],
            datasets: [{
                label: 'Bookings by Status',
                data: [
                    statusCounts.Paid, 
                    statusCounts.Pending, 
                    statusCounts.Canceled, 
                    statusCounts.Completed
                ],
                backgroundColor: [
                    '#2057ee', // Paid (Brand Blue)
                    '#f39c12', // Pending (Orange)
                    '#ff4757', // Canceled (Red)
                    '#2ed573'  // Completed (Green)
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#a0a0a0' }
                }
            }
        }
    });
}

// ==========================================
// CSV EXPORT FUNCTIONALITY (WEEK 6)
// ==========================================
async function exportToCSV() {
    const bookings = await getAutomatedBookings();
    if (!bookings || bookings.length === 0) {
        alert("No data available to export.");
        return;
    }

    // Define CSV headers
    const headers = ["ID", "Name", "Email", "Service", "Date", "Slot", "Amount (NGN)", "Status", "Notes", "Created At"];
    
    // Map data to rows
    const rows = bookings.map(b => [
        b.id,
        `"${b.name.replace(/"/g, '""')}"`,
        `"${b.email.replace(/"/g, '""')}"`,
        `"${b.service.replace(/"/g, '""')}"`,
        b.date,
        b.slot,
        b.amount,
        b.status,
        `"${b.notes ? b.notes.replace(/"/g, '""') : ""}"`,
        b.createdAt
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
    ].join("\n");

    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ettech_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==========================================
// WEEK 7: ADMIN TICKETING SYSTEM
// ==========================================
let allTickets = [];

window.loadTickets = async function() {
    const tbody = document.getElementById('adminTicketsTableBody');
    if (!tbody) return;

    try {
        const response = await fetch('api/get_tickets.php');
        allTickets = await response.json();

        if (allTickets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No tickets found.</td></tr>';
            return;
        }

        const html = allTickets.map(t => {
            const statusClass = t.status === 'Open' ? 'pending' : t.status === 'Resolved' ? 'paid' : 'canceled';
            return `
                <tr>
                    <td>#${t.id}</td>
                    <td>${t.email}</td>
                    <td>${t.subject}</td>
                    <td><span class="status-badge ${statusClass}">${t.status}</span></td>
                    <td>
                        <button class="action-btn reply" onclick="openTicketReply('${t.id}')">Reply/Update</button>
                    </td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = html;
    } catch (error) {
        console.error("Error loading tickets:", error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Failed to load tickets.</td></tr>';
    }
};

window.openTicketReply = function(id) {
    const ticket = allTickets.find(t => String(t.id) === String(id));
    if (!ticket) return;

    document.getElementById('replyTicketIdText').textContent = ticket.id;
    document.getElementById('replyTicketId').value = ticket.id;
    document.getElementById('replyClientMessage').textContent = ticket.message;
    document.getElementById('adminReplyText').value = ticket.admin_reply || '';
    document.getElementById('ticketStatusSelect').value = ticket.status;

    document.getElementById('ticketReplyModal').style.display = 'flex';
};

// Bind modal form submit
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ticketReplyForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const id = document.getElementById('replyTicketId').value;
            const adminReply = document.getElementById('adminReplyText').value.trim();
            const status = document.getElementById('ticketStatusSelect').value;
            
            try {
                const response = await fetch('api/update_ticket.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, admin_reply: adminReply, status })
                });
                const result = await response.json();
                
                if (result.success) {
                    showToast('Ticket updated successfully', 'success');
                    document.getElementById('ticketReplyModal').style.display = 'none';
                    loadTickets();
                } else {
                    showToast(result.error || 'Failed to update ticket', 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('Server error', 'error');
            }
        });
    }
});

