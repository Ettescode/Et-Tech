<?php
session_start();
if (!isset($_SESSION['client_logged_in']) || $_SESSION['client_logged_in'] !== true) {
    header('Location: index.html?auth=login');
    exit;
}
$client_name = $_SESSION['client_name'];
$client_email = $_SESSION['client_email'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#2057ee">
    <link rel="apple-touch-icon" href="images/favicon.png">
    <title>Client Portal - Et-Tech SoftApps</title>
    <meta name="robots" content="noindex, nofollow">
    
    <!-- Preloads & Styles -->
    <link rel="preload" href="style.min.css" as="style">
    <link rel="stylesheet" href="style.min.css">
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" as="style">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" defer></script>
    <style>
        .portal-layout {
            display: flex;
            min-height: 100vh;
            background: var(--bg-main);
        }
        .portal-sidebar {
            width: 250px;
            background: var(--bg-card);
            border-right: 1px solid var(--border-color);
            padding: 20px;
        }
        .portal-sidebar h2 { margin-bottom: 30px; font-size: 1.5rem; color: var(--brand-blue); }
        .portal-nav { list-style: none; padding: 0; }
        .portal-nav li { margin-bottom: 15px; }
        .portal-nav a { 
            color: var(--text-primary); 
            text-decoration: none; 
            font-size: 1rem; 
            display: flex; 
            align-items: center; 
            gap: 10px;
            padding: 10px;
            border-radius: 6px;
            transition: background 0.3s;
        }
        .portal-nav a:hover, .portal-nav a.active { background: rgba(32, 87, 238, 0.1); color: var(--brand-blue); }
        .portal-main { flex: 1; padding: 40px; }
        .portal-header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    </style>
</head>
<body class="dark-mode">
    <div class="portal-layout">
        <aside class="portal-sidebar">
            <h2>EttesCode</h2>
            <ul class="portal-nav">
                <li><a href="#" class="active"><i class="fas fa-calendar-alt"></i> My Bookings</a></li>
                <li><a href="#support"><i class="fas fa-ticket-alt"></i> Support Tickets</a></li>
                <li><a href="index.html"><i class="fas fa-home"></i> Back to Home</a></li>
                <li><a href="#" id="clientLogoutBtn" style="color: var(--status-canceled);"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </aside>

        <main class="portal-main">
            <div class="portal-header-top">
                <h1>Welcome back, <?php echo htmlspecialchars($client_name); ?>!</h1>
                <div class="theme-switch" id="theme-toggle">
                    <i class="fas fa-sun" id="sun-icon" style="display:none;"></i>
                    <i class="fas fa-moon" id="moon-icon"></i>
                </div>
            </div>

            <!-- Dashboard Content -->
            <div class="client-portal" style="padding: 0; text-align: left; background: transparent;">
                
                <!-- Bookings -->
                <div class="portal-container glass-panel" style="margin-bottom: 30px; padding: 20px; border-radius: 12px; margin: 0;">
                    <div class="portal-header">
                        <h3>My Bookings</h3>
                        <button class="refresh-btn" onclick="renderClientBookings()">Refresh <i class="fas fa-sync"></i></button>
                    </div>
                    <!-- Hidden email input so services.js can read it for fetch requests -->
                    <input type="hidden" id="bookingEmail" value="<?php echo htmlspecialchars($client_email); ?>">
                    
                    <div id="bookingsList" class="bookings-list">
                        <div class="empty-state">
                            <p>Loading your bookings...</p>
                        </div>
                    </div>
                </div>

                <!-- Support Tickets -->
                <div id="support" class="support-section glass-panel" style="margin-top: 30px; padding: 20px; border-radius: 12px;">
                    <div class="portal-header">
                        <h3>Support Tickets</h3>
                    </div>
                    
                    <div class="form-grid" style="margin-bottom: 20px;">
                        <form id="supportForm" style="width: 100%;">
                            <!-- Pre-filled and readonly -->
                            <input type="hidden" id="supportEmail" value="<?php echo htmlspecialchars($client_email); ?>">
                            
                            <div class="form-group" style="margin-bottom: 10px;">
                                <input type="text" id="supportSubject" placeholder="Issue Subject" required style="width: 100%; padding: 10px;">
                            </div>
                            <div class="form-group" style="margin-bottom: 10px;">
                                <textarea id="supportMessage" rows="3" placeholder="Describe your issue..." required style="width: 100%; padding: 10px;"></textarea>
                            </div>
                            <button type="submit" class="btn primary" style="width: 100%;">Submit Ticket</button>
                        </form>
                    </div>

                    <div class="portal-header">
                        <h4>My Past Tickets</h4>
                        <!-- Hidden email for fetching -->
                        <input type="hidden" id="fetchSupportEmail" value="<?php echo htmlspecialchars($client_email); ?>">
                        <button class="refresh-btn" onclick="renderClientTickets()">View Tickets</button>
                    </div>
                    <div id="ticketsList" class="bookings-list">
                        <div class="empty-state">
                            <p>Click 'View Tickets' to load.</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>

    <!-- Hidden Invoice Template -->
    <div id="invoiceTemplate" style="display: none;">
        <div style="padding: 40px; background: white; color: black; font-family: sans-serif; width: 600px;">
            <h1 style="color: #2057ee;">EttesCode</h1>
            <p><strong>Invoice Number:</strong> <span id="invNumber"></span></p>
            <p><strong>Date:</strong> <span id="invDate"></span></p>
            <hr>
            <p><strong>Billed To:</strong></p>
            <p><span id="invName"></span></p>
            <p><span id="invEmail"></span></p>
            <hr>
            <h3>Service Details</h3>
            <p><strong>Service:</strong> <span id="invService"></span></p>
            <p><strong>Total Amount:</strong> <span id="invAmount"></span></p>
            <hr>
            <p style="text-align: center; margin-top: 50px; font-size: 12px; color: #666;">Thank you for your business!</p>
        </div>
    </div>

    <!-- Toast Notification Container -->
    <div id="toast-container" class="toast-container"></div>

    <!-- Scripts -->
    <script src="js/theme.js?v=2" defer></script>
    <script src="js/services.js?v=2" defer></script>
    <script>
        // Auto-load client data on portal open
        document.addEventListener('DOMContentLoaded', () => {
            renderClientBookings();
            renderClientTickets();

            const logoutBtn = document.getElementById('clientLogoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await fetch('api/client_logout.php');
                    window.location.href = 'index.html';
                });
            }
        });
    </script>
</body>
</html>
