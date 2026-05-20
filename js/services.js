// ==================================
//   ---  SERVICES MODULE  -----
// ==================================
const services = [
    {
        title: "Web Development",
        description: "Modern and responsive web applications.",
        icon: "💻",
        image: "https://picsum.photos/400/200?random=1",
        details: "We build scalable, fast, and secure web applications using modern technologies.",
        price: 500000
    },
    {
        title: "Mobile Applications",
        description: "Android and iOS cross-platform apps.",
        icon: "📱",
        image: "https://picsum.photos/400/200?random=2",
        details: "We develop mobile apps that run smoothly across devices with excellent user experience.",
        price: 10000000
    },
    {
        title: "Enterprise Software",
        description: "Custom solutions for businesses.",
        icon: "🏢",
        image: "https://picsum.photos/400/200?random=3",
        details: "We provide enterprise-grade software tailored to business needs and scalability.",
        price: 50000000
    }
];
// ====  CLONED SERVICES STATE  ====
let servicesState = [...services];

// =====  ACTIVE SERVICE STATE  ====
let activeService = null;

// =========================================
//  COMPONENT: SERVICE CARD
// =========================================
function createServiceCard(service) {
    const { title, description, icon } = service;

    return `
        <div 
            class="card reveal ${activeService === service ? 'active-card' : ''}" 
            onclick="handleServiceClick(${servicesState.indexOf(service)})"
            role="button"
            tabindex="0"
            aria-label="Service: ${title}"
        >
            <div class="card-header-icon">
                <span class="icon">${icon}</span>
                <span class="service-tag">Service</span>
            </div>
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="card-action">
                <span>View Details & Book</span>
                <span class="arrow">&rarr;</span>
            </div>
        </div>
    `;
}
// ==============================
// HANDLE SERVICE CLICK (GLOBAL)
// ==============================
function handleServiceClick(index) {

    activeService = services.find((service, i) => {
        return i === index;
    });
    renderServices();
    openModal(activeService);
}
// ======================================
// UI COMPONENT - RENDER SERVICES TO PAGE
// ======================================
function renderServices() {

    const container = getEl("servicesContainer");

    const html = servicesState.map(service => {
    return createServiceCard(service);
}).join("");

container.innerHTML = html;
}

// ==============================================
// UI COMPONENT - OPEN MODAL WITH SERVICE DETAILS
// ==============================================
function openModal(service) {

    const { title, description, image, details } = service;

    const modal = getEl("serviceModal");

    const modalTitle = getEl("modalTitle");
    const modalDescription = getEl("modalDescription");
    const modalImage = getEl("modalImage");
    const modalDetails = getEl("modalDetails");

    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalImage.src = image;
    modalImage.alt = title;
    modalDetails.textContent = details;

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
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
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
// ==============================
// HERO IMAGE SLIDER
// ==============================
function initHeroSlider() {

    const slides =
        document.querySelectorAll(".slide");

    const nextBtn =
        getEl("nextSlide");

    const prevBtn =
        getEl("prevSlide");

    let currentSlide = 0;

    // SHOW CURRENT SLIDE
    function showSlide(index) {

    slides.forEach(slide => {
        slide.classList.remove("active-slide");
    });

    slides[index].classList.add("active-slide");

    // RESTART ANIMATION
    const heroContent =
        document.querySelector(".hero-content");

    heroContent.style.animation = "none";

    setTimeout(() => {
        heroContent.style.animation =
            "fadeUp 1s ease";
    }, 10);
}
    // NEXT SLIDE
    function nextSlide() {

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        showSlide(currentSlide);
    }

    // PREVIOUS SLIDE
    function prevSlide() {

        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        showSlide(currentSlide);
    }

    // BUTTON EVENTS
    nextBtn.addEventListener("click", nextSlide);

    prevBtn.addEventListener("click", prevSlide);

    // AUTO SLIDE
    setInterval(nextSlide, 5000);
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
// SAVE FORM DATA
// ==============================
function saveFormData(data) {

    localStorage.setItem(
        "contactFormData",
        JSON.stringify(data)
    );
}
// ==============================
// LOAD FORM DATA
// ==============================
function loadFormData() {

    const savedData =
        localStorage.getItem("contactFormData");

    if (!savedData) return null;

    return JSON.parse(savedData);
}
// ==============================
// SAVE CURRENT INPUT VALUES
// ==============================
function saveFormInputs() {

    const formData = {
        name: getEl("name").value,
        email: getEl("email").value,
        message: getEl("message").value
    };

    saveFormData(formData);
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
    const savedData = loadFormData();

if (savedData) {

    fullName.value = savedData.name || "";
    email.value = savedData.email || "";
    message.value = savedData.message || "";
}

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
        saveFormInputs();
    });

    email.addEventListener("input", () => {
        if (validateEmail(email.value)) {
            email.classList.remove("error");
            email.classList.add("success");
            emailError.textContent = "";
        }
        checkFormValidity();
        saveFormInputs();
    });

    message.addEventListener("input", () => {
        if (message.value.trim() !== "") {
            message.classList.remove("error");
            message.classList.add("success");
            messageError.textContent = "";
        }
        checkFormValidity();
        saveFormInputs();
    });

    // ========================
    // FORM SUBMIT
    // ========================
    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        let isValid = true;

        nameError.textContent = "";
        emailError.textContent = "";
        messageError.textContent = "";
        successMsg.textContent = "";
        successMsg.style.color = "green";

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

    const formData = {
        name: fullName.value,
        email: email.value,
        message: message.value
    };

    try {

        await sendMessage(formData);

        successMsg.textContent =
            "Message sent successfully!";

        form.reset();
        localStorage.removeItem("contactFormData");

        fullName.classList.remove("success");
        email.classList.remove("success");
        message.classList.remove("success");

    } catch (error) {

        successMsg.textContent =
            "Failed to send message.";

        successMsg.style.color = "red";

        console.error(error);

    } finally {

        submitBtn.textContent = "Send Message";

        submitBtn.disabled = true;

        submitBtn.classList.remove("loading");
    }
        }

    });

}
// ======================================
// UI COMPONENT - EMAIL VALIDATION HELPER
// ======================================
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}