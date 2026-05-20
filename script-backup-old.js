// ===Waiting for DOM to Load=====

// ==============================
// APP INITIALIZATION
// ==============================
document.addEventListener("DOMContentLoaded", function() {

    initNavigation();
    initSmoothScroll();
    initHeroButton();
    initScrollReveal();
    initFormValidation();
    fetchPosts();
    initReloadButton();
    initLoadMore();
    renderServices();
    initModalClose();

});
// ==============================
// HELPER FUNCTION (SELECT ELEMENT)
// ==============================
function getEl(id) {
    return document.getElementById(id);
}
// ==================================
// DATA LAYER - SERVICES DATA SECTION
// ==================================
const services = [
    {
        title: "Web Development",
        description: "Modern and responsive web applications.",
        icon: "💻",
        image: "https://picsum.photos/400/200?random=1",
        details: "We build scalable, fast, and secure web applications using modern technologies."
    },
    {
        title: "Mobile Applications",
        description: "Android and iOS cross-platform apps.",
        icon: "📱",
        image: "https://picsum.photos/400/200?random=2",
        details: "We develop mobile apps that run smoothly across devices with excellent user experience."
    },
    {
        title: "Enterprise Software",
        description: "Custom solutions for businesses.",
        icon: "🏢",
        image: "https://picsum.photos/400/200?random=3",
        details: "We provide enterprise-grade software tailored to business needs and scalability."
    }
];

// =========================================
//  COMPONENT: SERVICE CARD
// =========================================
function createServiceCard(service) {

    return `
        <div class="card" onclick="handleServiceClick(${services.indexOf(service)})">
            <div class="icon">${service.icon}</div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </div>
    `;
}
// ==============================
// HANDLE SERVICE CLICK (GLOBAL)
// ==============================
function handleServiceClick(index) {
    const service = services[index];
    openModal(service);
}
// ======================================
// UI COMPONENT - RENDER SERVICES TO PAGE
// ======================================
function renderServices() {

    const container = getEl("servicesContainer");

    let html = "";

    services.forEach(service => {
        html += createServiceCard(service);
    });

    container.innerHTML = html;
}
// ==============================================
// UI COMPONENT - OPEN MODAL WITH SERVICE DETAILS
// ==============================================
function openModal(service) {

    const modal = getEl("serviceModal");
    const title = getEl("modalTitle");
    const description = getEl("modalDescription");
    const image = getEl("modalImage");
    const details = getEl("modalDetails");

    title.textContent = service.title;
    description.textContent = service.description;
    image.src = service.image;
    image.alt = service.title;
    details.textContent = service.details;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
}
// ===================================
// UI COMPONENT - CLOSE MODAL FUNCTION
// ===================================
function initModalClose() {

    const modal = getEl("serviceModal");
    const closeBtn = getEl("closeModal");

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
        }
    });
}
// =====================================
// UI COMPONENT - NAVIGATION (HAMBURGER)
// =====================================
function initNavigation() {

    const burger = document.querySelector(".burger");
    const navLinks = document.querySelector(".nav-links");

    if (burger && navLinks) {
        burger.addEventListener("click", function() {
            navLinks.classList.toggle("nav-active");
        });
    }
}

const sections = document.querySelectorAll('section');
const navLinksAll = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==============================
// UI COMPONENT - SMOOTH SCROLL
// ==============================
function initSmoothScroll() {

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

}

function handleNavbarBackground() {

    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.style.backgroundColor = '#111';
    } else {
        navbar.style.backgroundColor = '#0d6efd';
    }
}

window.addEventListener('scroll', handleNavbarBackground);
window.addEventListener('load', handleNavbarBackground);

// ==============================
// UI COMPONENT - SCROLL REVEAL
// ==============================
function initScrollReveal() {

const reveals = document.querySelectorAll('.reveal');
    
function revealOnScroll() {
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;

        if (revealTop < windowHeight - 100) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Run once on load
revealOnScroll();
}

// ======================================
// UI COMPONENT - HERO BUTTON INTERACTION
// ======================================
function initHeroButton() {

    const heroBtn = document.querySelector(".hero-btn");

    if (heroBtn) {
        heroBtn.addEventListener("click", function() {
            alert("Welcome to E-Tech SoftApps Limited!");
        });
    }

}
// ==============================
// UI COMPONENT - FORM VALIDATION
// ==============================
function initFormValidation() {

    const form = document.getElementById("contactForm");
    if (!form) return;

    const fullName = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    const successMsg = document.getElementById("formSuccess");
    const submitBtn = form.querySelector(".submit-btn");

    // ========================
    // CHECK FORM VALIDITY
    // ========================
    function checkFormValidity() {
        if (
            fullName.value.trim() !== "" &&
            validateEmail(email.value) &&
            message.value.trim() !== ""
        ) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    // ========================
    // REAL-TIME VALIDATION
    // ========================
    fullName.addEventListener("input", () => {
        if (fullName.value.trim() !== "") {
            fullName.classList.remove("error");
            fullName.classList.add("success");
            nameError.textContent = "";
        }
        checkFormValidity();
    });

    email.addEventListener("input", () => {
        if (validateEmail(email.value)) {
            email.classList.remove("error");
            email.classList.add("success");
            emailError.textContent = "";
        }
        checkFormValidity();
    });

    message.addEventListener("input", () => {
        if (message.value.trim() !== "") {
            message.classList.remove("error");
            message.classList.add("success");
            messageError.textContent = "";
        }
        checkFormValidity();
    });

    // ========================
    // FORM SUBMIT
    // ========================
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        let isValid = true;

        nameError.textContent = "";
        emailError.textContent = "";
        messageError.textContent = "";
        successMsg.textContent = "";

        if (fullName.value.trim() === "") {
            nameError.textContent = "Full name is required";
            fullName.classList.add("error");
            isValid = false;
        }

        if (!validateEmail(email.value)) {
            emailError.textContent = "Enter a valid email";
            email.classList.add("error");
            isValid = false;
        }

        if (message.value.trim() === "") {
            messageError.textContent = "Message cannot be empty";
            message.classList.add("error");
            isValid = false;
        }

        if (isValid) {

            submitBtn.textContent = "Sending...";
            submitBtn.classList.add("loading");
            submitBtn.disabled = true;

            setTimeout(() => {

                successMsg.textContent = "";
                
                successMsg.textContent = "Message sent successfully!";
                form.reset();
                
                submitBtn.textContent = "Send Message";
                submitBtn.disabled = true;
                submitBtn.classList.remove("loading");

                fullName.classList.remove("success");
                email.classList.remove("success");
                message.classList.remove("success");
                
            }, 2000);
        }

    });

}

// ======================================
// UI COMPONENT - EMAIL VALIDATION HELPER
// ======================================
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
// ===============================
//  API LAYER - POSTS MODULE
// ===============================
let postLimit = 5; // Global counter for posts to fetch
   // ==============================
// COMPONENT: POST CARD
// ==============================
function createPostCard(post) {
    return `
        <div class="post">
            <h4>${post.email}</h4>
            <p>${post.body}</p>
        </div>
    `;
}
// ==== API LAYER - API FETCH FUNCTION ==== //
function fetchPosts() {

    const container = getEl("postsContainer");
// ===== Clear Old Posts/Contents First ===== //
    container.innerHTML = "<p id='loadingMsg'>Loading posts...</p>";

    const loadingMsg = getEl("loadingMsg");

    fetch(`https://jsonplaceholder.typicode.com/comments?_limit=${postLimit}`)
        .then(response => response.json())
        .then(data => {

            // ==== Remove loading text ====
        loadingMsg.remove();

        if (data.length === 0) {
            container.innerHTML = "<p>No posts available</p>";
            return;
        }
            let html = "";

        data.forEach(post => {
            html += createPostCard(post);
        });

        container.innerHTML += html;

    })
    .catch(error => {

            // ===== Show user-friendly error ==== //
        container.innerHTML = "<p style='color:red;'>Failed to load posts. Please try again.</p>";
        console.error(error);
    });
}

// ====================================== 
// API LAYER - API RELOAD BUTTON FUNCTION
// ======================================
function initReloadButton() {

    const reloadBtn = getEl("reloadBtn");

    if (!reloadBtn) return;

    reloadBtn.addEventListener("click", () => {
        fetchPosts();
    });
}
// ================================= 
// API LAYER - API LOAD MORE FUNCTION
// ================================= //
function initLoadMore() {

    const loadMoreBtn = getEl("loadMoreBtn");

    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener("click", () => {

    loadMoreBtn.textContent = "Loading...";
    loadMoreBtn.disabled = true;

    postLimit += 5;

    setTimeout(() => {
        fetchPosts();

        loadMoreBtn.textContent = "Load More";
        loadMoreBtn.disabled = false;
    }, 1000);
    
    });
}

