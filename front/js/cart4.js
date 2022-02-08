// RECUPERATION DES OBJETS DANS LOCALSTORAGE + DONNEES SUR SERVEUR + GENERATION DE PAGE AVEC CES DONNEES    
let cartQuantity = 0;
let cartPrice = 0;

let objectItemsArr = [];



for (let i=0; i<localStorage.length; i++){                                  // Je parcours chaque entree de localStorage

    let objectKey = localStorage.key(i);                                      //          Je recupere la cle de chaque entree dans objectKey               
//                                                                            objectItemsArr.push(JSON.parse(localStorage.getItem(localStorage.key(i))));    <==           Version courte               ==>>
    let objectItem = JSON.parse(localStorage.getItem(objectKey))            //      Je recupere l'entree qui correspond a la cle, la parse et la stocke dans objectItem       
    objectItemsArr.push(objectItem);                                    //          Je push objectItem dans objectItemArr pour stocker chaque entree du localStorage dans une variable
}

console.log(objectItemsArr)


fetch('http://localhost:3000/api/products/')
.then((res) => res.json())
.then((data) => {
    data.forEach(function(product){                                                 // Je parcours chaque objet du serveur

        for (let i =0; i<objectItemsArr.length; i++){                               // Je parcours chaque entree de objectItemsArr 

            if (objectItemsArr[i].id === product._id){                    // Je regarde si l'id de chaque entree de objectItemsArr correspond a l'id de l'objet parcouru sur le serveur

                objectItemsArr
                document
                .getElementById("cart__items")                              // Si ca correspond je genere une page
                .innerHTML += `
                    <article class="cart__item" data-id="${product._id}" data-color="${objectItemsArr[i].color}">                                       
                        <div class="cart__item__img">
                            <img src="${product.imageUrl}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${objectItemsArr[i].color}</p>
                                <p>${product.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : ${objectItemsArr[i].quantity}</p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="0" max="100" value="${objectItemsArr[i].quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article> -->
                `;                
            }
        }
    })    
});

//                                                          rmvObj permet de supprimer un produit ET de modifier la quantite/prix total en consequence
function rmvObj(e) {
    for (let x = 0; x<localStorage.length; x++){
        localStorageParse = JSON.parse(localStorage.getItem(localStorage.key(x)));
        
        if (localStorageParse.name == e.target.closest('article').querySelector('h2').textContent 
        && localStorageParse.color == e.target.closest('article').querySelector('.cart__item__content__description').querySelector('p').textContent){
            localStorage.removeItem(localStorage.key(x));

            cartQuantity -= localStorageParse.quantity;
            document.getElementById('totalQuantity').innerHTML = cartQuantity;

            cartPrice -= localStorageParse.quantity * localStorageParse.price;
            document.getElementById('totalPrice').innerHTML = cartPrice;

        }
    }
    e.target.closest('article').remove();
}


setTimeout(() =>{

//                                                                             Changement quantite 
    document.querySelector("#cart__items")
    .addEventListener('change', (e) => {
        e.target.previousElementSibling.innerHTML =  "Qté : " + e.target.value;

        //                                                         Suppression de l'objet (dom et localStorage) si quantity = 0 et affichage de la quantite totale      
        if (e.target.value == 0){
            rmvObj(e);
        }else {
//                                                           Sinon enregistrement de la nouvelle quantite dans localStorage et affichage de la quantite totale
            for (let x = 0; x<localStorage.length; x++){
                localStorageParse = JSON.parse(localStorage.getItem(localStorage.key(x)));
                
                if (localStorageParse.name == e.target.closest('article').querySelector('h2').textContent 
                && localStorageParse.color == e.target.closest('article').querySelector('.cart__item__content__description').querySelector('p').textContent){
                    cartQuantity += e.target.value - localStorageParse.quantity;
                    document.getElementById('totalQuantity').innerHTML = cartQuantity;
    
                    cartPrice += (e.target.value-localStorageParse.quantity) * localStorageParse.price
                    document.getElementById('totalPrice').innerHTML = cartPrice;
    
                    localStorageParse.quantity = e.target.value;                   
                    localStorage.setItem(localStorageParse.id + " " +localStorageParse.color, JSON.stringify(localStorageParse));                   
                }
            }
        } 
    });  
    
//                                                                              Bouton delete
    for (let i =0; i<localStorage.length; i++){
        document.getElementsByClassName('deleteItem')[i]
        .addEventListener('click', (e) =>{           
            rmvObj(e);
        });
    }
    
//                                                                             Affichage quantite 
    for (let i = 0; i<localStorage.length; i++){
        let quantityDOM = document.getElementsByClassName('itemQuantity')[i].value;
        cartQuantity += parseInt(quantityDOM);
        document.getElementById('totalQuantity').innerHTML = cartQuantity;


//                                                                             Affichage prix total
        priceDOM = document.getElementsByClassName('cart__item__content__description')[i].querySelector('p').nextElementSibling.textContent;
        cartPrice += parseInt(priceDOM) * quantityDOM;
        document.getElementById('totalPrice').innerHTML = cartPrice;
    }
}, 500);