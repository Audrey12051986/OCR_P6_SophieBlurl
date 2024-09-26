// ****** Gallery ****** //
//////////////////////////

let works = [];
const filterContainer = document.querySelector(".filter-container");

// Function to create a work element
function createWorkElement(work) {
  const workElement = document.createElement("figure");
  workElement.dataset.category = work.category.name;
  workElement.dataset.id = work.id;

  workElement.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}">
    <figcaption>${work.title}</figcaption>
  `;
  return workElement;
}

//Fetch categories and projects
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des travaux");
    return (works = await response.json());
    //return works;
    //return await response.json();
  } catch (error) {
    console.error("Erreur", error);
    //works = []; // In case of error, return an empty list
    return [];
  }
}

// Function to display works in the gallery
function displayWorks() {
  sectionGallery.innerHTML = ""; // Clear previous works
  works.forEach((work) => {
    const workElement = createWorkElement(work);
    sectionGallery.appendChild(workElement);
  });
}

// Function to initialize the gallery
async function initGallery() {
  await fetchWorks();
  displayWorks();
  setupFilters();
}

// ****** Filters ****** //
//////////////////////////

// Function to setup filters
async function setupFilters() {
  const categories = await fetchCategories();
  categoryFilter(categories);
  addCategoryListener();
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
function categoryFilter(categories) {
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
function addCategoryListener() {
  const buttons = document.querySelectorAll(".filter-button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-button").forEach((button) => {
        button.classList.remove("filteractive-button");
      });
      button.classList.add("filteractive-button");
      filterWorks(button.dataset.categoryId);
    });
  });
}

// Function to filter works based on category
function filterWorks(categoryId) {
  const sectionGallery = document.querySelector(".gallery");
  let filteredWorks;

  // Check if "Tous" is selected (ID = 0)
  if (categoryId === "0") {
    filteredWorks = works; // Show all works
  } else {
    filteredWorks = works.filter(
      (work) => work.category.id === parseInt(categoryId)
    );
  }

  displayFilteredWorks(filteredWorks, sectionGallery);
}

function displayFilteredWorks(filteredWorks, sectionGallery) {
  sectionGallery.innerHTML = ""; // Clear the gallery before displaying filtered works
  filteredWorks.forEach((work) => {
    const workElement = createWorkElement(work);
    sectionGallery.appendChild(workElement);
  });
}

// Intialisation
const sectionGallery = document.querySelector(".gallery");
initGallery(sectionGallery);
adminUserMode();

// ****** Admin Mode ****** //

function adminUserMode() {
  const token = sessionStorage.getItem("token");

  if (token) {
    hideFilters();
    configureLogoutButton();
    createAdminMenu();
    addEditButtons();
  }
}

function hideFilters() {
  const filterElement = document.querySelector(".filter-container");
  if (filterElement) {
    filterElement.style.display = "none";
  }
}

function configureLogoutButton() {
  const loginButton = document.querySelector("nav ul li:nth-child(3) a");
  let logoutButton = document.createElement("a");
  loginButton.after(logoutButton);
  logoutButton.innerText = "Logout";
  logoutButton.className = "link-header link-active";
  logoutButton.addEventListener("click", handleLogout);
  loginButton.remove();
}

function handleLogout() {
  sessionStorage.removeItem("token");
  window.location.href = "index.html";
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
  const sectionsToEdit = document.querySelector(".edit-mode");
  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-regular", "fa-pen-to-square");
  sectionsToEdit.appendChild(editIcon);
  const elementReference = sectionsToEdit.querySelector("i");
  const span = document.createElement("span");
  span.classList.add("edit-button");
  span.textContent = " modifier";
  elementReference.parentNode.insertBefore(span, elementReference.nextSibling);
}

// ****** Modal ****** //

//Open modal gallery
async function openGalleryModal() {
  const containerModals = document.querySelector(".container-modals");
  const galleryModal = document.querySelector(".modal-gallery");
  const addWorkModal = document.querySelector(".modal-addwork");
  const editButton = document.querySelector(".edit-button");

  if (editButton) {
    editButton.addEventListener("click", () => {
      containerModals.style.display = "flex";
      galleryModal.style.display = "flex";
      addWorkModal.style.display = "none";
    });
  } else {
    console.error("L'élément editButton est introuvable.");
  }
}
openGalleryModal();

//Close modal gallery
function closeGalleryModal() {
  const xmarkClose = document.querySelector(".close-modal");
  const containerModals = document.querySelector(".container-modals");
  const galleryModal = document.querySelector(".modal-gallery");

  xmarkClose.addEventListener("click", () => {
    containerModals.style.display = "none";
  });

  containerModals.addEventListener("click", (e) => {
    if (!galleryModal.contains(e.target) && e.target !== galleryModal) {
      containerModals.style.display = "none";
    }
  });
}

closeGalleryModal();

// Create Element for modal gallery
function createWorkElementModal(work) {
  const workElementModal = document.createElement("figure");
  workElementModal.dataset.category = work.category.name;
  workElementModal.dataset.id = work.id;

  workElementModal.innerHTML = `
    <span class="span-trash">
      <div class="container-trash">
        <i class="fa-solid fa-trash-can" id="${work.id}"></i>
      </div>
    </span>
    <img src="${work.imageUrl}" alt="Work Image">
  `;

  return workElementModal;
}

//Display works in the modal gallery
async function displayWorksModal() {
  const galleryModal = document.querySelector(".gallery-modal");
  galleryModal.innerHTML = "";

  const worksModal = await fetchWorks();
  worksModal.forEach((work) => {
    const workElementModal = createWorkElementModal(work);
    galleryModal.appendChild(workElementModal);
  });

  deleteWorksModal();
}

displayWorksModal();

//Delete works in modal gallery
async function deleteWorksModal() {
  const trashAll = document.querySelectorAll(".fa-trash-can");
  const token = sessionStorage.getItem("token");

  if (!token) {
    console.error("Vous n'^tes pas autoriser à supprimer les projets");
    return;
  }

  trashAll.forEach((trash) => {
    trash.addEventListener("click", async (e) => {
      const workId = trash.id;
      const fetchDelete = await fetch(
        `http://localhost:5678/api/works/${workId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!fetchDelete.ok) {
        console.error("Erreur lors de la suppression du projet.");
        return;
      }

      const selector = `[data-id="${workId}"]`;
      const elements = document.querySelectorAll(selector);

      elements.forEach((element) => {
        element.remove();
      });

      console.log(`Projet avec l'ID ${workId} supprimé du DOM`);
    });
  });
}

deleteWorksModal();

//Refresh galleries modal and website
async function refreshGalleries(event) {
  event.preventDefault();
  const sectionGallery = document.querySelector(".gallery");

  await initGallery(sectionGallery);
  await displayWorksModal();
}

//Open modal addwork
function openAddworkModal() {
  const addPictureButton = document.querySelector("#add-picture");
  const addWorkModal = document.querySelector(".modal-addwork");
  const galleryModal = document.querySelector(".modal-gallery");
  const containerModals = document.querySelector(".container-modals");

  addPictureButton.addEventListener("click", (e) => {
    e.stopPropagation();
    containerModals.style.display = "flex";
    addWorkModal.style.display = "flex";
    galleryModal.style.display = "none";
  });
}

openAddworkModal();

//Return from modal addWork to modal gallery
function returnModalGallery() {
  const arrowLeft = document.querySelector(".fa-arrow-left");
  const addWorkModal = document.querySelector(".modal-addwork");
  const galleryModal = document.querySelector(".modal-gallery");
  const containerModals = document.querySelector(".container-modals");

  arrowLeft.addEventListener("click", (e) => {
    e.stopPropagation(); // Empêcher la propagation du clic
    containerModals.style.display = "flex";
    galleryModal.style.display = "flex";
    addWorkModal.style.display = "none";
  });
}

returnModalGallery();

//function closeAddworkModal
function closeAddWorkModal() {
  const xmarkAddWork = document.querySelector(".close-workmodal");
  const containerModals = document.querySelector(".container-modals");
  const addWorkModal = document.querySelector(".modal-addwork");
  const validationButton = document.querySelector("#addwork-validation");

  xmarkAddWork.addEventListener("click", () => {
    containerModals.style.display = "none";
    resetForm();
  });

  containerModals.addEventListener("click", (e) => {
    if (!addWorkModal.contains(e.target) && e.target !== addWorkModal) {
      containerModals.style.display = "none";
      resetForm();
    }
  });

  validationButton.addEventListener("click", () => {
    if (validationButton.classList.contains("valid")) {
      containerModals.style.display = "none";
    }
  });

  verifFormCompleted();
}

//Verification form completed
function verifFormCompleted() {
  const buttonValidationForm = document.querySelector("#addwork-validation");
  const form = document.querySelector("#form-addwork");
  const titleForm = document.querySelector("#addwork-title");
  const categoryForm = document.querySelector("#addwork-category");
  const inputFile = document.querySelector("#addpicture-file");

  buttonValidationForm.classList.remove("valid");

  form.addEventListener("input", () => {
    if (
      titleForm.value.trim() !== "" &&
      categoryForm.value !== "" &&
      inputFile.files.length > 0
    ) {
      buttonValidationForm.classList.add("valid");
      buttonValidationForm.disabled = false;
    } else {
      buttonValidationForm.classList.remove("valid");
      buttonValidationForm.disabled = true;
    }
  });
}

verifFormCompleted();

closeAddWorkModal();

// Prevent closing on click on form
function preventModalClose() {
  const addWorkModal = document.querySelector(".modal-addwork");
  const formElements = addWorkModal.querySelectorAll(
    "input, label, select, textarea"
  );

  formElements.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });
}
preventModalClose();

// Sélection des éléments du DOM
const previousImage = document.querySelector(".container-picture img");
const inputFile = document.querySelector(".file-input");
const labelFile = document.querySelector(".file-label");
const iconFile = document.querySelector(".fa-image");
const formatImage = document.querySelector(".container-picture p");

// Preview image
function updateImagePreview(file) {
  const reader = new FileReader();
  const previousImage = document.querySelector(".container-picture img");

  reader.onload = function (e) {
    previousImage.src = e.target.result;
    previousImage.style.display = "flex";
  };
  reader.readAsDataURL(file);
}

// Hide image elements
function hideFileElements() {
  labelFile.style.display = "none";
  iconFile.style.display = "none";
  formatImage.style.display = "none";
}

function showFileElements() {
  labelFile.style.display = "block";
  iconFile.style.display = "block";
  formatImage.style.display = "block";
}

// Image loading
function handleFileChange() {
  const file = inputFile.files[0];
  if (file) {
    updateImagePreview(file);
    hideFileElements();
  }
}

// Écouteur d'événement pour détecter le changement de fichier
inputFile.addEventListener("change", handleFileChange);

//Creating a list of categories in select
async function categoriesListModal() {
  const selectModal = document.querySelector("#addwork-category");
  const categoryList = await fetchCategories();
  const select = document.getElementById("addwork-category");

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  select.appendChild(emptyOption);

  categoryList.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    selectModal.appendChild(option);
  });
}
categoriesListModal();

const sectionForm = document.querySelector("#form-addwork");

//Function add work in the gallery
function addWorkPost() {
  const form = document.querySelector(".modal-addwork form");
  const titleWork = document.querySelector("#addwork-title");
  const categoryWork = document.querySelector("#addwork-category");
  const fileInput = document.querySelector("#addpicture-file");
  const modal = document.querySelector(".modal-addwork");
  const errorDisplay = document.querySelector(".error-message");
  const successDisplay = document.querySelector(".success-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const token = sessionStorage.getItem("token");

    try {
      const fetchPost = await fetch(`http://localhost:5678/api/works`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (fetchPost.ok) {
        const data = await fetchPost.json();
        console.log("Ajout réussi:", data);

        alert("Ajout du projet réussi!");
        await refreshGalleries();
        resetForm();
      }
    } catch (error) {
      lert("Une erreur s'est produite. Veuillez réessayer.");
      resetForm();
    }
  });
}

function resetForm() {
  const form = document.querySelector("#form-addwork");
  const buttonValidationForm = document.querySelector("#addwork-validation");
  const imgPreview = document.querySelector(".container-picture img");

  // Réinitialiser les champs du formulaire
  form.reset();

  // Effacer l'aperçu de l'image
  showFileElements();
  imgPreview.style.display = "none";

  // Désactiver le bouton "Valider" et retirer la classe 'valid'
  buttonValidationForm.classList.remove("valid");
  buttonValidationForm.disabled = true;
}

addWorkPost();
