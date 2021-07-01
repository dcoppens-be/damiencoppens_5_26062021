
document.getElementById("confirmation-title").textContent = "Merci pour votre commande,"

let confirmation = document.getElementById("confirmation-message");

confirmation.innerHTML = "La référence de votre commande, d'un montant de " + displayPrice(JSON.parse(localStorage.getItem('totalPrice'))) +  " &#8364 : <br> <strong>" + " " + JSON.parse(localStorage.getItem('orderId')) + "</strong>";
