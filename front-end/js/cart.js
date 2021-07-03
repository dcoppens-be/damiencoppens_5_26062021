//
/* CONSTANTES */
//

const maskNames = new RegExp('^[a-zçéè]{1,}(([ ]*|[-\']?)?[a-zçéè]{1,})*$','i');
const maskEmail = new RegExp('^[ ]*[a-z0-9_\.\-]+@{1}[a-z0-9_\.\-]{2,}\.[a-z]{2,4}[ ]*$');
const maskNumber = new RegExp('^[0-9]{1,6}$');
const maskFrechZipCode = new RegExp('^[0-9]{5}$');

//
/* VARIABLES */
//

/* [OBJET] Objet utilisé pour conserver les coordonnées du client (clés: firstName, lastName, address, city, email)*/
let contact={firstName:'.',lastName:'.',address:'..',city:'.',email:'a1.2-3_4@bc.de'};
let products=[];
let totalPrice=0;
let colorsCheck={};

//
/* APPEL de fonctions */
//

displayCart();
// La fonction displayCart réalise également le calcul du prix total stocké dans la variable totalPrice
// L'appel de la fonction displayTotalPrice doit donc être réalisé aprés l'exécution de la fonction displayCart
displayTotalPrice();

//
/* EVENT LISTENER */
//

document.getElementById("productsList").addEventListener('click',deleteItem);
/* Contrôle du comportement initial du formulaire */
document.getElementById("cartForm").addEventListener('submit',function(e){
    e.preventDefault();
})
document.getElementById("firstName").addEventListener('input', function(){checkFormInput("firstName", maskNames)});
document.getElementById("lastName").addEventListener('input', function(){checkFormInput("lastName", maskNames)});
document.getElementById("address").addEventListener('input', function(){checkFormInput("address", maskNames)});
document.getElementById("houseNumber").addEventListener('input', function(){checkFormInput("houseNumber", maskNumber)});
//
document.getElementById("city").addEventListener('input', function(){checkFormInput("city", maskNames)});
document.getElementById("zipCode").addEventListener('input', function(){checkFormInput("zipCode", maskFrechZipCode)});
document.getElementById("email").addEventListener('input', function(){checkFormInput("email", maskEmail)});

document.getElementById("order").addEventListener('click', orderLaunch);

//
/* DEFINITIONS des fonctions */
//

/* FONCTION, sans paramètre, affichant dans un tableau sur la page HTML la synthèse des produits sélectionnés par le client */
// Les informations sur les produits proviennent de la clé 'cart' du localStorage
function displayCart() {

    for (var i in JSON.parse(localStorage.getItem('cart'))) {
        let oneTeddy = JSON.parse(localStorage.getItem('cart'))[i];

        document.getElementById('productsList').innerHTML +=
            "<tr>"
            + "<td>" + oneTeddy.name + "</td>"
            + "<td class=\"text-center\">" + oneTeddy.color + "</td>"
            + "<td class=\"d-none d-md-table-cell text-center\">" + displayPrice(oneTeddy.price) + "</td>"
            + "<td class=\"text-center\">" + oneTeddy.quantity + "</td>"
            + "<td class=\"d-none d-sm-table-cell\">" + displayPrice(oneTeddy.price * oneTeddy.quantity) + "</td>"
            + "<td>" + "<button id=\"btn-"+ oneTeddy.name+oneTeddy.color +"\" type=\"button\" class=\"btn btn-danger delete\">X</button>" + "</td>"
            + "</tr>";

        let coloring;

        switch (oneTeddy.color) {
            case 'Dark brown':
                coloring = "Saddlebrown";
                break;
            case 'Pale brown':
                coloring = "Burlywood";
                break;
            default:
                coloring = oneTeddy.color;
        }

        /* Affichage en images du panier */
        // Cas d'un ourson dont l'image est déjà affichée sour le tableau récapitulatif du panier avec ajout de la nouvelle couleur
        if (oneTeddy.name in colorsCheck) {

            colorsCheck[oneTeddy.name].push(oneTeddy.color);
            document.getElementById('figcaption-' + oneTeddy.name).innerHTML += "<span class=\"badge border\" style=\"background-color:" + coloring + ";\" id=\"badge-" + oneTeddy.name+oneTeddy.color + "\"> </span>";
        }
        // Ourson dont l'image doit être ajoutée
        else {

            document.getElementById('productsPicture').innerHTML +=
                "<div class=\"col\" id=\"figure-" + oneTeddy.name + "\"> <figure>"
                + "<img src=\"" + oneTeddy.imageUrl + "\" class=\"img-fluid img-thumbnail figure-img\""
                + "</figure> <figcaption class=\"text-white\" id=\"figcaption-" + oneTeddy.name + "\">" + oneTeddy.name + " <span class=\"badge border\" style=\"background-color:" + coloring + ";\" id=\"badge-" + oneTeddy.name+oneTeddy.color + "\"> </span></figcaption> </div>";

                colorsCheck[oneTeddy.name] = [oneTeddy.color];
        }

        totalPrice += oneTeddy.price * oneTeddy.quantity;

        // Création du tableau de produits pour envoi à l'API
        for (let i = 0; i < oneTeddy.quantity; i++) {
            products.push(oneTeddy._id);
        }
    }
}

/* FONCTION, sans paramètre, affichant le prix total des éléments du panier */
// Le prix total est calculé dans la fonction displayCart
function displayTotalPrice(){
    document.getElementById('cartPrice').textContent=displayPrice(totalPrice);
}

/* Fonction de réaction à chaque modification d'une entrée du formulaire, permettant de surveiller et de donner une indication à l'utilisateur sur le champ qu'il remplit */
// Paramètres: 
//          - [STRING] id de l'entrée du formulaire
//          - [] masque RegExp
// Réaction: 
//          - si correspondance de l'entrée avec le masque, modification de la classe du champ pour indiquer que l'entrée actuelle correspond au modèle de la réponse attednue
//          - dans le cas contraire, modification de la classe du champ pour indiquer que l'entrée actuelle NE correspond PAS au modèle de la réponse attendue
function checkFormInput(id, mask) {

    let value = document.getElementById(id).value;

    if (mask.test(value)) {
        document.getElementById(id).classList.remove("bg-warning");
        document.getElementById(id).classList.add("bg-success");
    }
    else {
        document.getElementById(id).classList.remove("bg-success");
        document.getElementById(id).classList.add("bg-warning");
    }
}

/* Fonction de réaction à l'événement CLICK du bouton d'envoi de la commande */
// Réaction: 
//          - vérification que tous les champs obligatoires ont été remplis par l'utilisateur
//          - traitement des entrées de l'utilisateur et sauvegarde dans l'objet contact au format attendu par l'API
//          - traitement du contenu de la commande et sauvegarde dans le tableau products au format attendu par l'API
//          - communication avec l'API et accès à la page de confirmation
function orderLaunch() {

    // Si le panier est vide
    if (products.length == 0) { // if (!localStorage.getItem('numberOfArticles') || JSON.parse(localStorage.getItem('numberOfArticles')) == 0){
        alert("Merci d'ajouter au moins un produit au panier avant de lancer la commande. Choisissez votre ourson favoris et commandez-le. A tout de suite,");
    }
    // S'il y a au moins un produit dans le panier
    else {
        // Cas du formulaire bien rempli
        if (document.getElementById("cartForm").checkValidity()) {
            
            contact["firstName"] = document.getElementById("firstName").value;
            contact["lastName"] = document.getElementById("lastName").value;
            contact["address"] = document.getElementById("houseNumber").value + " " + document.getElementById("address").value + document.getElementById("addressInfo").value;
            contact["city"] = document.getElementById("zipCode").value + " " + document.getElementById("city").value;
            contact["email"] = document.getElementById("email").value;

            fetch(url + '/' + 'order', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ "contact": contact, "products": products })
            })
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then(function (value) {
                    console.log(value);
                    console.log(value.orderId);
                    localStorage.setItem('orderId', JSON.stringify(value.orderId));
                    localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
                    emptyCart();
                    window.location.href = 'confirmation.html';
                })
                .catch(function (error) {
                    alert("Problème de récupération des données");
                });
        }
        // Formulaire invalide
        else {
            alert("Au moins une donnée du formulaire est invalide ou incomplète et ne permet pas l'envoi de la commmande. Merci de vérifier vos entrées,");
        }
        document.getElementById("cartForm").classList.add("was-validated");
    }
}

/* Fonction de réaction à l'événement CLICK dans le tableau récapitulatif du panier */
// Paramètres: 
//          - [] élément cliqué
// Réaction si l'élément cliqué est un bouton de suppression de l'élément avec la classe DELETE: 
//          - suppression de la ligne du tableau
//          - mise à jour du nombre d'articles et du contenu du panier dans le localStorage
//          - mise à jour des éléments affichés: nombre d'articles dans le panier et articles affichés en images
function deleteItem(element){

    // Si clic sur un bouton de suppression d'élément
    if (element.target.classList.contains('delete')){
        
        element.target.parentElement.parentElement.remove();

        totalPrice = 0;
        products=[];
        let newCart = [];

        // Parcourir le tableau de produits du panier CART, conservé dans le localStorage, pour le mettre à jour et enlever l'élément supprimé du panier en images
        for (var i in JSON.parse(localStorage.getItem('cart'))) {

            let oneTeddyType = JSON.parse(localStorage.getItem('cart'))[i];

            // Cas de la ligne produit à suprimer
            if (element.target.id==("btn-"+oneTeddyType.name+oneTeddyType.color)){

                // Mise-à-jour de la quantité d'articles et de son affichage
                let newQuantity = JSON.parse(localStorage.getItem('numberOfArticles'))-oneTeddyType.quantity;
                localStorage.setItem('numberOfArticles', JSON.stringify(newQuantity));
                displayNumberOfArticles();

                // Gestion du récapitulatif du panier en images
                if (colorsCheck[oneTeddyType.name].length==1){
                    document.getElementById('figure-' + oneTeddyType.name).remove();
                    colorsCheck[oneTeddyType.name]=[];
                }
                else{
                    document.getElementById("badge-" + oneTeddyType.name+oneTeddyType.color).remove();
                    colorsCheck[oneTeddyType.name].pop();
                }
            }
            // Cas de produit conservé dans le panier
            else{
                newCart.push(oneTeddyType);
                totalPrice += oneTeddyType.price * oneTeddyType.quantity;
                for (let j = 0; j < oneTeddyType.quantity; j++) {
                    products.push(oneTeddyType._id);
                }
            }
        }

        // Mise-à-jour du tableau de produits du panier CART dans le localStorage
        localStorage.setItem('cart', JSON.stringify(newCart));
        // Affichage du prix mis-à-jour
        displayTotalPrice();
    }    
}