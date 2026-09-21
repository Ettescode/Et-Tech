<?php
require 'db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$subject = $data['subject'] ?? '';
$message = $data['message'] ?? '';

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO tickets (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $email, $subject, $message]);
    
    $id = $pdo->lastInsertId();
    echo json_encode(['success' => true, 'id' => $id, 'message' => 'Ticket submitted successfully.']);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
