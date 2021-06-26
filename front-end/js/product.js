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

displayLinks();
getTeddyFromApi();

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
        let lien = panelNode.appendChild(addHtmlElement('a', {href: "product.html" + "?" + oneTeddy._id }, 'list-group-item list-group-item-action'));
        lien.textContent = oneTeddy.name;
    }

}

/* FONCTION communiquant avec l'API pour récupérer les données du produit dont l'identifiant est spécifié dans l'URL */
// Paramètres: 
//              - [STRING] url de l'API avec l'identifiant du produit
function getTeddyFromApi() {
    
    fetch(url + '/' + id, { method: 'GET' })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (value) {
            
            currentUnitPrice = value.price;

            product["_id"] = value._id;
            product["name"] = value.name;
            product["price"] = value.price;
            product["imageUrl"] = value.imageUrl;

            document.title = "L'ours " + value.name + " par Orinoco";
            /* document.getElementById("main").removeChild(document.querySelector("h1")); */

            document.getElementById("figure-image").appendChild(addHtmlElement('img', { src: value.imageUrl}, 'img-fluid img-thumbnail figure-img'));

            for (let i in value.colors) {
                let option = document.getElementById("colorChoice").appendChild(addHtmlElement('option', { value: value.colors[i] },));
                option.textContent = value.colors[i];
            }

            document.getElementById('name').textContent = value.name;
            document.getElementById('figure-description').textContent = value.description;
            document.getElementById('price').textContent = displayPrice(value.price) + ' \u20AC';
            document.getElementById('totalPrice').textContent = displayPrice(value.price * document.getElementById("quantityChoice").value) + ' \u20AC';
            document.getElementById('_id').textContent = value._id;

        })
        .catch(function (error) {
            alert("Problème de récupération des données du produit depuis l'API");
        });

}

/* Fonction de réaction à l'événement modificiaction de la quantité par l'utilisateur */
/* Réaction: 
            - conservation de la valeur affichée à 0 si l'utilisateur essaye d'insérer une valeur négative
            - changement de l'item currentProductQuantity dans le localStorage */
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
    console.log(product);
}

/* Fonction de réaction à l'événement modificiaction du choix de couleur par l'utilisateur */
/* Réaction: changement de l'item COLOR dans le localStorage*/
function updateColor(){

    let value = document.getElementById("colorChoice").value;

    console.log(product);
    product["color"]=value;
    console.log(product);
}

/* Fonction de réaction à l'événement CLICK du bouton d'ajout au panier */
/* Réaction: 
            - conservation de la valeur affichée à 0 si l'utilisateur essaye d'insérer une valeur négative
            - mise à jour de la quantité d'articles dans le localStorage 
            - affichage de la nouvelle quantité pour le badge associé au panier dans le menu navigation */
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

        if (localStorage.getItem('cart')) {
            console.log('Produit additionnel ajouté au panier')
            console.log(product);
            let productsTable = JSON.parse(localStorage.getItem('cart'));

            let cartCheck = 0;

            for (var i in productsTable) {
                if (productsTable[i].name == product.name && productsTable[i].color == product.color) {
                    
                    console.log('Ce produit existe déjà dans le panier');
                    console.log(typeof JSON.parse(localStorage.getItem('cart'))[i].quantity);
                    console.log(typeof product.quantity);
                    productsTable[i].quantity += product.quantity;
                    localStorage.setItem('cart', JSON.stringify(productsTable));

                    cartCheck = 1;
                }
            }

            if (cartCheck == 0) {

                productsTable[productsTable.length] = product;
                localStorage.setItem('cart', JSON.stringify(productsTable));
                console.log(localStorage.getItem('cart'));
                console.log(JSON.parse(localStorage.getItem('cart')));
            }
            
        }
        else {
            console.log('Premier produit ajouté au panier')
            console.log(product);
            localStorage.setItem('cart', JSON.stringify([product]));
            console.log(localStorage.getItem('cart'));
            console.log(JSON.parse(localStorage.getItem('cart')));
        }

    }

    console.log(localStorage.getItem('cart'));

};