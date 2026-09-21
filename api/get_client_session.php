<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['client_logged_in']) && $_SESSION['client_logged_in'] === true) {
    echo json_encode([
        'logged_in' => true,
        'email' => $_SESSION['client_email'],
        'name' => $_SESSION['client_name']
    ]);
} else {
    echo json_encode([
        'logged_in' => false
    ]);
}
?>
