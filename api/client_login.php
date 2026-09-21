<?php
require 'db.php';
session_start();

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM clients WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['client_logged_in'] = true;
        $_SESSION['client_email'] = $user['email'];
        $_SESSION['client_name'] = $user['full_name'];
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        echo json_encode(['error' => 'Invalid email or password']);
    }
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
