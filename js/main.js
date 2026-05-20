// ===Waiting for DOM to Load=====
// ==============================
// THEME TOGGLE
// ==============================
function initThemeToggle() {

    const themeBtn = getEl("themeToggle");

    if (!themeBtn) return;

    // LOAD SAVED THEME (Default to Dark Mode)
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.remove("dark-mode");
        themeBtn.textContent = "🌙";
    } else {
        document.body.classList.add("dark-mode");
        themeBtn.textContent = "☀️";
    }

    // TOGGLE THEME
    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        if (isDark) {

            localStorage.setItem("theme", "dark");

            themeBtn.textContent = "☀️";

        } else {

            localStorage.setItem("theme", "light");

            themeBtn.textContent = "🌙";
        }
    });
}
// ==============================
// APP INITIALIZATION
// ==============================
document.addEventListener("DOMContentLoaded", function() {

    // UI - SERVICES
    initNavigation();
    initSmoothScroll();
    initHeroButton();
    initHeroSlider();
    initScrollReveal();
    initFormValidation();

    renderServices();
    initTestimonialSlider();

   
    // MODAL
    initModalClose();
    initThemeToggle();
});
// ==============================
// HELPER FUNCTION (SELECT ELEMENT)
// ==============================
function getEl(id) {
    return document.getElementById(id);
}