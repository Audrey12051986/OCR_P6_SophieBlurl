// ****** Gallery ****** //

// Function to fetch works
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des travaux");
    return await response.json();
  } catch (error) {
    console.error("Erreur", error);
    return []; // In case of error, return an empty list
  }
}

// Function to create a work element
function createWorkElement(work) {
  const workElement = document.createElement("figure");
  workElement.dataset.category = work.category.name;
  workElement.dataset.id = work.id;

  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;

  const captionElement = document.createElement("figcaption");
  captionElement.innerText = work.title;

  workElement.appendChild(imageElement);
  workElement.appendChild(captionElement);

  return workElement;
}

// Function to display works in the gallery
function displayWorks(works, sectionGallery) {
  sectionGallery.innerHTML = ""; // Clear previous works
  works.forEach((work) => {
    const workElement = createWorkElement(work);
    sectionGallery.appendChild(workElement);
  });
}

// Function to initialize the gallery
async function initGallery(sectionGallery) {
  const works = await fetchWorks();
  displayWorks(works, sectionGallery);
  setupFilters(works);
}

// ****** Filters ****** //

// Function to setup filters
async function setupFilters(works) {
  const filterContainer = document.querySelector(".filter-container");
  const categories = await fetchCategories();
  categoryFilter(categories, filterContainer);
  addCategoryListener(works);
}

// Function to fetch filter by categories
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des catégories");
    return await response.json();
  } catch (error) {
    console.error("Erreur", error);
    return [];
  }
}

// Function to create filter buttons
function categoryFilter(categories, filterContainer) {
  filterContainer.innerHTML = ""; // Clear previous buttons

  // Create "Tous" button
  const allButton = document.createElement("button");
  allButton.innerText = "Tous";
  allButton.className = "filter-button filteractive-button";
  allButton.dataset.categoryId = "0"; // ID for "Tous"
  filterContainer.appendChild(allButton);

  // Create buttons for each category
  categories.forEach((category) => {
    createButtonFilter(category, filterContainer);
  });
}

// Function to create a single filter button
function createButtonFilter(category, filterContainer) {
  const button = document.createElement("button");
  button.innerText = category.name;
  button.className = "filter-button";
  button.dataset.categoryId = category.id;
  filterContainer.appendChild(button);
}

// Function to add listeners to filter buttons
function addCategoryListener(works) {
  const buttons = document.querySelectorAll(".filter-button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-button").forEach((button) => {
        button.classList.remove("filteractive-button");
      });
      button.classList.add("filteractive-button");
      filterWorks(button.dataset.categoryId, works);
    });
  });
}

// Function to filter works based on category
function filterWorks(categoryId, works) {
  const sectionGallery = document.querySelector(".gallery");
  const filteredWorks = works.filter((work) =>
    categoryId === "0" ? true : work.category.id === parseInt(categoryId)
  );
  displayWorks(filteredWorks, sectionGallery);
}

// Intialisation
const sectionGallery = document.querySelector(".gallery");
initGallery(sectionGallery);

// ****** Admin Mode ****** //

//Call function after connexion ok
async function loginUser() {
  const email = "sophie.bluel@test.tld";
  const password = "S0phie";

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    const token = data.token;

    //Store the token in sessionStorage
    sessionStorage.setItem("token", token);

    adminUserMode();
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
  }
}

function adminUserMode() {
  const token = sessionStorage.getItem("token");

  if (exitToken(token)) {
    hideFilters();
    configureLogoutButton();
    createAdminMenu();
    addEditButtons();
    attachEditButtonListeners();
  }
}

function exitToken(token) {
  return !!token;
}

function hideFilters() {
  const filterElement = document.querySelector(".filter-container");
  if (filterElement) {
    filterElement.style.display = "none";
  }
}

function configureLogoutButton() {
  const logoutButton = document.querySelector("nav ul li:nth-child(3) a");
  if (logoutButton) {
    logoutButton.innerText = "Logout";
    logoutButton.className = "link-header link-active";
    logoutButton.addEventListener("click", handleLogout);
  }
}

function handleLogout() {
  sessionStorage.removeItem("token");
  window.location.reload();
}

function createAdminMenu() {
  const body = document.querySelector("body");
  const topMenu = document.createElement("div");
  topMenu.className = "topMenu";
  topMenu.innerHTML =
    '<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>';
  body.insertAdjacentElement("afterbegin", topMenu);
}

function addEditButtons() {
  const sectionsToEdit = ["#portfolio h2"];
  sectionsToEdit.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      const editButton = document.createElement("button");
      editButton.className = "edit-button";
      editButton.innerHTML =
        '<i class="fa-regular fa-pen-to-square"></i> modifier';
      element.insertAdjacentElement("afterend", editButton);
    }
  });
}

function attachEditButtonListeners() {
  const editButtons = document.querySelectorAll(".edit-button");
  editButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });
}

loginUser();

// ****** Modal ****** //

//Open modal
async function openModal(event) {
  event.preventDefault();

  const modal = document.getElementById("modal");
  const openModalIcon = document.querySelector(".js-openModalIcon");

  if (modal) {
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");

    //Fetch and display works in the modal
    const works = await fetchWorks();
    displayWorksModal(works);
  }
}

//Close modal
function closeModal() {
  const modal = document.getElementById("modal");
  const openModalIcon = document.querySelector(".js-openModalIcon");

  if (modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");

    if (openModalIcon) {
      openModalIcon.style.display = "inline";
    }
  }
}

function setupModalCloseListener() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    const closeModalButton = document.querySelector(".close-modal");
    if (closeModalButton) {
      closeModalButton.addEventListener("click", closeModal);
    }
  }
}

//Function to display works in the modal gallery
function displayWorksModal(works) {
  const modalGallery = document.querySelector(".gallery-modal");
  if (modalGallery) {
    modalGallery.innerHTML = "";
    works.forEach((work) => {
      const workElement = createWorkElement(work);
      modalGallery.appendChild(workElement);
    });
  }
}

// Initialize the gallery and modal setup when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  const sectionGalleryModal = document.querySelector(".gallery-modal");
  if (sectionGalleryModal) {
    initGallery(sectionGalleryModal);
  }
  setupModalCloseListener();

  // Add event listeners for opening the modal
  document.querySelectorAll(".js-modal").forEach((el) => {
    el.addEventListener("click", openModal);
  });
});

/*//Add DOM
function addWorkToGallery(work) {
  const sectionGallery = document.querySelector(".gallery");
  const workElement = createWorkElement(work);
  sectionGallery.appendChild(workElement);
}

//Removing existing work
async function deleteWork(workId) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    if (!response.ok)
      throw new Error("Erreur lors de la suppression du travail");
    document.querySelector(`[data-id='${workId}']`).remove(); // DOM update
  } catch (error) {
    console.error("Erreur", error);
  }
}*/

/*
//Removing existing work
async function deleteWork(workId) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    if (!response.ok)
      throw new Error("Erreur lors de la suppression du travail");
    document.querySelector(`[data-id='${workId}']`).remove(); // DOM update
  } catch (error) {
    console.error("Erreur", error);
  }
}

document.querySelectorAll(".delete-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    const workId = e.target.closest("figure").dataset.id;
    deleteWork(workId);
  });
});

//Add a new project via the modal form
document.getElementById("add-picture").addEventListener("click", async () => {
  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("image", document.getElementById("image").files[0]);
  formData.append("category", document.getElementById("category").value);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Erreur lors de l'ajout du travail");
    const newWork = await response.json();
    addWorkToGallery(newWork); // Mise à jour du DOM
  } catch (error) {
    console.error("Erreur", error);
  }
});

//Add DOM
function addWorkToGallery(work) {
  const sectionGallery = document.querySelector(".gallery");
  const workElement = createWorkElement(work);
  sectionGallery.appendChild(workElement);
}

*/
