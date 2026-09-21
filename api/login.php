<?php
session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'error' => 'Missing credentials']);
    exit;
}

// Hardcoded for now. In a real app, this would query a database.
if (strtolower($data['username']) === 'admin' && $data['password'] === 'vitech123') {
    $_SESSION['admin_logged_in'] = true;
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
}
?>
