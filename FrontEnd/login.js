// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission behavior

  hideErrorMessage();

  const data = getFormData();

  console.log("Données envoyées : ", {
    email: data.get("email"),
    password: data.get("password"),
  });

  submitLoginData(data);
}

// Function to get form data
function getFormData() {
  const form = document.getElementById("login-form");
  return new FormData(form);
}

// Function to submit login data
async function submitLoginData(data) {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email: data.get("email"),
        password: data.get("password"),
      }),
    });

    if (response.ok) {
      const result = await response.json();
      sessionStorage.setItem("token", result.token);
      window.location = "index.html";
    } else {
      throw new Error("Erreur lors de l'identification");
    }
  } catch (err) {
    console.log(err);
    showErrorMessage();
  }
}

// Function to show error message
function showErrorMessage() {
  const errorElement = document.querySelector(".alert");
  errorElement.classList.add("show");
}

// Function to hide error message
function hideErrorMessage() {
  const errorElement = document.querySelector(".alert");
  errorElement.classList.remove("show");
}

// Add event listener to form submit
const form = document.getElementById("login-form");
form.addEventListener("submit", handleFormSubmit);

// Add event listener to close alert button
document
  .querySelector(".button-closealert")
  .addEventListener("click", hideErrorMessage);
