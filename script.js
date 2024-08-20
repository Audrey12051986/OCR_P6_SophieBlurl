//upload works on page
async function getWorks() {
  try {
    //wait reponse
    const reponse = await fetch("http://localhost:5678/api/works");

    if (!reponse.ok) {
      throw new Error("Erreur lors de la récupération des travaux");
    }

    //transformation response in JSON
    const works = await reponse.json();

    //section gallery in HTML
    const sectionGallery = document.querySelector(".gallery");

    //loop works and upload gallery

    for (let i = 0; i < works.length; i++) {
      const work = works[i];

      //create elements DOM
      const workElement = document.createElement("figure");
      workElement.dataset.category = work.category.name;
      workElement.dataset.id = work.id;

      const imageElement = document.createElement("img");
      imageElement.src = work.imageURL;
      const captionElement = document.createElement("figcaption");
      captionElement.innerText = work.title;

      // linking chilren elements to parent element
      workElement.appendChild(imageElement);
      workElement.appendChild(captionElement);
      sectionGallery.appendChild(workElement);
    }
  } catch (error) {
    console.log("Erreur", error);
  }
}

getWorks();
