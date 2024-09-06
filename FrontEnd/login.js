const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Cacher le message d'erreur au début de la soumission du formulaire
  const errorElement = document.querySelector(".alert");
  errorElement.classList.remove("show");

  const data = new FormData(form);
  console.log("Données envoyées : ", {
    email: data.get("email"),
    password: data.get("password"),
  });

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
    return;
  }

  errorElement.classList.add("show");
});

document.querySelector(".button-closealert").addEventListener("click", () => {
  document.querySelector(".alert").classList.remove("show");
});
