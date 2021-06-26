//
/* CONSTANTES */
//

const maskNames = new RegExp('^[a-zçéè]{1,}(([ ]*|[-]?)?[a-zçéè]{1,})*$','i');
const maskEmail = new RegExp('^[ ]*[a-z0-9_\.\-]+@{1}[a-z0-9_\.\-]{2,}\.[a-z]{2,4}[ ]*$');
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
document.getElementById("cartForm").addEventListener('submit',function(e){
    e.preventDefault();
})
document.getElementById("firstName").addEventListener('input', function(){checkFormInput("firstName", maskNames)});
document.getElementById("lastName").addEventListener('input', function(){checkFormInput("lastName", maskNames)});
document.getElementById("address").addEventListener('input', function(){checkFormInput("address", maskNames)});

document.getElementById("city").addEventListener('input', function(){checkFormInput("city", maskNames)});
document.getElementById("zipCode").addEventListener('input', function(){checkFormInput("zipCode", maskFrechZipCode)});
document.getElementById("email").addEventListener('input', function(){checkFormInput("email", maskEmail)});

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
            + "<td>" + oneTeddy.color + "</td>"
            + "<td class=\"d-none d-md-block\">" + displayPrice(oneTeddy.price) + "</td>"
            + "<td>" + oneTeddy.quantity + "</td>"
            + "<td class=\"d-none d-sm-block\">" + displayPrice(oneTeddy.price * oneTeddy.quantity) + "</td>"
            + "<td>" + "<button id=\"\" type=\"button\" class=\"btn btn-danger\">X</button>" + "</td>"
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
            document.getElementById('figcaption-' + oneTeddy.name).innerHTML += "<span class=\"badge border\" style=\"background-color:" + coloring + ";\"> </span>";
        }
        else {

            document.getElementById('productsPicture').innerHTML +=
                "<div class=\"col\"> <figure>"
                + "<img src=\"" + oneTeddy.imageUrl + "\" class=\"img-fluid img-thumbnail figure-img\""
                + "</figure> <figcaption class=\"text-white\" id=\"figcaption-" + oneTeddy.name + "\">" + oneTeddy.name + " <span class=\"badge border\" style=\"background-color:" + coloring + ";\"> </span></figcaption> </div>";

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
//          - modification de la classe du champ pour indiquer que l'entrée actuelle correspond au modèle de la réponse attednue */
function checkFormInput(id, mask) {

    // let mask = new RegExp('^[a-z]{1,}(([ ]*|[-]?)?[a-z]{1,})*$', 'i');

    document.getElementById("cartForm").classList.remove("was-validated");

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