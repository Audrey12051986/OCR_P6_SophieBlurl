//upload works on page
async function getWorks() {
  try {
    //wait response
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des travaux");
    }

    //transformation response in JSON
    const works = await response.json();

    //section gallery in HTML
    const sectionGallery = document.querySelector(".gallery");
    // Empty the gallery before adding new works
    sectionGallery.innerHTML = "";

    //loop works and upload gallery

    for (let i = 0; i < works.length; i++) {
      const work = works[i];

      //create elements DOM
      const workElement = document.createElement("figure");
      workElement.dataset.category = work.category.name;
      workElement.dataset.id = work.id;

      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;
      const captionElement = document.createElement("figcaption");
      captionElement.innerText = work.title;

      // linking chilren elements to parent element
      workElement.appendChild(imageElement);
      workElement.appendChild(captionElement);
      sectionGallery.appendChild(workElement);
    }

    // Appel de la fonction pour générer les catégories
    getCategories(works);
    addCategoryListeners(works);
  } catch (error) {
    console.log("Erreur", error);
  }
}

// Adding filters of categories to filter work in the gallery

// Upload category filters on the page

function getCategories(works) {
  // Use a Set to create unique categories
  const categorySet = new Set();

  works.forEach((work) => {
    categorySet.add(work.category.name);
  });

  // option all categories
  const categories = Array.from(categorySet);
  categories.unshift("Tous");

  // selection element of DOM
  const filterContainer = document.querySelector(".filter_container");

  // Create button for every category
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.innerText = category;
    button.dataset.category = category;
    filterContainer.appendChild(button);
  });
}

// filter works

function filterWorks(category, works) {
  const sectionGallery = document.querySelector(".gallery");

  // Empty the gallery before adding new works
  sectionGallery.innerHTML = "";

  // Filter works by selected category
  const filsteredWorks =
    category === Tous
      ? works
      : works.filter((work) => work.category.name === category);

  // display filtered works
  filsteredWorks.forEach((work) => {
    const workElement = document.createElement("figure");
    workElement.dataset.category = work.category.name;
    workElement.dataset.id = work.id;

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const captionElement = document.createElement("figcaption");
    captionElement.innerText = work.title;

    // linking chilren elements to parent element
    workElement.appendChild(imageElement);
    workElement.appendChild(captionElement);
    sectionGallery.appendChild(workElement);
  });
}

//listener for every category buttons
function addCategoryListener(works) {
  const buttons = document.querySelector(".filter_container button");
  buttons.forEach((button) => {
    button.addEventLister("click", () => {
      filterWorks(button.dataset.category, works);
    });
  });
}

//function  getWorks call
getWorks();
