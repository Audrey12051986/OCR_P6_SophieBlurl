const sectionGallery = document.querySelector(".gallery");
const filterContainer = document.querySelector(".filter_container");
let listCategories = [];

// ****** Gallery ****** //

// Function to fetch and display works
async function getWorks() {
  sectionGallery.innerHTML = ""; // Clear the gallery

  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des travaux");

    const works = await response.json();
    displayWorks(works);
    setupFilters(works);
  } catch (error) {
    console.error("Erreur", error);
  }
}

// Function to display works
function displayWorks(works) {
  works.forEach((work) => {
    const workElement = createWorkElement(work);
    sectionGallery.appendChild(workElement);
  });
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

// ****** Filters ****** //

// Function to setup filters
function setupFilters(works) {
  const categories = getCategories(works);
  categoryFilter(categories, filterContainer);
  addCategoryListener(works);
}

// Function to get unique categories from works
function getCategories(works) {
  const categorySet = new Set();
  works.forEach((work) => {
    categorySet.add(work.category.name);
  });
  return Array.from(categorySet);
}

// Function to create filter buttons
function categoryFilter(categories, filterContainer) {
  const allButton = document.createElement("button");
  allButton.innerText = "Tous";
  allButton.className = "filterButton";
  allButton.dataset.category = "Tous";
  filterContainer.appendChild(allButton);

  categories.forEach((category) => {
    createButtonFilter(category, filterContainer);
  });
}

// Function to create a single filter button
function createButtonFilter(category, filterContainer) {
  const button = document.createElement("button");
  button.innerText = category;
  button.className = "filterButton";
  button.dataset.category = category;
  filterContainer.appendChild(button);
}

// Function to add listeners to filter buttons
function addCategoryListener(works) {
  const buttons = document.querySelectorAll(".filterButton");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      filterWorks(button.dataset.category, works);
    });
  });
}

// Function to filter works based on category
function filterWorks(category, works) {
  sectionGallery.innerHTML = ""; // Clear current gallery
  const filteredWorks =
    category === "Tous"
      ? works
      : works.filter((work) => work.category.name === category);
  displayWorks(filteredWorks);
}

// Call the function to fetch and display works
getWorks();

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
