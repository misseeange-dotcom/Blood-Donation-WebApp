// STEP 1: Grab references to the elements we need from the DOM
const form = document.getElementById("loginForm");
const successMessage = document.getElementById("successMessage");

// STEP 2: Listen for the form's "submit" event
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const isValid = isFormValid();

  if (isValid) {
    const data = {
      fullName: form.fullName.value.trim(),
      password: form.password.value,
    };

    // In a real app you'd send this to a server with fetch()
    // and check it against stored accounts. Here we just fake it.
    console.log("Login attempt:", data);

    successMessage.textContent = `Welcome back, ${data.fullName}!`;
    form.reset();
    clearAllErrors();
  } else {
    successMessage.textContent = "";
  }
});
// STEP 3: Validation — just two fields this time
function isFormValid() {
  let valid = true;

  if (form.fullName.value.trim() === "") {
    showError("fullName", "Please enter your full name.");
    valid = false;
  } else {
    clearError("fullName");
  }

  if (form.password.value.length < 6) {
    showError("password", "Password must be at least 6 characters.");
    valid = false;
  } else {
    clearError("password");
  }

  return valid;
}
// STEP 4: Helper functions (identical pattern to the sign-in page)
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
  const fields = ["fullName", "password"];
  fields.forEach(clearError);
}
