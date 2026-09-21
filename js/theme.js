// ==========================================
// THEME MANAGEMENT (LIGHT/DARK MODE)
// ==========================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    // Default to dark mode if no preference is saved
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
    } else {
        document.body.classList.add('dark-mode');
    }
    
    updateThemeIcon();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.className = 'fas fa-sun'; // Show sun when in dark mode (click to go light)
        } else {
            themeIcon.className = 'fas fa-moon'; // Show moon when in light mode (click to go dark)
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
});
