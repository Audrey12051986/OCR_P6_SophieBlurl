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
  const filterContainer = document.querySelector(".filter_container");
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
  const sectionGallery = document.querySelector(".gallery");
  const filteredWorks = works.filter((work) =>
    categoryId === "0" ? true : work.category.id === parseInt(categoryId)
  );
  displayWorks(filteredWorks, sectionGallery);
  console.log(filteredWorks); // Debugging output to check the filtered works
}

// Intialisation
const sectionGallery = document.querySelector(".gallery");
initGallery(sectionGallery);

// ****** Admin Mode ****** //

function adminUserMode() {
  const token = sessionStorage.getItem("token");

  //Verification token presence and valid
  if (token && token.length === 143) {
    // Mask filters
    const filterElement = document.querySelector(".filter_container");
    if (filterElement) filterElement.style.display = "none";

    // Change longin en logout
    const logBtn = document.querySelector("nav ul li:nth-child(3) a");
    if (logBtn) {
      logBtn.innerText = "Logout";
      logBtn.className = "link_header link_active";
      logBtn.addEventListener("click", () => {
        sessionStorage.removeItem("token");
        window.location.reload();
      });
    }

    // Create and insert admin menu
    const body = document.querySelector("body");
    const topMenu = document.createElement("div");
    topMenu.className = "topMenu";
    topMenu.innerHTML =
      '<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>';
    body.insertAdjacentElement("afterbegin", topMenu);

    // Add button "modifier"
    const sectionsToEdit = ["#portfolio h2"];
    sectionsToEdit.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        const editBtn = document.createElement("button");
        editBtn.className = "edit_btn";
        editBtn.innerHTML =
          '<i class="fa-regular fa-pen-to-square"></i> modifier';
        element.insertAdjacentElement("afterend", editBtn);
      }
    });

    // Open modal with eventlistener
    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach((btn) => {
      btn.addEventListener("click", openModal);
    });
  }
}

// Call function adminUserMode
adminUserMode();

// ****** Modal ****** //

function openModal(event) {
  event.preventDefault(); // Prevents default behavior of link or button
  const modal = document.getElementById("modal1");
  if (modal) {
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
  }
}

function closeModal() {
  const modal = document.getElementById("modal1");
  if (modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");
  }
}

// Added event listener for edit buttons
const editButtons = document.querySelectorAll(".edit_btn");
editButtons.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

// Close the modal by clicking outside the content area
document.getElementById("modal1").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal1")) {
    closeModal();
  }
});
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
document.getElementById("addPictureBtn").addEventListener("click", async () => {
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

//Open Modal if token is found
*/
