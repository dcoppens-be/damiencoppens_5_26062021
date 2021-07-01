//
/* CONSTANTES */
//

const maskNames = new RegExp('^[a-zçéè]{1,}(([ ]*|[-]?)?[a-zçéè]{1,})*$','i');
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
// displayTotalPrice doit être appelé aprés displayCart, qui calcule le prix total stocké dans la variable totalPrice
displayTotalPrice();

//
/* EVENT LISTENER */
//

/* Contrôle du comportement initial du formulaire*/
document.getElementById("productsList").addEventListener('click',deleteItem);
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
/* Les informations sur les produits proviennent de la clé 'cart' du localStorage */
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

        if (oneTeddy.name in colorsCheck) {

            colorsCheck[oneTeddy.name].push(oneTeddy.color);
            document.getElementById('figcaption-' + oneTeddy.name).innerHTML += "<span class=\"badge border\" style=\"background-color:" + coloring + ";\" id=\"badge-" + oneTeddy.name+oneTeddy.color + "\"> </span>";
        }
        else {

            document.getElementById('productsPicture').innerHTML +=
                "<div class=\"col\" id=\"figure-" + oneTeddy.name + "\"> <figure>"
                + "<img src=\"" + oneTeddy.imageUrl + "\" class=\"img-fluid img-thumbnail figure-img\""
                + "</figure> <figcaption class=\"text-white\" id=\"figcaption-" + oneTeddy.name + "\">" + oneTeddy.name + " <span class=\"badge border\" style=\"background-color:" + coloring + ";\" id=\"badge-" + oneTeddy.name+oneTeddy.color + "\"> </span></figcaption> </div>";

                colorsCheck[oneTeddy.name] = [oneTeddy.color];
            //colorsCheck[oneTeddy.name] = ["<span class=\"badge\" style=\"background-color:" + oneTeddy.color + ";\"> </span>"];
        }

        console.log(colorsCheck);


        totalPrice += oneTeddy.price * oneTeddy.quantity;

        for (let i = 0; i < oneTeddy.quantity; i++) {
            console.log(oneTeddy._id);
            products.push(oneTeddy._id);
            console.log(products);
        }
    }
}

/* FONCTION, sans paramètre, affichant le prix total des éléments du panier */
/* Le prix total est calculé dans la fonction displayCart */
function displayTotalPrice(){
    document.getElementById('cartPrice').textContent=displayPrice(totalPrice);
}


/* Fonction de réaction à chaque modification d'une entrée du formulaire, permettant de surveiller et de donner une indication à l'utilisateur sur le champ qu'il remplit */
// Paramètres: 
//          - [] masque RegExp
// Réaction: 
//          - modification de la classe du champ pour indiquer que l'entrée actuelle NE correspond PAS au modèle de la réponse attendue
//          - modification de la classe du champ pour indiquer que l'entrée actuelle correspond au modèle de la réponse attednue
function checkFormInput(id, mask) {

    // let mask = new RegExp('^[a-z]{1,}(([ ]*|[-]?)?[a-z]{1,})*$', 'i');

    // document.getElementById("cartForm").classList.remove("was-validated");

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
//          - communication avec l'API et accès à la page de confirmation */
function orderLaunch() {

    if (JSON.parse(localStorage.getItem('numberOfArticles')) == 0){
        alert("Merci d'ajouter au moins un produit au panier avant de lancer la commande. Choisissez votre ourson favoris et commandez-le. A tout de suite,");
    }
    else{

    

    if (document.getElementById("cartForm").checkValidity()) {
        console.log("Les entrées du formulaires sont correctes et peuvent être traitées");

        contact["firstName"] = document.getElementById("firstName").value;
        contact["lastName"] = document.getElementById("lastName").value;
        contact["address"] = document.getElementById("houseNumber").value + " " + document.getElementById("address").value + document.getElementById("addressInfo").value;
        contact["city"] = document.getElementById("zipCode").value + " " + document.getElementById("city").value;
        contact["email"] = document.getElementById("email").value;

        console.log(contact);

        fetch(url+'/'+'order',{
            method:'POST',
            headers:{'Accept':'application/json, text/plain, */*',
            'Content-type':'application/json'},
            body:JSON.stringify({"contact":contact,"products":products})
        })
            .then(function(response){
                if(response.ok){
                    return response.json();
                    }
                })
                .then(function(value){
                    console.log(value);
                    console.log(value.orderId);
                    localStorage.setItem('orderId', JSON.stringify(value.orderId));
                    localStorage.setItem('totalPrice',JSON.stringify(totalPrice));
                    window.location.href = 'confirmation.html';
                    //alert("Merci pour votre commande, La référence de celle-ci est " + JSON.parse(localStorage.getItem('orderId')) + " . Pour un montant de " + displayPrice(JSON.parse(localStorage.getItem('totalPrice'))));
                    emptyCart();
                })
                .catch(function(error){
                    alert("Problème de récupération des données");
                });
    }
    else {
        alert("Au moins une donnée du formulaire est invalide ou incomplète et ne permet pas l'envoi de la commmande. Merci de vérifier vos entrées,");
        console.log("Formulaire invalide");
    }
    document.getElementById("cartForm").classList.add("was-validated");
    }
    

};

function deleteItem(element){
    if (element.target.classList.contains('delete')){
        console.log(element.target.id)
        element.target.parentElement.parentElement.remove();

        totalPrice = 0;
        products=[];
        let newCart = [];

        for (var i in JSON.parse(localStorage.getItem('cart'))) {
            let oneTeddyType = JSON.parse(localStorage.getItem('cart'))[i];
            if (element.target.id==("btn-"+oneTeddyType.name+oneTeddyType.color)){
                let newQuantity = JSON.parse(localStorage.getItem('numberOfArticles'))-oneTeddyType.quantity;
                localStorage.setItem('numberOfArticles', JSON.stringify(newQuantity));
                displayNumberOfArticles();
                console.log(colorsCheck[oneTeddyType.name].length);
                if (colorsCheck[oneTeddyType.name].length==1){
                    document.getElementById('figure-' + oneTeddyType.name).remove();
                    colorsCheck[oneTeddyType.name]=[];
                }
                else{
                    document.getElementById("badge-" + oneTeddyType.name+oneTeddyType.color).remove();
                    colorsCheck[oneTeddyType.name].pop();
                }
            }
            else{
                newCart.push(oneTeddyType);
                totalPrice += oneTeddyType.price * oneTeddyType.quantity;
                for (let j = 0; j < oneTeddyType.quantity; j++) {
                    console.log(oneTeddyType._id);
                    products.push(oneTeddyType._id);
                    console.log(products);
                }
            }
        }

        console.log(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        displayTotalPrice();
    }

    
}