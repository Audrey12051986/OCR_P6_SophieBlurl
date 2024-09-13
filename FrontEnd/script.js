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
adminUserMode();

// ****** Admin Mode ****** //

function adminUserMode() {
  const token = sessionStorage.getItem("token");

  if (token) {
    hideFilters();
    configureLogoutButton();
    createAdminMenu();
    addEditButtons();
    //attachEditButtonListeners();
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

/*function attachEditButtonListeners() {
  // Add event listeners for opening the modal
  const editButton = document.querySelector(".edit-button");
  if (editButton) {
    editButton.addEventListener("click", openGalleryModal);
  }
}*/

// ****** Modal ****** //

//Open modal gallery
// Définition de la fonction openGalleryModal
async function openGalleryModal() {
  const containerModals = document.querySelector(".container-modals");
  const galleryModal = document.querySelector(".modal-gallery");
  const addWorkModal = document.querySelector(".modal-addwork");
  const editButton = document.querySelector(".edit-button");

  // Vérifie si le bouton existe avant de lui ajouter l'événement
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
  const galleryModal = document.querySelector(".gallery-modal");

  const workElementModal = document.createElement("figure");
  workElementModal.dataset.category = work.category.name;
  workElementModal.dataset.id = work.id;

  const imageModal = document.createElement("img");
  imageModal.src = work.imageUrl;

  const spanTrash = document.createElement("span");
  spanTrash.classList.add("span-trash");

  const trash = document.createElement("i");
  trash.classList.add("fa-solid", "fa-trash-can");
  trash.id = work.id;

  spanTrash.appendChild(trash);
  workElementModal.appendChild(spanTrash);
  workElementModal.appendChild(imageModal);
  galleryModal.appendChild(workElementModal);

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

  trashAll.forEach((trash) => {
    trash.addEventListener("click", async (e) => {
      const workId = trash.id;
      const token = sessionStorage.getItem("token");

      if (!token) {
        console.error("Vous n'êtes pas autorisé à supprimer les éléments.");
        return;
      }

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
        throw new Error("Erreur lors de la suppression du travail.");
      }

      // Si la suppression est réussie, rafraîchir les galeries modale et globale
      await refreshGalleries();
    });
  });
}

deleteWorksModal();

async function refreshGalleries() {
  const sectionGallery = document.querySelector(".gallery");
  //const galleryModal = document.querySelector(".gallery-modal");

  await initGallery(sectionGallery);
  await displayWorksModal();
}

//Display modal addwork
function displayAddworkModal() {
  const addPictureButton = document.querySelector("#add-picture");
  const addWorkModal = document.querySelector(".modal-addwork");
  const galleryModal = document.querySelector(".modal-gallery");

  addPictureButton.addEventListener("click", () => {
    addWorkModal.style.display = "flex";
    galleryModal.style.display = "none";
  });
}

displayAddworkModal();

//Return from modal addWork to modal gallery
function returnModalGallery() {
  const arrowLeft = document.querySelector(".fa-arrow-left");
  const addWorkModal = document.querySelector(".modal-addwork");
  const galleryModal = document.querySelector(".modal-gallery");
  const containerModals = document.querySelector(".container-modals");

  arrowLeft.addEventListener("click", () => {
    containerModals.style.display = "flex";
    galleryModal.style.display = "flex";
    addWorkModal.style.display = "none";
  });
}

returnModalGallery();

//function closeAddworkModal
function closeAddWorkModal() {
  const xmarkAddWork = document.querySelector(".close-workmodal");
  const closeAddWorkModal = document.querySelector(".container-modals");

  xmarkAddWork.addEventListener("click", () => {
    closeAddWorkModal.style.display = "none";
  });
}

closeAddWorkModal();

// Sélection des éléments du DOM
//const previousImage = document.querySelector(".container-picture img");
//const inputFile = document.querySelector(".file-input");
//const labelFile = document.querySelector(".file-label");
//const iconFile = document.querySelector(".fa-image");
//const formatImage = document.querySelector(".container-picture p");

// Fonction pour mettre à jour la prévisualisation de l'image
/*function updateImagePreview(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    previousImage.src = e.target.result;
    previousImage.style.display = "flex";
  };
  reader.readAsDataURL(file);
}

// Fonction pour masquer les éléments liés au fichier
function hideFileElements() {
  labelFile.style.display = "none";
  iconFile.style.display = "none";
  formatImage.style.display = "none";
}

// Fonction principale appelée lors du changement de fichier
function handleFileChange() {
  const file = inputFile.files[0];
  if (file) {
    updateImagePreview(file);
    hideFileElements();
  }
}
*/
// Écouteur d'événement pour détecter le changement de fichier
//inputFile.addEventListener("change", handleFileChange);

//Creating a list of categories in select
/*async function categoriesListModal() {
  const selectModal = document.querySelector("#addwork-category");
  const categoryList = await fetchCategories();
  categoryList.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    selectModal.appendChild(option);
  });
}

categoriesListModal();
*/
//API method POST for add work

/*function addWorkPost() {
  const form = document.querySelector(".modal-addwork form");
  const titleWork = document.querySelector("#addwork-title");
  const categoryWork = document.querySelector("#addwork-category");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const token = sessionStorage.getItem("token");
    console.log("Token récupéré:", token);

    /*if (!token) {
      console.error("Vous n'êtes pas autorisé à ajouter des éléments.");
      return;
    }*/

/*const fetchPost = await fetch(`http://localhost:5678/api/works`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Utilise FormData directement
    });

    if (fetchPost.ok) {
      const data = await fetchPost.json();
      console.log("Ajout réussi:", data);
      await refreshGalleries();
    } else {
      console.error("Erreur lors de l'ajout de l'œuvre");
    }
  });
}

addWorkPost();
*/
