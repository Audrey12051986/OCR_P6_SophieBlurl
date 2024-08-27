document.getElementById("login_user_form").addEventListener("submit", (e) => {
  e.preventDefault();

  let emailUser = document.getElementById("email");
  let passwordUser = document.getElementById("password");

  if (emailUser.value === "" || passwordUser.value === "") {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailUser.value,
      password: passwordUser.value,
    }),
  })
    .then((response) => {
      console.log("Response received:", response);

      if (response.status !== 200) {
        return response.json().then((data) => {
          //display error message
          alert(data.message || "Email et / ou mot de passe erroné(s)");
        });
      } else {
        return response.json().then((data) => {
          sessionStorage.setItem("token", data.token);
          window.location.replace("index.html");
        });
      }
    })

    .catch((error) => {
      console.error("Erreur lors de la requête:", error);
      alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    });
});
