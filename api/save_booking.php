<?php
require 'db.php';

header('Content-Type: application/json');

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

// Extract fields
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$service = $data['service'] ?? '';
$date = $data['date'] ?? '';
$slot = $data['slot'] ?? '';
$notes = $data['notes'] ?? '';
$status = $data['status'] ?? 'Pending';
$amount = isset($data['amount']) ? (float)$data['amount'] : 0.00;

// Basic validation
if (empty($name) || empty($email) || empty($service) || empty($date) || empty($slot)) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO bookings (name, email, service, booking_date, time_slot, notes, status, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $service, $date, $slot, $notes, $status, $amount]);
    
    // Get inserted ID
    $id = $pdo->lastInsertId();
    
    echo json_encode(['success' => true, 'id' => $id, 'message' => 'Booking saved successfully']);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
