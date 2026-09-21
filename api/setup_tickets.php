<?php
require 'db.php';

header('Content-Type: application/json');

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        admin_reply TEXT,
        status ENUM('Open', 'Pending', 'Resolved') DEFAULT 'Open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ";
    
    $pdo->exec($sql);
    echo json_encode(['success' => true, 'message' => 'Tickets table created successfully.']);
} catch (\PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
