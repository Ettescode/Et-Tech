<?php
session_start();
$isLoggedIn = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#2057ee">
    <link rel="apple-touch-icon" href="images/favicon.png">
    <title>Admin Dashboard | Et-Tech SoftApps</title>
    <meta name="robots" content="noindex, nofollow">
    
    <!-- Preloads & Styles -->
    <link rel="preload" href="style.min.css" as="style">
    <link rel="stylesheet" href="style.min.css">
    
    <!-- Font Awesome (Preloaded) -->
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
</head>
<body class="dark-mode admin-body">

<?php if (!$isLoggedIn): ?>
    <!-- Admin Authentication View -->
    <div style="display:flex; justify-content:center; align-items:center; height:100vh; width:100%;">
        <div class="modal-content admin-login-modal" style="display:block; opacity:1; position:relative; z-index:1; margin:0; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
            <h2>Admin Access Restricted</h2>
            <p>Please enter your admin credentials to access the dashboard.</p>
            <div class="form-group" style="margin-bottom: 15px;">
                <input type="text" id="adminUserInput" placeholder="Enter Username (admin)">
            </div>
            <div class="form-group">
                <input type="password" id="adminPassInput" placeholder="Enter Admin Password">
            </div>
            <button id="adminLoginBtn" class="submit-btn">Login</button>
            <p id="adminLoginError" class="error-msg" style="display: none; color: #ff4757; margin-top: 10px;">Incorrect Username or Password.</p>
        </div>
    </div>
<?php else: ?>
    <!-- Dashboard View -->
    <div id="adminContent" style="width: 100%; display: flex; flex: 1;">
        <!-- Admin Sidebar -->
        <aside class="admin-sidebar">
            <div class="sidebar-header">
                <h2>Ettescode <span>Admin</span></h2>
            </div>
            <ul class="sidebar-menu">
                <li class="active"><a href="#"><i class="fas fa-home"></i> Dashboard</a></li>
                <li><a href="#"><i class="fas fa-calendar-check"></i> All Bookings</a></li>
                <li><a href="#"><i class="fas fa-users"></i> Customers</a></li>
                <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
            </ul>
            <div class="sidebar-footer">
                <button id="adminLogoutBtn" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="admin-main">
            <header class="admin-header">
                <div class="header-search">
                    <i class="fas fa-search"></i>
                    <input type="text" id="adminSearchInput" placeholder="Search bookings...">
                </div>
                <div class="header-actions" style="display: flex; align-items: center; gap: 15px;">
                    <button id="exportCsvBtn" class="btn primary" style="padding: 8px 15px; font-size: 0.9rem;">
                        <i class="fas fa-file-csv"></i> Export CSV
                    </button>
                    <button id="themeToggle" class="theme-btn" style="background: none; border: none; color: hsl(var(--text-primary)); font-size: 1.2rem; cursor: pointer;">
                        <i class="fas fa-moon"></i>
                    </button>
                    <span class="admin-name">Admin</span>
                    <div class="profile-avatar">A</div>
                </div>
            </header>

            <section class="admin-content">
                <h1 class="page-title">Overview</h1>
                
                <!-- Metric Cards -->
                <div class="metrics-grid">
                    <div class="metric-card glass-panel">
                        <div class="metric-icon blue"><i class="fas fa-wallet"></i></div>
                        <div class="metric-info">
                            <h3>Total Revenue (₦)</h3>
                            <p id="totalRevenueCount">0</p>
                        </div>
                    </div>
                    <div class="metric-card glass-panel">
                        <div class="metric-icon green"><i class="fas fa-check-circle"></i></div>
                        <div class="metric-info">
                            <h3>Paid</h3>
                            <p id="paidBookingsCount">0</p>
                        </div>
                    </div>
                    <div class="metric-card glass-panel">
                        <div class="metric-icon orange"><i class="fas fa-clock"></i></div>
                        <div class="metric-info">
                            <h3>Pending</h3>
                            <p id="pendingBookingsCount">0</p>
                        </div>
                    </div>
                    <div class="metric-card glass-panel">
                        <div class="metric-icon red"><i class="fas fa-times-circle"></i></div>
                        <div class="metric-info">
                            <h3>Canceled</h3>
                            <p id="canceledBookingsCount">0</p>
                        </div>
                    </div>
                </div>

                <!-- Chart Section (Day 23) -->
                <div class="chart-container glass-panel" style="margin-bottom: 30px; padding: 20px;">
                    <h2 style="margin-bottom: 15px; font-size: 1.2rem; color: var(--text-primary);">Revenue & Bookings Overview</h2>
                    <div style="position: relative; height: 300px; width: 100%;">
                        <canvas id="adminChart"></canvas>
                    </div>
                </div>

                <!-- Recent Bookings Table -->
                <div class="table-container glass-panel">
                    <div class="table-header">
                        <h2>Recent Bookings</h2>
                        <div class="table-actions" style="display: flex; gap: 10px; align-items: center;">
                            <select id="adminStatusFilter" style="padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-primary); outline: none;">
                                <option value="All">All Statuses</option>
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                                <option value="Canceled">Canceled</option>
                            </select>
                            <button class="export-btn"><i class="fas fa-download"></i> Export CSV</button>
                        </div>
                    </div>
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="adminBookingsTableBody">
                            <!-- Booking rows will be injected here via JS -->
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 20px;">Loading bookings...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Support Tickets Table (Week 7) -->
                <div class="table-container glass-panel" style="margin-top: 30px;">
                    <div class="table-header">
                        <h2>Support Tickets</h2>
                        <button class="refresh-btn" onclick="loadTickets()"><i class="fas fa-sync"></i> Refresh</button>
                    </div>
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Client Email</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="adminTicketsTableBody">
                            <tr>
                                <td colspan="5" style="text-align: center; padding: 20px;">Loading tickets...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>

    <!-- Ticket Reply Modal -->
    <div id="ticketReplyModal" class="modal" role="dialog" aria-modal="true" aria-label="Reply to Ticket" style="display: none;">
        <div class="modal-content" style="max-width: 500px;">
            <span class="close-btn" onclick="document.getElementById('ticketReplyModal').style.display='none'">&times;</span>
            <h2>Reply to Ticket #<span id="replyTicketIdText"></span></h2>
            <form id="ticketReplyForm">
                <input type="hidden" id="replyTicketId">
                <div class="form-group" style="margin-bottom: 15px;">
                    <label>Client Message:</label>
                    <p id="replyClientMessage" style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 4px; font-size: 0.9rem;"></p>
                </div>
                <div class="form-group" style="margin-bottom: 15px;">
                    <label>Admin Reply</label>
                    <textarea id="adminReplyText" rows="4" required style="width: 100%; padding: 10px; border-radius: 6px;"></textarea>
                </div>
                <div class="form-group" style="margin-bottom: 15px;">
                    <label>Change Status</label>
                    <select id="ticketStatusSelect" style="width: 100%; padding: 10px; border-radius: 6px;">
                        <option value="Open">Open</option>
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
                <button type="submit" class="btn primary" style="width: 100%;">Send Reply</button>
            </form>
        </div>
    </div>
<?php endif; ?>

    <!-- TOAST NOTIFICATION CONTAINER -->
    <div id="toastContainer" class="toast-container"></div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
    <script src="js/theme.js?v=2" defer></script>
    <script src="js/services.js?v=2" defer></script>
    <script src="js/admin.js?v=2" defer></script>
    
    <!-- Pass session state to JS -->
    <script>
        window.IS_ADMIN_LOGGED_IN = <?php echo $isLoggedIn ? 'true' : 'false'; ?>;
        
        document.addEventListener('DOMContentLoaded', () => {
            if (window.IS_ADMIN_LOGGED_IN && typeof renderAdminDashboard === "function") {
                renderAdminDashboard();
                if (typeof loadTickets === "function") {
                    loadTickets();
                }
            }
        });
    </script>
</body>
</html>
