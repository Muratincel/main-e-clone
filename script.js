// ! fakestore API
const url = "https://fakestoreapi.com/products";

const urunler = document.querySelector(".urunler");
const writeOnScreen = (veri) => {
    urunler.innerHTML += `
    <div class="col-12 col-sm-6 col-lg-4 mb-2">
        <div class="card text-center">
            <img width="100px" height="250px" src="${veri.image}" class="card-img-top p-3" alt="...">
            <div class="card-body">
                <h5 class="card-title text-orange fw-bold fs-4">${veri.price}$</h5>
                <p class="card-text">${veri.title}</p>
                <div class="d-flex justify-content-center">
                    <a href="#" class="btn bg-grey addToCart me-2" data-id="${veri.id}">
                        <i class="fa-solid fa-cart-shopping"></i>
                        Add To Cart
                    </a>
                    <a href="#" class="btn bg-grey addToWishlist" data-id="${veri.id}">
                        <i class="fa-solid fa-heart"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
    `
}

// ! ADD TO CART ve WISHLIST butonlari icin

const cart = [];

document.addEventListener("DOMContentLoaded", function () {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            data.slice(0, 18).forEach(function (veri) {
                writeOnScreen(veri);
            });

            document.querySelectorAll('.addToCart').forEach(button => {
                button.addEventListener('click', function (event) {
                    const productId = event.target.closest('.addToCart').dataset.id;
                    const product = data.find(item => item.id == productId);
                    addToCart(product, event);
                });
            });

            document.querySelectorAll('.addToWishlist').forEach(button => {
                button.addEventListener('click', function (event) {
                    const productId = event.target.closest('.addToWishlist').dataset.id;
                    const product = data.find(item => item.id == productId);
                    addToWishlist(product, event);
                });
            });
        });
});


//! Add to Cart fonksiyonlari
function addToCart(product, event) {
    event.preventDefault();
    // urun sepetteyse kontrolu
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex === -1) {
        // sepette degilse, 1 olarak ekle
        cart.push({
            ...product,
            quantity: 1,
            totalPrice: product.price // ilk toplam fiyat = urun fiyati
        });
    }

    updateCartCount();
}

// basliktaki sayiyi guncelle
function updateCartCount() {
    document.getElementById('cartCount').innerText = cart.length;
}


// ! Urunleri modalda gosterme
document.getElementById('cartButton').addEventListener('click', function () {
    displayCartItems();
});


// ! Modal ici islemler
function displayCartItems() {
    const cartItemsContainer = document.querySelector('.modal-body ul'); 
    cartItemsContainer.innerHTML = '';

    let totalCartPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="mt-5 d-flex justify-content-center">Your cart is empty.</p>';
        document.getElementById('cartTotal').innerText = '0$';
        return;
    }

    cart.forEach((item, index) => {
        totalCartPrice += parseFloat(item.totalPrice); 

        cartItemsContainer.innerHTML += `
            <li class="modal-li list-unstyled">
                <div class="product-info">
                    <div class="foto d-flex justify-content-between align-items-center mt-3">
                        <img width="100px" height="100px" src="${item.image}" alt="">
                        <div class="head-of-product">${item.title}</div>
                        <div class="button-product">
                            <button class="btn btn-success increase me-2" data-index="${index}">+</button>
                            <span class="quantity mx-2">${item.quantity}</span>
                            <button class="btn btn-danger decrease ms-2" data-index="${index}">-</button>
                        </div>
                        <div class="price">${item.price}$</div>
                        <div class="total-price">${item.totalPrice}$</div>
                        
                        <i class="fa-solid fa-circle-xmark fs-3 removeItem" data-index="${index}"></i>
                    </div>
                </div>
            </li>
        `;
    });

    // Toplam fiyati gunceller
    document.getElementById('cartTotal').innerText = `${totalCartPrice.toFixed(2)}$`;

    // Urun kaldirma
    document.querySelectorAll('.removeItem').forEach(button => {
        button.addEventListener('click', function (event) {
            const itemIndex = event.target.dataset.index;
            removeFromCart(itemIndex);
        });
    });

    // Arttir azalt butonlari
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function (event) {
            const itemIndex = event.target.dataset.index;
            increaseQuantity(itemIndex);
        });
    });

    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function (event) {
            const itemIndex = event.target.dataset.index;
            decreaseQuantity(itemIndex);
        });
    });
}

// Urun arttirma fonksiyonu
function increaseQuantity(index) {
    cart[index].quantity++;
    cart[index].totalPrice = (cart[index].quantity * cart[index].price).toFixed(2);
    displayCartItems();
}

// Urun azaltma fonksiyonu
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        cart[index].totalPrice = (cart[index].quantity * cart[index].price).toFixed(2);
    }
    displayCartItems();
}

// Urun kaldirma fonksiyonu
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    displayCartItems();
}

// Tum urunleri sil
document.querySelector('.modal-footer .btn-clear').addEventListener('click', function () {
    clearCart();
});

function clearCart() {
    cart.length = 0; 
    updateCartCount(); 
    displayCartItems();
}


// ! Local storage kullanimi add to cart icin
document.querySelector('.modal-footer .btn-checkout').addEventListener('click', function () {
    localStorage.setItem('cart', JSON.stringify(cart)); 
    window.open('checkout.html', '_blank'); 
});


// ! 5 dk da bir Reklamlar :)
document.addEventListener("DOMContentLoaded", function () {
    // Reklam fonksiyonu
    function showAdvertisementModal() {
        const advertisementModal = new bootstrap.Modal(document.getElementById('advertisementModal'), {
            keyboard: true
        });
        advertisementModal.show();
    }

    // 5 dk da 1 goster fonksiyonu
    function scheduleModal() {
        setTimeout(function () {
            showAdvertisementModal();
            scheduleModal(); // gosterdikten sonra tekrar programlama
        }, 300000);
    }

    // sayfa yuklendiginde programla
    scheduleModal();
});


// ! Add to wishlist fonksiyonu (LOCAL STORAGE)
function addToWishlist(item, event) {
    event.preventDefault();
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || []; // wishlisti local storage dan cek YA DA bos bir array olarak baslat
    const existingItem = wishlist.find(wishlistItem => wishlistItem.id === item.id);

    if (!existingItem) {
        wishlist.push(item);
        localStorage.setItem('wishlist', JSON.stringify(wishlist)); // local storage a kaydet
        showNotification(`${item.title} has been added to your wishlist!`);
    } else {
        showNotification(`${item.title} is already in your wishlist!`);
    }

    updateWishlistCount();
}

// eklendi alerti goster (html sayfasinda yapildi tipi semali, 2 sn de kayboluyor)
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}


// ! Her ekledigimde wishlist guncelle
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCount = wishlist.length;
    const wishlistBadge = document.getElementById('wishlistCount');

    if (wishlistBadge) {
        wishlistBadge.innerText = wishlistCount;
    } else {
        const wishlistLink = document.querySelector('a[href="wishlist.html"]');
        if (wishlistLink) {
            const badge = document.createElement('span');
            badge.id = 'wishlistCount';
            badge.className = 'badge bg-primary rounded-pill';
            badge.innerText = wishlistCount;
            wishlistLink.appendChild(badge);
        }
    }
}

// Wishlist guncelleme fonksiyonunu cagir her sayfa yenilenmesinde
document.addEventListener("DOMContentLoaded", function () {
    localStorage.removeItem('wishlist'); // Sayfa her yuklendiginde wishlisti siler
    updateWishlistCount();
});


// ~~~~~~~~~~~~~~~~~~~~~~~~~~KENDIME NOTLAR~~~~~~~~~~~~~~~~~~~~~~~~

//!  bu yazilan kod ile urunleri modal a cekebiliyorsun, fakat sadece 1 item gosteriyor, ve 1 adet ekleyebiliyorsun. yapilmasi gerekenler:
//! oncelikle en iyisi fakestore api den urunleri cekmek
//! urunlerin hepsini sitede bastir (sitende sadece 3 tane elle cekilmis olan var)
//! remove from cart calismiyor onu incele
//! modal icin de + ve - butonlarini calistir, akabinde subtotali degistir
//! toplam sum u gosterecek footer ekle modal a sum subtotaller toplami
//! sepeti temizle butonu ekle modal a
//! check out yapinca yeni bir html sayfasina yonlendir simdilik (sonra duzenlersin)
//! check out sayfasinda add to chart a ekledigim urunler olacak, basit bir navbar, footer yok, sadece asagida bir pay butonu
// ^ sebebini buldum! script.js den checkout.html yi calistiramiyorsun cunku ERROR! var.. checkout console da verilen errorlara bak, onlari ayikla, (if, try-catch ya da window.location.pathname.includes(....) ile)
//! wishlist sayfasinda eklenen urunler (local storage)
//! add-to-wishlist sinifina ctrl-f ile buna bak, etkilemiyorsa sil
//! urunleri modaldaki liste halinde getir, sadece add to cart butonu olacak sekilde. diger tum website yerli yerinde duracak
//! sacma sapan alertler var onlari duzenle
//! sonra contact sayfasi var, content degistir ve ozgun birsey yap
//! login sayfasi var, ozgun bir login sayfasi, sade, (back end de devam)
//! cart ve deneme sayfasini sil. 5 sayfayla kal
// renk degistir, ufak dokunuslar
// video izle eksik varsa ekle
//^ zaman kalirsa search butonunu fonskiyonel yapabilirsin..

