<?php
require 'db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode(['error' => 'Missing ID or Status']);
    exit;
}

$id = $data['id'];
$status = $data['status'];

$validStatuses = ['Pending', 'Paid', 'Canceled', 'Completed'];
if (!in_array($status, $validStatuses)) {
    echo json_encode(['error' => 'Invalid status']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Status updated']);
    } else {
        echo json_encode(['error' => 'Booking not found or status unchanged']);
    }
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
