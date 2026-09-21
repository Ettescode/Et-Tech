<?php
// Simple Minifier Script for Week 10
// Strips comments and unnecessary whitespace from CSS

$css_file = 'style.css';
$minified_css_file = 'style.min.css';

if (file_exists($css_file)) {
    $css_content = file_get_contents($css_file);
    
    // Remove comments
    $css_content = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css_content);
    
    // Remove space after colons
    $css_content = str_replace(': ', ':', $css_content);
    
    // Remove whitespace
    $css_content = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $css_content);
    
    // Remove space before and after brackets and commas
    $css_content = str_replace(array('{ ', ' {'), '{', $css_content);
    $css_content = str_replace(array('} ', ' }'), '}', $css_content);
    $css_content = str_replace(array('; ', ' ;'), ';', $css_content);
    $css_content = str_replace(array(', ', ' ,'), ',', $css_content);
    
    file_put_contents($minified_css_file, $css_content);
    echo "CSS minified successfully: $minified_css_file<br>";
} else {
    echo "Error: $css_file not found.<br>";
}

?>
