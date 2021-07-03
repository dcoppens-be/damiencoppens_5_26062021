//
/* CONSTANTES */
//

const url="http://localhost:3000/api/teddies";

//
/* APPEL de fonctions */
//

displayNumberOfArticles();

//
/* EVENT LISTENER */
//

document.getElementById('cross').addEventListener('click',emptyCart);

//
/* DEFINITIONS des fonctions */
//

/* FONCTION communiquant avec l'API pour récupérer des données avec la méthode GET */
// Paramètres: 
//              - [STRING] url de l'API 
function getDataFromApi(url) {
    return fetch(url, { method: 'GET' })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function(data){
            return data;
        })
        .catch(function(error){
            alert("Problème de récupération de données depuis l'API");
        })
}

/* FONCTION, sans paramètre, servant à afficher dans le menu de navigation le nombre d'articles sélectionnés par le client */
function displayNumberOfArticles(){
    
    let cartNode = document.getElementById("nav-cart");

    if (localStorage.getItem('numberOfArticles')){
        cartNode.innerHTML='Mes articles <i class="fas fa-shopping-cart"></i> <span class="badge bg-secondary">'+ JSON.parse(localStorage.getItem('numberOfArticles')) +'</span>';
    }
    else{
        cartNode.innerHTML='Mes articles <i class="fas fa-shopping-cart"></i> <span class="badge bg-secondary">0</span>';
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

/* FONCTION de transformation d'un prix en centimes à un prix en unité avec 2 chiffres après la virgule */
// Paramètre: [NOMBRE] Prix en centimes
function displayPrice(priceInCents) {
    let price = priceInCents / 100;
    return price.toFixed(2).replace('.', ',');
}

/* FONCTION permettant de réinitialiser le panier d'articles sélectionné par le client */
function emptyCart(){
    localStorage.removeItem('numberOfArticles');
    localStorage.removeItem('cart');
    displayNumberOfArticles();
}