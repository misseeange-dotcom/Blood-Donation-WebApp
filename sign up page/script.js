// STEP 1: Grab references to the elements we need from the DOM
const form = document.getElementById("signinForm");
const successMessage = document.getElementById("successMessage");
// STEP 2: Listen for the form's "submit" event
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const isValid = isFormValid();

  if (isValid) {
    const data = {
      fullName: form.fullName.value.trim(),
      bloodType: form.bloodType.value,
      location: form.location.value.trim(),
      phone: form.phone.value.trim(),
      role: form.role.value, // "donor" or "patient"
    };

    console.log("Form submitted:", data);
    // Save the signed-in user's data so other pages (like donor.html)
// can read it. localStorage keeps data in the browser even after
// the page closes — it's not a real database, but it's perfect
// for learning how pages can share data.
localStorage.setItem("currentUser", JSON.stringify(data));

successMessage.textContent = `Welcome, ${data.fullName}! Redirecting...`;

// Send the user to the right page based on their role
setTimeout(function () {
  if (data.role === "donor") {
    window.location.href = "donor.html";
  } else {
    window.location.href = "patient.html"; // build this page later
  }
}, 1200);
}else{
    successMessage.textContent = "";

});
// STEP 3: Validation logic — one small check per field
function isFormValid() {
  let valid = true;

  if (form.fullName.value.trim() === "") {
    showError("fullName", "Please enter your full name.");
    valid = false;
  } else {
    clearError("fullName");
  }

  if (form.bloodType.value === "") {
    showError("bloodType", "Please select your blood type.");
    valid = false;
  } else {
    clearError("bloodType");
  }

  if (form.location.value.trim() === "") {
    showError("location", "Please enter your location.");
    valid = false;
  } else {
    clearError("location");
  }

  const phoneDigits = form.phone.value.replace(/\D/g, "");
  if (phoneDigits.length < 8) {
    showError("phone", "Please enter a valid phone number.");
    valid = false;
  } else {
    clearError("phone");
  }

  if (form.password.value.length < 6) {
    showError("password", "Password must be at least 6 characters.");
    valid = false;
  } else {
    clearError("password");
  }

  const roleChosen = form.querySelector('input[name="role"]:checked');
  if (!roleChosen) {
    showError("role", "Please choose donor or patient.");
    valid = false;
  } else {
    clearError("role");
  }

  return valid;
}

// ============================================================
// STEP 4: Small helper functions to show/hide error messages
// ============================================================
function showError(fieldName, message) {
  const errorEl = document.getElementById("error-" + fieldName);
  if (errorEl) errorEl.textContent = message;

  const inputEl = form[fieldName];
  if (inputEl && inputEl.classList) {
    inputEl.classList.add("invalid");
  }
}

function clearError(fieldName) {
  const errorEl = document.getElementById("error-" + fieldName);
  if (errorEl) errorEl.textContent = "";

  const inputEl = form[fieldName];
  if (inputEl && inputEl.classList) {
    inputEl.classList.remove("invalid");
  }
}

function clearAllErrors() {
  const fields = ["fullName", "bloodType", "location", "phone", "password", "role"];
  fields.forEach(clearError);
}
