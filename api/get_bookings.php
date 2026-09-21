<?php
require 'db.php';

header('Content-Type: application/json');

try {
    $email = isset($_GET['email']) ? $_GET['email'] : null;
    
    if ($email) {
        $stmt = $pdo->prepare("SELECT * FROM bookings WHERE email = ? ORDER BY created_at DESC");
        $stmt->execute([$email]);
    } else {
        $stmt = $pdo->query("SELECT * FROM bookings ORDER BY created_at DESC");
    }
    
    $bookings = $stmt->fetchAll();
    
    // Format output to match existing frontend expected structure
    $formattedBookings = array_map(function($b) {
        return [
            'id' => $b['id'],
            'name' => htmlspecialchars($b['name'] ?? '', ENT_QUOTES, 'UTF-8'),
            'email' => htmlspecialchars($b['email'] ?? '', ENT_QUOTES, 'UTF-8'),
            'service' => htmlspecialchars($b['service'] ?? '', ENT_QUOTES, 'UTF-8'),
            'date' => htmlspecialchars($b['booking_date'] ?? '', ENT_QUOTES, 'UTF-8'),
            'slot' => htmlspecialchars($b['time_slot'] ?? '', ENT_QUOTES, 'UTF-8'),
            'notes' => htmlspecialchars($b['notes'] ?? '', ENT_QUOTES, 'UTF-8'),
            'status' => htmlspecialchars($b['status'] ?? '', ENT_QUOTES, 'UTF-8'),
            'amount' => (float)$b['amount'],
            'createdAt' => $b['created_at']
        ];
    }, $bookings);
    
    echo json_encode($formattedBookings);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
