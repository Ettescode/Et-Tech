<?php
require 'db.php';
session_start();

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

$full_name = trim($data['full_name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($full_name) || empty($email) || empty($password)) {
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

try {
    // Check if email exists
    $check = $pdo->prepare("SELECT id FROM clients WHERE email = ?");
    $check->execute([$email]);
    if ($check->rowCount() > 0) {
        echo json_encode(['error' => 'Email already registered']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO clients (full_name, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([$full_name, $email, $hash]);
    
    // Auto login
    $_SESSION['client_logged_in'] = true;
    $_SESSION['client_email'] = $email;
    $_SESSION['client_name'] = $full_name;
    
    echo json_encode(['success' => true, 'message' => 'Registration successful']);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
