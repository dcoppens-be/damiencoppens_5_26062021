
//
/* VARIABLE */
//

/* [TABLEAU] Tableau listant les produits [OBJET avec les clés '_id' et 'name'] */
let arrayOfTopProducts=[];

//
/* APPEL de fonctions */
//

displayProducts(document.getElementById('products'));

//
/* DEFINITIONS des fonctions */
//

/* Fonction de création d'une carte produit */
// Paramètres: 
//                - [NODE] noeud du parent où la carte doit être ajoutée
//                - [STRING] nom du produit. Exemple: ...
//                - [STRING] chemin de l'image
//                - [STRING] description 
//                - [STRING] lien pour le bouton
/* Utilisation de la fonction addHtmlElement défénie dans functions.js */

function newCard(product) {
    let column = addHtmlElement('div',{},'col mb-4');

    let card = column.appendChild(addHtmlElement('div',{},'card g-2 h-100'));
    card.appendChild(addHtmlElement('img', {src: product.imageUrl, style: "object-fit:cover;" }, 'card-img-top h-50'));
    
    let cardTitle = card.appendChild(addHtmlElement('h3',{},'card-header text-center'));
    cardTitle.textContent = product.name;

    let cardBody = card.appendChild(addHtmlElement('div',{},'card-body'));
    
    let cardDescription = cardBody.appendChild(addHtmlElement('p',{}, 'card-text text-justify'));
    cardDescription.textContent = product.description;

    let cardLink = cardBody.appendChild(addHtmlElement('a', {role: 'button', href: "product.html"+"?"+product._id }, 'btn btn-primary stretched-link'));
    cardLink.textContent = "Détails du produit";

    let cardFooter = card.appendChild(addHtmlElement('div',{}, 'card-footer'));
    cardFooter.textContent = product._id;

    return column;
}

/* FONCTION d'affichage des cartes produits et de création d'un tableau de produit, dont les données sont utilisée sur la page product.html*/
// Paramètres: 
//              - [NODE] noeud HTML où doivent être ajoutées les cartes-produits 
async function displayProducts(parentNode){
    
    data = await getDataFromApi(url);

    for(let i in data){
        parentNode.appendChild(newCard(data[i]));
        arrayOfTopProducts[i]={_id:data[i]._id, name:data[i].name};
    }
    localStorage.setItem('panel',JSON.stringify(arrayOfTopProducts));
}