//
/* CONSTANTES */
//

const url="http://localhost:3000/api/teddies";

//
/* APPEL de fonctions */
//

displayNumberOfArticles();

//
/* DEFINITIONS des fonctions */
//

/* FONCTION, sans paramètre, servant à afficher dans le menu de navigation le nombre d'articles sélectionnés par le client */
function displayNumberOfArticles(){
    
    if (localStorage.getItem('numberOfArticles')){
        console.log("Nombre d'articles à afficher:" + localStorage.getItem('numberOfArticles'));
        document.getElementById("nav-cart").innerHTML='Mes articles <i class="fas fa-shopping-cart"></i> <span class="badge bg-secondary">'+ JSON.parse(localStorage.getItem('numberOfArticles')) +'</span>';
    }
    else{
        console.log('Pas encore de panier');
        document.getElementById("nav-cart").innerHTML='Mes articles <i class="fas fa-shopping-cart"></i> <span class="badge bg-secondary">0</span>';
    }
    
}

/* FONCTION de création d'élément HTLM */
// Paramètres: 
//              - [STRING] nom de l'élément à créer. Exemple: ...
//              - [OBJET de STRING] paires nom de l'attribut et valeur(s) à attribuer à l'élément HTML créé 
//              - [STRING] classe(s) à attribuer à l'élément HTML créé 
function addHtmlElement(tagName, attributes, classes) {
    const element = document.createElement(tagName);

    for (var i in attributes) {
        element.setAttribute(i, attributes[i]);
    }

    element.className = classes;

    return element;
}