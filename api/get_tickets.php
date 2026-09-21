<?php
require 'db.php';

header('Content-Type: application/json');

$email = isset($_GET['email']) ? $_GET['email'] : null;

try {
    if ($email) {
        $stmt = $pdo->prepare("SELECT * FROM tickets WHERE email = ? ORDER BY created_at DESC");
        $stmt->execute([$email]);
    } else {
        $stmt = $pdo->query("SELECT * FROM tickets ORDER BY created_at DESC");
    }
    
    $tickets = $stmt->fetchAll();
    
    // Sanitize output
    $formattedTickets = array_map(function($t) {
        return [
            'id' => $t['id'],
            'email' => htmlspecialchars($t['email'] ?? '', ENT_QUOTES, 'UTF-8'),
            'subject' => htmlspecialchars($t['subject'] ?? '', ENT_QUOTES, 'UTF-8'),
            'message' => htmlspecialchars($t['message'] ?? '', ENT_QUOTES, 'UTF-8'),
            'status' => htmlspecialchars($t['status'] ?? '', ENT_QUOTES, 'UTF-8'),
            'reply' => htmlspecialchars($t['reply'] ?? '', ENT_QUOTES, 'UTF-8'),
            'created_at' => $t['created_at'],
            'updated_at' => $t['updated_at']
        ];
    }, $tickets);

    echo json_encode($formattedTickets);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
