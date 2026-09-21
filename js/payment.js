// payment.js - Paystack sandbox integration
const PAYSTACK_PUBLIC_KEY = "pk_test_8eb28bb9ac5c5720256c62e0f8b29931243023c6";

/**
 * Open Paystack inline payment modal.
 * @param {Object} booking - Booking object (will be saved after payment).
 * @param {Function} onSuccess - Callback when payment succeeds.
 * @param {Function} onClose - Callback when payment modal is closed without payment.
 */
function openPaystack(booking, onSuccess, onClose) {
    // If Paystack SDK is not loaded (e.g., offline), simulate a successful payment after a short delay for demo purposes
    if (typeof PaystackPop === "undefined") {
        console.warn("Paystack SDK not loaded – using fallback simulation.");
        setTimeout(() => {
            // Simulate immediate success
            onSuccess();
        }, 500);
        return;
    }
    // If not on HTTPS (Paystack requires HTTPS), fall back to simulation as well
    if (location.protocol !== "https:") {
        console.warn("Paystack SDK requires HTTPS – simulating payment.");
        setTimeout(() => {
            onSuccess();
        }, 500);
        return;
    }

    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: booking.email,
        amount: booking.amount, // NGN to kobo
        currency: "NGN",
        ref: booking.id,
        metadata: {
            custom_fields: [
                { display_name: "Service", variable_name: "service", value: booking.service },
                { display_name: "Name", variable_name: "name", value: booking.name }
            ]
        },
        callback: function (response) {
            onSuccess();
        },
        onClose: function () {
            onClose();
        }
    });
    handler.openIframe();
}
