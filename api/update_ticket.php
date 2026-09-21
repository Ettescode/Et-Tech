<?php
require 'db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['error' => 'Missing ticket ID']);
    exit;
}

$id = $data['id'];
$status = $data['status'] ?? null;
$admin_reply = $data['admin_reply'] ?? null;

if (!$status && !$admin_reply) {
    echo json_encode(['error' => 'No fields to update']);
    exit;
}

try {
    if ($status && $admin_reply) {
        $stmt = $pdo->prepare("UPDATE tickets SET status = ?, admin_reply = ? WHERE id = ?");
        $stmt->execute([$status, $admin_reply, $id]);
    } else if ($status) {
        $stmt = $pdo->prepare("UPDATE tickets SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
    } else if ($admin_reply) {
        $stmt = $pdo->prepare("UPDATE tickets SET admin_reply = ? WHERE id = ?");
        $stmt->execute([$admin_reply, $id]);
    }
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Ticket updated']);
    } else {
        echo json_encode(['error' => 'Ticket not found or unchanged']);
    }
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
