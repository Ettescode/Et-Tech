// ==================================
//   ---  HELPER UTILITY  -----
// ==================================
window.getEl = function(id) {
    return document.getElementById(id);
};
function getEl(id) {
    return document.getElementById(id);
}

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

    const { title, description, image, details, price } = service;

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

    // Set Dynamic Booking Price
    if (price) {
        const priceFormatted = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(price);
        
        const priceEl = getEl("bookingBasePrice");
        if (priceEl) {
            priceEl.textContent = priceFormatted;
        }
    }

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
    const reveals = document.querySelectorAll('.reveal, .service-card, .pricing-card, .team-member');
    
    const observer = new IntersectionObserver((entries) => {
        let delay = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                delay += 150; // Stagger effect
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => {
        // Prepare elements for animation
        reveal.style.opacity = '0';
        reveal.style.transform = 'translateY(30px)';
        reveal.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(reveal);
    });
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

// ======================================
// BOOKING VALIDATION ENGINE (DAY 4)
// ======================================
function initBookingValidation() {
    const bookingDateInput = getEl("bookingDate");
    const bookingForm = getEl("bookingForm");

    if (!bookingDateInput || !bookingForm) return;

    // 1. SET MINIMUM DATE TO TODAY
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    
    bookingDateInput.setAttribute("min", minDate);

    // 2. PREVENT WEEKEND BOOKINGS
    bookingDateInput.addEventListener("change", function(e) {
        const selectedDate = new Date(this.value);
        const day = selectedDate.getUTCDay();

        // If Sunday (0) or Saturday (6)
        if (day === 0 || day === 6) {
            alert("We do not accept bookings on weekends. Please choose a weekday.");
            this.value = ""; // Clear the invalid date
        }
    });

    // 3. HANDLE FORM SUBMISSION & PREVENT CONFLICTS
    bookingForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = getEl("bookingName").value.trim();
        const email = getEl("bookingEmail").value.trim();
        const date = bookingDateInput.value;
        const slot = getEl("bookingSlot").value;
        const notes = getEl("bookingNotes") ? getEl("bookingNotes").value.trim() : "";
        const serviceName = activeService ? activeService.title : "General Service";

        if (!name || !email || !date || !slot) {
            alert("Please fill in all required fields.");
            return;
        }
        
        // Fetch price dynamically from the selected service
        const amount = activeService ? activeService.price : 25000;

        const submitBtn = getEl("confirmBookingBtn");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Processing...</span><span class="arrow">↻</span>`;
        submitBtn.style.opacity = "0.7";
        submitBtn.disabled = true;

        // Get existing bookings from backend to check conflicts
        const savedBookings = await getAutomatedBookings();
        
        // Helper to fetch bookings for a specific date
        function getBookingsForDate(dateStr) {
            return savedBookings.filter(b => b.date === dateStr && b.status !== "Canceled");
        }
        
        // Update conflict check to consider real bookings
        const currentSlotKey = `${date}-${slot}`;
        const isConflict = savedBookings.some(b => `${b.date}-${b.slot}` === currentSlotKey && b.status !== "Canceled");
        
        if (isConflict || (`${minDate}-09:00 - 11:00` === currentSlotKey)) {
            showToast("This time slot is already booked! Please select another slot.", "error");
            getEl("bookingSlot").value = "";
            submitBtn.innerHTML = originalText;
            submitBtn.style.opacity = "1";
            submitBtn.disabled = false;
            return;
        }
        
        // Enforce daily limit
        const MAX_BOOKINGS_PER_DAY = 3;
        const bookingsForDay = getBookingsForDate(date);
        if (bookingsForDay.length >= MAX_BOOKINGS_PER_DAY) {
            showToast(`You have reached the daily limit of ${MAX_BOOKINGS_PER_DAY} bookings. Please choose another date.`, "error");
            submitBtn.innerHTML = originalText;
            submitBtn.style.opacity = "1";
            submitBtn.disabled = false;
            return;
        }

        // 1. Immediately record booking in database as Pending
        const pendingBooking = {
            service: activeService ? activeService.title : "General",
            amount: activeService ? activeService.price : 0,
            name: name,
            email: email,
            date: date,
            slot: slot,
            notes: notes,
            status: "Pending"
        };

        const saveRes = await saveBooking(pendingBooking);
        const bookingId = saveRes && saveRes.id ? saveRes.id : null;

        // Open Paystack payment modal
        openPaystack({ name, email, amount: amount * 100 },
            // onSuccess
            async (response) => {
                if (bookingId) {
                    await fetch('api/update_status.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: bookingId, status: 'Paid' })
                    });
                }

                const ref = response ? response.reference : "SIMULATED";
                showToast(`Payment successful! Your booking is confirmed as Paid. Ref: ${ref}`, "success");
                bookingForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.opacity = "1";
                submitBtn.disabled = false;
                
                // Close modal
                getEl("serviceModal").classList.remove("show");

                // Refresh client portal if they are on it
                if (typeof renderClientBookings === "function") {
                    renderClientBookings();
                }

                // If client is not logged in, prompt them to register to view their portal
                checkAndPromptRegistration(name, email);
            },
            // onClose (payment window closed without paying)
            async () => {
                showToast(`Booking record saved as Pending! Register or log in to view your history in the Client Portal.`, "notice");
                bookingForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.opacity = "1";
                submitBtn.disabled = false;
                getEl("serviceModal").classList.remove("show");

                if (typeof renderClientBookings === "function") {
                    renderClientBookings();
                }

                // Prompt them to register their account to track this pending booking
                checkAndPromptRegistration(name, email);
            }
        );
    });
}

// Prompt guest to register so their pending booking links to their new portal account
async function checkAndPromptRegistration(name, email) {
    try {
        const res = await fetch('api/get_client_session.php');
        const session = await res.json();
        if (!session.logged_in) {
            setTimeout(() => {
                const regName = document.getElementById('registerName');
                const regEmail = document.getElementById('registerEmail');
                if (regName) regName.value = name;
                if (regEmail) regEmail.value = email;
                openClientAuthModal();
                toggleAuthTab('register');
                showToast('Create your account now to access your booking history in the Client Portal!', 'success');
            }, 1200);
        }
    } catch (e) {}
}

// ======================================
// BACKEND API ENGINE (Phase 3)
// ======================================
async function getAutomatedBookings() {
    try {
        let url = 'api/get_bookings.php';
        const emailInput = document.getElementById('bookingEmail');
        if (emailInput && emailInput.value) {
            url += `?email=${encodeURIComponent(emailInput.value)}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        return Array.isArray(data) ? data : (data.value ? data.value : []);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
}

async function saveBooking(bookingObj) {
    try {
        const response = await fetch('api/save_booking.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingObj)
        });
        return await response.json();
    } catch (error) {
        console.error("Error saving booking:", error);
        return null;
    }
}

// ======================================
// TOAST NOTIFICATION SYSTEM (DAY 7)
// ======================================
function showToast(message, type = 'success') {
    const container = getEl("toastContainer");
    if (!container) return;

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    // Set icon based on type
    const icon = type === 'success' ? '✅' : '⚠️';
    
    toast.innerHTML = `
        <span style="font-size: 20px;">${icon}</span>
        <div style="flex: 1;">
            <p style="margin: 0; font-weight: 600; font-size: 15px;">${type === 'success' ? 'Success' : 'Notice'}</p>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">${message}</p>
        </div>
    `;

    container.appendChild(toast);

    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 400); // Wait for fade-out transition
    }, 4000);
}

// ======================================
// CLIENT PORTAL RENDERING (DAY 9)
// ======================================
window.renderClientBookings = async function() {
    const bookingsList = getEl("bookingsList");
    if (!bookingsList) return;
    
    bookingsList.innerHTML = `<div class="empty-state"><p>Loading bookings...</p></div>`;

    try {
        const savedBookings = await getAutomatedBookings();

        if (!savedBookings || savedBookings.length === 0) {
            bookingsList.innerHTML = `
                <div class="empty-state">
                    <p>You have no saved bookings yet. Book a service on the homepage to get started!</p>
                </div>
            `;
            return;
        }

        // Sort by date (newest first)
        const sortedBookings = savedBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Render each booking
        const html = sortedBookings.map(booking => {
            const priceFormatted = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN'
            }).format(booking.amount);

            const statusLower = (booking.status || 'pending').toLowerCase();
            const statusClass = statusLower === 'pending' ? 'pending' : statusLower === 'paid' ? 'paid' : statusLower === 'completed' ? 'completed' : 'canceled';

            // Cancel button only if booking is not already canceled
            const cancelBtn = booking.status !== 'Canceled' ? `<button class="cancel-btn" onclick="cancelBooking('${booking.id}')">Cancel</button>` : '';
            
            // Invoice button if Paid or Completed
            const invoiceBtn = (booking.status === 'Paid' || booking.status === 'Completed') 
                ? `<button class="btn secondary" onclick="downloadInvoice('${booking.id}')" style="margin-left: 10px; padding: 5px 10px; font-size: 0.85rem;"><i class="fas fa-file-invoice"></i> Invoice</button>` 
                : '';

            return `
                <div class="booking-item">
                    <div class="booking-details">
                        <h4>${booking.service}</h4>
                        <p>📅 ${booking.date} | ⏰ ${booking.slot}</p>
                        <p><strong>ID:</strong> #${booking.id} | <strong>Total:</strong> ${priceFormatted}</p>
                    </div>
                    <div class="booking-meta">
                        <span class="status-badge ${statusClass}">${booking.status}</span>
                        ${cancelBtn}
                        ${invoiceBtn}
                    </div>
                </div>
            `;
        }).join("");

        bookingsList.innerHTML = html;
    } catch (err) {
        console.error("Error rendering client bookings:", err);
        bookingsList.innerHTML = `
            <div class="empty-state">
                <p>Could not load bookings right now. Please click 'Refresh'.</p>
            </div>
        `;
    }
};

// Cancel a booking by ID
window.cancelBooking = async function(bookingId) {
    try {
        const response = await fetch('api/update_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: bookingId, status: 'Canceled' })
        });
        const result = await response.json();
        
        if (result.success) {
            showToast('Booking cancelled.', 'error');
            await window.renderClientBookings();
        } else {
            showToast(result.error || 'Failed to cancel.', 'error');
        }
    } catch (error) {
        console.error("Error canceling booking:", error);
        showToast('Error connecting to server.', 'error');
    }
}

// ==========================================
// WEEK 5 - DAY 21: DYNAMIC TESTIMONIALS
// ==========================================

function getReviews() {
    const data = localStorage.getItem("etTechReviews");
    return data ? JSON.parse(data) : [];
}

// Function to render dynamic testimonials
window.renderDynamicTestimonials = function() {
    const wrapper = getEl("testimonialWrapper");
    if (!wrapper) return;
    
    const reviews = getReviews();
    
    // Default testimonials
    let defaultTestimonials = [
        {
            message: "Et-Tech SoftApps delivered an excellent web application for our business.",
            name: "Stephen Afije",
            role: "Client"
        },
        {
            message: "Very professional team, the mobile app works perfectly.",
            name: "Nsikan Edet",
            role: "Client"
        },
        {
            message: "Great communication and fast delivery. Highly recommended!",
            name: "David Smith",
            role: "Client"
        }
    ];
    
    // Combine defaults and user-submitted reviews (newest first)
    const combined = [...reviews.reverse(), ...defaultTestimonials];
    
    const html = combined.map((rev, index) => {
        const activeClass = index === 0 ? "active" : "";
        return `
            <div class="testimonial ${activeClass}">
                <p>"${rev.message}"</p>
                <h4>- ${rev.name} <span style="font-size:12px; font-weight:normal; opacity:0.8;">(${rev.role})</span></h4>
            </div>
        `;
    }).join("");
    
    wrapper.innerHTML = html;
};

// ==========================================
// WEEK 7: TICKETING SYSTEM (CLIENT)
// ==========================================
window.renderClientTickets = async function() {
    const email = getEl("fetchSupportEmail").value.trim();
    const ticketsList = getEl("ticketsList");
    
    if (!email) {
        showToast("Please enter your email to view tickets.", "error");
        return;
    }

    ticketsList.innerHTML = `<p>Loading tickets...</p>`;

    try {
        const response = await fetch(`api/get_tickets.php?email=${encodeURIComponent(email)}`);
        const tickets = await response.json();
        
        if (tickets.length === 0) {
            ticketsList.innerHTML = `
                <div class="empty-state">
                    <p>No tickets found for this email.</p>
                </div>
            `;
            return;
        }

        const html = tickets.map(ticket => {
            const statusClass = ticket.status === 'Open' ? 'pending' : ticket.status === 'Resolved' ? 'paid' : 'canceled';
            const adminReplyHtml = ticket.admin_reply 
                ? `<div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.05); border-left: 3px solid #00f; border-radius: 4px;"><strong>Admin Reply:</strong> ${ticket.admin_reply}</div>` 
                : '';
            
            return `
                <div class="booking-item" style="flex-direction: column; align-items: flex-start; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <h4>${ticket.subject}</h4>
                        <span class="status-badge ${statusClass}">${ticket.status}</span>
                    </div>
                    <p><strong>Message:</strong> ${ticket.message}</p>
                    <p style="font-size: 0.8rem; color: #666;">Submitted: ${new Date(ticket.created_at).toLocaleString()}</p>
                    ${adminReplyHtml}
                </div>
            `;
        }).join("");

        ticketsList.innerHTML = html;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        ticketsList.innerHTML = `<p style="color: red;">Failed to load tickets.</p>`;
    }
};

// Listen for DOM load to bind form
document.addEventListener("DOMContentLoaded", () => {
    // Handle Support Ticket Submission
    const supportForm = getEl("supportForm");
    if (supportForm) {
        supportForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const email = getEl("supportEmail").value.trim();
            const subject = getEl("supportSubject").value.trim();
            const message = getEl("supportMessage").value.trim();
            
            if (!email || !subject || !message) return;
            
            const btn = supportForm.querySelector("button");
            const oldText = btn.textContent;
            btn.textContent = "Submitting...";
            btn.disabled = true;

            try {
                const response = await fetch('api/submit_ticket.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: 'Client', email, subject, message })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showToast("Ticket submitted successfully!", "success");
                    supportForm.reset();
                    getEl("fetchSupportEmail").value = email; // auto fill to view
                    renderClientTickets();
                } else {
                    showToast(result.error || "Failed to submit ticket.", "error");
                }
            } catch (err) {
                console.error(err);
                showToast("Server error.", "error");
            } finally {
                btn.textContent = oldText;
                btn.disabled = false;
            }
        });
    }

    // Handle Review Submission
    const reviewForm = getEl("reviewForm");
    if (reviewForm) {
        reviewForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const name = getEl("reviewerName").value.trim();
            const role = getEl("reviewerRole").value.trim();
            const message = getEl("reviewMessage").value.trim();
            
            if (!name || !message) return;
            
            const newReview = {
                id: 'REV-' + Date.now(),
                name: name,
                role: role || 'Client',
                message: message,
                date: new Date().toISOString()
            };
            
            // Save to localStorage
            const existingReviews = getReviews();
            existingReviews.push(newReview);
            localStorage.setItem("etTechReviews", JSON.stringify(existingReviews));
            
            // Reset form and show success
            reviewForm.reset();
            if(typeof showToast === "function") showToast("Thank you! Your review has been submitted.", "success");
            
            // Re-render testimonials
            renderDynamicTestimonials();
        });
    }

    if (getEl("testimonialWrapper")) {
        renderDynamicTestimonials();
    }
});

// ==========================================
// INVOICE GENERATION (WEEK 6)
// ==========================================
window.downloadInvoice = async function(bookingId) {
    try {
        const bookings = await getAutomatedBookings();
        const booking = bookings.find(b => String(b.id) === String(bookingId));
        
        if (!booking) {
            showToast("Booking not found.", "error");
            return;
        }

        // Format Currency
        const formattedAmount = new Intl.NumberFormat('en-NG', {
            style: 'currency', currency: 'NGN'
        }).format(booking.amount);

        // Populate Template
        document.getElementById('invNumber').textContent = `#INV-${booking.id}`;
        document.getElementById('invName').textContent = booking.name;
        document.getElementById('invEmail').textContent = booking.email;
        document.getElementById('invDate').textContent = booking.date;
        document.getElementById('invService').textContent = booking.service;
        document.getElementById('invAmount').textContent = formattedAmount;
        document.getElementById('invTotal').textContent = formattedAmount;

        const template = document.getElementById('invoiceTemplate');
        template.style.display = 'block'; // Temporarily show it

        // Generate PDF
        const opt = {
            margin:       1,
            filename:     `Invoice_${booking.id}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        showToast("Generating Invoice...", "success");
        await html2pdf().set(opt).from(template).save();
        
        template.style.display = 'none'; // Hide it back
    } catch (error) {
        console.error("Error generating invoice:", error);
        showToast("Failed to generate invoice.", "error");
        document.getElementById('invoiceTemplate').style.display = 'none';
    }
}
// ==========================================
// WEEK 9: CLIENT AUTHENTICATION
// ==========================================
window.openClientAuthModal = function() {
    const modal = document.getElementById('clientAuthModal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
    }
};

window.closeClientAuthModal = function() {
    const modal = document.getElementById('clientAuthModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.style.opacity = '0';
    }
};

window.toggleAuthTab = function(tab) {
    const loginForm = document.getElementById('clientLoginForm');
    const registerForm = document.getElementById('clientRegisterForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabLogin.style.borderBottom = '2px solid var(--brand-blue)';
        tabLogin.style.color = 'var(--text-primary)';
        tabRegister.style.borderBottom = 'none';
        tabRegister.style.color = 'var(--text-secondary)';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabRegister.style.borderBottom = '2px solid var(--brand-blue)';
        tabRegister.style.color = 'var(--text-primary)';
        tabLogin.style.borderBottom = 'none';
        tabLogin.style.color = 'var(--text-secondary)';
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // Check if URL specifies auth modal
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') || window.location.hash === '#clientAuth') {
        openClientAuthModal();
        if (urlParams.get('tab') === 'register') {
            toggleAuthTab('register');
        }
    }

    // Close auth modal when clicking background
    window.addEventListener('click', (e) => {
        const authModal = document.getElementById('clientAuthModal');
        if (e.target === authModal) {
            closeClientAuthModal();
        }
    });

    // Check if client is logged in
    try {
        const res = await fetch('api/get_client_session.php');
        const session = await res.json();
        
        const navAuthLink = document.getElementById('navAuthLink');
        if (navAuthLink && session.logged_in) {
            navAuthLink.innerHTML = `<a href="portal.php">Dashboard <i class="fas fa-tachometer-alt"></i></a>`;
        }
    } catch (e) { console.error('Session check failed', e); }

    const loginForm = document.getElementById('clientLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                const response = await fetch('api/client_login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const result = await response.json();
                
                if (result.success) {
                    window.location.href = 'portal.php';
                } else {
                    showToast(result.error || 'Login failed', 'error');
                }
            } catch (err) {
                showToast('Server error', 'error');
            }
        });
    }

    const registerForm = document.getElementById('clientRegisterForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const full_name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            try {
                const response = await fetch('api/client_register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ full_name, email, password })
                });
                const result = await response.json();
                
                if (result.success) {
                    window.location.href = 'portal.php';
                } else {
                    showToast(result.error || 'Registration failed', 'error');
                }
            } catch (err) {
                showToast('Server error', 'error');
            }
        });
    }
});


// ==========================================
// PWA SERVICE WORKER REGISTRATION (Week 11)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                // Success
            }, (err) => {
                // Error
            });
    });
}

