// ==============================
// TESTIMONIAL AUTO SLIDER
// ==============================
function initTestimonialSlider() {

    const testimonials = document.querySelectorAll(".testimonial");

    let index = 0;

    function showTestimonial() {

        testimonials.forEach(t => t.classList.remove("active"));

        testimonials[index].classList.add("active");

        index++;

        if (index >= testimonials.length) {
            index = 0;
        }
    }

    // initial display
    showTestimonial();

    // auto change every 4 seconds
    setInterval(showTestimonial, 4000);
}
// ==============================
// API SERVICE - SEND MESSAGE
// ==============================
async function sendMessage(formData) {

    const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(formData)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to send message");
    }

    return await response.json();
}
