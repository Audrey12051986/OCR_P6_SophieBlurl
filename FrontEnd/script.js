const filterContainer = document.querySelector(".filter_container");

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

// Function to display works
function displayWorks(works, container) {
  container.innerHTML = ""; // Clear the gallery

  works.forEach((work) => {
    const workElement = createWorkElement(work);
    container.appendChild(workElement);
  });
}

// Function to initialize the gallery
async function initGallery(sectionGallery) {
  const works = await fetchWorks();
  displayWorks(works, sectionGallery);
  setupFilters(works);
}

// Intialisation
const sectionGallery = document.querySelector(".gallery");
initGallery(sectionGallery);

// ****** Filters ****** //

// Function to setup filters
async function setupFilters(works) {
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
    return []; // In case of error, return an empty list
  }
}

// Function to create filter buttons
function categoryFilter(categories, filterContainer) {
  filterContainer.innerHTML = ""; // Clear previous buttons

  // Create "Tous" button
  const allButton = document.createElement("button");
  allButton.innerText = "Tous";
  allButton.className = "filter_btn filter_btn--active";
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
  button.className = "filter_btn";
  button.dataset.categoryId = category.id;
  filterContainer.appendChild(button);
}

// Function to add listeners to filter buttons
function addCategoryListener(works) {
  const buttons = document.querySelectorAll(".filter_btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter_btn").forEach((btn) => {
        btn.classList.remove("filter_btn--active");
      });
      button.classList.add("filter_btn--active");
      filterWorks(button.dataset.categoryId, works);
    });
  });
}

// Function to filter works based on category
function filterWorks(categoryId, works) {
  const sectionGallery = document.querySelector(".gallery"); // Use the correct selector
  const filteredWorks =
    categoryId === "0"
      ? works
      : works.filter((work) => work.category.id === parseInt(categoryId));
  displayWorks(filteredWorks, sectionGallery);
}

// ****** Admin Mode ****** //

function adminUserMode() {
  const token = sessionStorage.getItem("token");

  //Verification token presence and valid
  if (token && token.length === 143) {
    // Mask filters
    const filterElement = document.querySelector(".filter");
    if (filterElement) filterElement.style.display = "none";

    // Change longin en logout
    const logBtn = document.getElementById("logBtn");
    if (logBtn) logBtn.innerText = "Logout";

    // Create and insert admin menu
    const body = document.querySelector("body");
    const topMenu = document.createElement("div");
    topMenu.className = "topMenu";
    topMenu.innerHTML =
      '<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p><button>Publier les changements</button>';
    body.insertAdjacentElement("afterbegin", topMenu);

    // Add button "modifier"
    const editBtnHtml =
      '<p class="editBtn"><i class="fa-regular fa-pen-to-square"></i> Modifier</p>';
    const sectionsToEdit = [
      "#introduction img",
      "#introduction article",
      "#portfolio h2",
    ];
    sectionsToEdit.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) element.insertAdjacentHTML("afterend", editBtnHtml);
    });

    // Open modal with eventlistener
    const portfolioTitle = document.querySelector("#portfolio h2"); // Correction du sélecteur
    if (portfolioTitle) portfolioTitle.addEventListener("click", openModal);
  }
}

// ****** Modal ****** //

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector("#" + e.target.getAttribute("href"));
  target.style.display = "block";
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
};

document.querySelectorAll(".js_modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

//Open Modal if token is found
