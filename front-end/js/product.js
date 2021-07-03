//
/* CONSTANTE */
//

const id = getProductIdFromUrl();

//
/* VARIABLES */
//

/* [OBJET] Objet utilisé pour conserver les informations du produit (clés: _id, name, price, color, imageUrl) et de sélection du client (clés: color, quantity)*/
let product = {_id:"default",name:"default",price:0,color:"default",quantity:1, imageUrl:"default"};

let currentUnitPrice=0;

let currentQuantity=1;

//
/* APPEL de fonctions */
//

displayTeddy(id);
displayLinks();

//
/* EVENT LISTENER */
//

document.getElementById("quantityChoice").addEventListener('change', updateQuantity);
document.getElementById("colorChoice").addEventListener('change', updateColor);
document.getElementById("productForm").addEventListener('submit',function(e){
    e.preventDefault();
});
document.getElementById("addToCart").addEventListener('click', updateCart);

//
/* DEFINITIONS des fonctions */
//

/* FONCTION, sans paramètre, retournant l'identifiant du produit contenu dans l'URL. */
/* C'est au niveau de la page d'acceuil du site que l'URL avec l'identifiant est créé */
function getProductIdFromUrl(){
    const urlSearch = window.location.search.toString();

    const id = urlSearch.replace('?','');

    return id;
}

/* FONCTION, sans paramètre, affichant sur la page HTML la liste des liens vers les autres pages de produits */
/* Les informations sur les produits proviennent de la clé 'panel' du localStorage */
function displayLinks() {

    let panelNode = document.getElementById('panel');

    for (var i in JSON.parse(localStorage.getItem('panel'))) {
        let oneTeddy = JSON.parse(localStorage.getItem('panel'))[i];
        let lien = panelNode.appendChild(addHtmlElement('a', {href: "product.html" + "?" + oneTeddy._id }, 'list-group-item list-group-item-action text-center'));
        lien.textContent = oneTeddy.name;
    }
}

/* FONCTION d'affichage des informations du produit */
// Paramètres: 
//              - [STRING] ID du produit 
async function displayTeddy(id) {

    value = await getDataFromApi(url + '/' + id);

    currentUnitPrice = value.price;

    product["_id"] = value._id;
    product["name"] = value.name;
    product["price"] = value.price;
    product["imageUrl"] = value.imageUrl;

    document.title = "L'ours " + value.name + " par Orinoco";
    /* document.getElementById("main").removeChild(document.querySelector("h1")); */

    document.getElementById("figure-image").appendChild(addHtmlElement('img', { src: value.imageUrl }, 'img-fluid img-thumbnail figure-img'));
    document.getElementById("figure-image").appendChild(addHtmlElement('figcaption', { id: "figure-description" }, 'figure-caption bg-light text-dark'));

    for (let i in value.colors) {
        let option = document.getElementById("colorChoice").appendChild(addHtmlElement('option', { value: value.colors[i] },));
        option.textContent = value.colors[i];
    }

    document.getElementById('name').textContent = value.name;
    document.getElementById('figure-description').textContent = value.description;
    document.getElementById('price').textContent = displayPrice(value.price) + ' \u20AC';
    document.getElementById('totalPrice').textContent = displayPrice(value.price * document.getElementById("quantityChoice").value) + ' \u20AC';
    document.getElementById('_id').textContent = value._id;

}

/* Fonction de réaction à l'événement modificiaction de la quantité par l'utilisateur */
/* Réaction: 
            - conservation de la valeur affichée à 1 si l'utilisateur essaye d'insérer une valeur négative
            - affichage de la valeur maximale de 10 si l'utilisateur essaye de dépasser ce maximum
            - mise-à-jour de la variable currentQuantity et de l'information 'quantity' de l'objet PRODUCT
            - mise-à-jour du prix total affiché */
function updateQuantity(){

    let value = document.getElementById("quantityChoice").value;

    if (value < 0){
        document.getElementById("quantityChoice").value=1;
        currentQuantity=1;
    } 
    else if (value > 10){
        document.getElementById("quantityChoice").value=10;
        currentQuantity=10;
    } 
    else{
        currentQuantity=parseInt(value);
    }

    document.getElementById('totalPrice').textContent=displayPrice(currentUnitPrice*currentQuantity)+' \u20AC';
    product["quantity"]=currentQuantity;
}

/* Fonction de réaction à l'événement modificiaction du choix de couleur par l'utilisateur */
/* Réaction: changement de l'information 'color' de l'objet PRODUCT */
function updateColor(){

    let value = document.getElementById("colorChoice").value;

    product["color"]=value;
}

/* Fonction de réaction à l'événement CLICK du bouton d'ajout au panier */
/* Réaction: 
            - lancement d'une alerte si aucune couleur n'a été choisie pour le produit
            - stockage de la quantité d'articles dans le localStorage 
            - affichage de la nouvelle quantité pour le badge associé au panier dans le menu navigation 
            - ajout des informations du produit ajouté au panier dans le localStorage */
function updateCart(){

    if (product["color"] == 'default') {
        alert("Merci de choisir la couleur de votre ourson pour l'ajouter au panier");
    }
    else {

        let quantity;

        if (localStorage.getItem('numberOfArticles')) {

            quantity = currentQuantity + JSON.parse(localStorage.getItem('numberOfArticles'));
        }
        else {
            quantity = currentQuantity;
        }

        localStorage.setItem('numberOfArticles', JSON.stringify(quantity));
        displayNumberOfArticles();

        // Cas avec un panier déjà existant
        if (localStorage.getItem('cart')) {
            
            let productsTable = JSON.parse(localStorage.getItem('cart'));

            let teddyAlreadyInCart = 0;

            for (var i in productsTable) {
                // Si le produit (type et couleur) existe déjà dans le panier, mise-à-jour de la quantité
                if (productsTable[i].name == product.name && productsTable[i].color == product.color) {
                    
                    productsTable[i].quantity += product.quantity;
                    localStorage.setItem('cart', JSON.stringify(productsTable));

                    teddyAlreadyInCart = 1;
                }
            }

            // Si le produit (type et couleur) n'existe pas encore dans le panier, ajout du produit
            if (teddyAlreadyInCart == 0) {

                productsTable[productsTable.length] = product;
                localStorage.setItem('cart', JSON.stringify(productsTable));
            }  
        }

        // Cas du premier produit ajouté au panier
        else {
            localStorage.setItem('cart', JSON.stringify([product]));
        }
    }
}