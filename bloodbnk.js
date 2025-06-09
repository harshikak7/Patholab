document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("donationForm");

    const fields = {
        name: document.getElementById("name"),
        contact: document.getElementById("contact"),
        email: document.getElementById("email"),
        age: document.getElementById("age"),
        city: document.getElementById("city"),
        gender: document.getElementById("gender"),
        location: document.getElementById("location"),
        time: document.getElementById("time"),
    };

    const errorMessages = {
        name: document.getElementById("name-error"),
        contact: document.getElementById("contact-error"),
        email: document.getElementById("email-error"),
        age: document.getElementById("age-error"),
        city: document.getElementById("city-error"),
        gender: document.getElementById("gender-error"),
        location: document.getElementById("location-error"),
        time: document.getElementById("time-error"),
    };

    function showError(field, message) {
        errorMessages[field].textContent = message;
        errorMessages[field].style.display = "block";
    }

    function hideError(field) {
        errorMessages[field].textContent = "";
        errorMessages[field].style.display = "none";
    }

    function validateName() {
        const value = fields.name.value.trim();
        if (value.length < 3) {
            showError("name", "⚠ Name must be at least 3 characters.");
        } else {
            hideError("name");
        }
    }

    function validateContact() {
        const value = fields.contact.value.trim();
        if (!/^\d{10}$/.test(value)) {
            showError("contact", "⚠ Contact must be a 10-digit number.");
        } else {
            hideError("contact");
        }
    }

    function validateEmail() {
        const value = fields.email.value.trim();
        if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            showError("email", "⚠ Enter a valid email address.");
        } else {
            hideError("email");
        }
    }

    function validateAge() {
        const value = parseInt(fields.age.value, 10);
        if (isNaN(value) || value < 1 || value > 120) {
            showError("age", "⚠ Age must be between 1 and 120.");
        } else {
            hideError("age");
        }
    }

    function validateCity() {
        if (!fields.city.value.trim()) {
            showError("city", "⚠ City is required.");
        } else {
            hideError("city");
        }
    }

    function validateGender() {
        if (!fields.gender.value) {
            showError("gender", "⚠ Please select your gender.");
        } else {
            hideError("gender");
        }
    }

    function validateLocation() {
        if (!fields.location.value) {
            showError("location", "⚠ Please select a donation location.");
        } else {
            hideError("location");
        }
    }

    function validateTime() {
        if (!fields.time.value) {
            showError("time", "⚠ Please enter a donation time.");
        } else {
            hideError("time");
        }
    }

    // Attach real-time validation events
    fields.name.addEventListener("input", validateName);
    fields.contact.addEventListener("input", validateContact);
    fields.email.addEventListener("input", validateEmail);
    fields.age.addEventListener("input", validateAge);
    fields.city.addEventListener("input", validateCity);
    fields.gender.addEventListener("change", validateGender);
    fields.location.addEventListener("change", validateLocation);
    fields.time.addEventListener("input", validateTime);

    // Form submit event
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Run all validations before sending data
        validateName();
        validateContact();
        validateEmail();
        validateAge();
        validateCity();
        validateGender();
        validateLocation();
        validateTime();

        // Check if any errors are displayed
        const hasErrors = Object.values(errorMessages).some(msg => msg.textContent !== "");

        if (!hasErrors) {
            // Collect form data
            const formData = {
                name: fields.name.value.trim(),
                contact: fields.contact.value.trim(),
                email: fields.email.value.trim(),
                age: fields.age.value.trim(),
                city: fields.city.value.trim(),
                gender: fields.gender.value,
                location: fields.location.value,
                time: fields.time.value,
            };

            try {
                // Send form data to the backend
                const response = await fetch("http://localhost:5000/schedule", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (response.ok) {
                    alert("✅ Donation Scheduled Successfully!");
                    form.reset();
                } else {
                    alert("❌ Error: " + result.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("❌ Failed to connect to server!");
            }
        }
    });
});

