<?php
session_start();
// Destroy only client session variables, not admin ones if they exist in the same session, 
// though usually they shouldn't conflict. To be safe, just unset client keys.
unset($_SESSION['client_logged_in']);
unset($_SESSION['client_email']);
unset($_SESSION['client_name']);

header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>
