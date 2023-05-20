"use strict";

const ORDER_STORAGE_NAME = 'order';

(async () => {

// General global variable
const body = document.body;

// Get book's collection
let response = await fetch('./books.json');
let books = await response.json();

// Add id atributes for books
let booksWithId = books.map((item, i) => ({...item, id: i + 1}));

let bookCatalogMap = new Map();

for (let i = 0; i < booksWithId.length; i++) {
    bookCatalogMap.set(booksWithId[i].id, booksWithId[i]);
}


// Create element
function createElem(parentElem, tagName, className = '', textContent) {
    const newElem = document.createElement(tagName);
    if (Array.isArray(className)) {
        className.forEach(item => newElem.classList.add(item))
    } else if (className) {
        newElem.classList.add(className);
    }
    newElem.innerHTML = textContent;
    parentElem.append(newElem);
    return newElem;
}

// Create frame's elements
function createFrameElem() {
    const fragment = new DocumentFragment();

    // Header
    const headerElem = createElem(fragment, 'header', 'header', '');
    const containerHeaderElem = createElem(headerElem, 'div', 'container', '');
    const headerInnerElem = createElem(containerHeaderElem, 'div', 'header__inner', '');

    const headerLogo = createElem(headerInnerElem, 'a', 'header__logo', '');
    headerLogo.setAttribute('href', '#');

    const logoElem = createElem(headerLogo, 'img', '', '');
    logoElem.setAttribute('src', 'assets/images/book-shop-logo.png');
    logoElem.setAttribute('alt', 'book-shop-logo');

    const headerTextElem = createElem(headerInnerElem, 'div', 'header__text', '');
    const headerTitleElem = createElem(headerTextElem, 'h1', 'header__title', 'Welcome to Book-shop');

    const headerCartElem = createElem(headerInnerElem, 'div', 'header__cart', '');

    const btnCart = createElem(headerCartElem, 'button', '', '');
    btnCart.setAttribute('type', 'button');

    const cartLogoElem = createElem(btnCart, 'img', 'header__logo', '');
    cartLogoElem.setAttribute('src', 'assets/icons/cart.svg');
    cartLogoElem.setAttribute('alt', 'shopping-cart');

    // Main
    const catalogElem = createElem(fragment, 'main', 'catalog', '');
    const containerMainElem = createElem(catalogElem, 'div', 'container', '');
    const catalogInnerElem = createElem(containerMainElem, 'div', 'catalog__inner', '');

    const catalogTitleElem = createElem(catalogInnerElem, 'h2', 'catalog__title', 'Book Catalog');
    const catalogShelfElem = createElem(catalogInnerElem, 'div', 'catalog__shelf', '');

    // Footer
    const footerElem = createElem(fragment, 'footer', 'footer', '');
    const containerFooterElem = createElem(footerElem, 'div', 'container', '');
    const footerInnerElem = createElem(containerFooterElem, 'div', 'footer__inner', '');

    const gitHubElem = createElem(footerInnerElem, 'div', 'footer__item', '');
    const gitHubLink = createElem(gitHubElem, 'a', 'footer__logo', '');
    gitHubLink.setAttribute('href', 'https://github.com/nick-konstantinov');
    gitHubLink.setAttribute('target', '_blank');
    gitHubLink.setAttribute('aria-label', 'github-footer');

    const imgGitHubLink = createElem(gitHubLink, 'img', '', '');
    imgGitHubLink.setAttribute('src', 'assets/icons/github.svg');
    imgGitHubLink.setAttribute('alt', 'logo github');

    const copyrightElem = createElem(footerInnerElem, 'div', 'footer__item', '&#169; ');
    const timeFooterElem = createElem(copyrightElem, 'time', '', '2023');

    const rssElem = createElem(footerInnerElem, 'div', 'footer__item', '');
    const rssLink = createElem(rssElem, 'a', 'footer__logo', '');
    rssLink.setAttribute('href', 'https://rs.school/');
    rssLink.setAttribute('target', '_blank');
    rssLink.setAttribute('aria-label', 'rss-footer');

    const imgRssLink = createElem(rssLink, 'img', '', '');
    imgRssLink.setAttribute('src', 'assets/icons/rs_school.svg');
    imgRssLink.setAttribute('alt', 'logo rsschool');

    // Add fragment to page
    body.append(fragment);
}


// Create book's elements
function createBooksELem(arr) {
    let allBooks = [];
    const shelf = document.querySelector('.catalog__shelf');

    for (let i = 0; i < arr.length; i++) {
        const bookElem = document.createElement('div');
        bookElem.classList.add('book');
        bookElem.setAttribute('id', i + 1);
        bookElem.dataset.price = arr[i].price;

        const bookCoverElem = createElem(bookElem, 'div', 'book__cover', '');
        const imgCoverElem = createElem(bookCoverElem, 'img', '', '');
        imgCoverElem.setAttribute('src', arr[i].imageLink);
        imgCoverElem.setAttribute('alt', arr[i].author);

        const bookInfoElem = createElem(bookElem, 'div', 'book__info', '');

        const bookAuthorElem = createElem(bookInfoElem, 'div', 'book__author', arr[i].author);

        let title = '';
        if (arr[i].title.length > 42) {
           title = arr[i].title.slice(0, 38) + '...'
        } else {
            title = arr[i].title;
        }

        const bookTitleElem = createElem(bookInfoElem, 'div', 'book__title', title);
        const bookPriceElem = createElem(bookInfoElem, 'div', 'book__price', '');
        let price = 'Price: &#36;' + arr[i].price;
        const spanPriceElem = createElem(bookPriceElem, 'span', '', price);

        const bookButtonsElem = createElem(bookInfoElem, 'div', 'book__buttons', '');
        const btnInfo = createElem(bookButtonsElem, 'button', ['btn', 'btn-info'], 'Show more');
        btnInfo.setAttribute('type', 'button');
        const btnOrder = createElem(bookButtonsElem, 'button', ['btn', 'btn-order'], 'Add to bag');
        btnOrder.setAttribute('type', 'button');

        // Add to arr
        allBooks.push(bookElem);
        // And add to page
        shelf.append(bookElem);
    }
    return allBooks;
}

// Create mask
function createMaskElem() {
    const maskElem = createElem(body, 'div', 'mask', '');
    maskElem.hidden = true;
}

// Create modal window "modal-info"
function createModalInfoElem() {
    const modalInfoElem = createElem(body, 'div', 'modal-info', '');
    const madalInfoInnerElem = createElem(modalInfoElem, 'div', 'modal-info__inner', '');
    const modalCrossElem = createElem(modalInfoElem, 'div', 'modal-info__cross', '');

    const madalInfoCoverElem = createElem(madalInfoInnerElem, 'div', 'modal-info__cover', '');
    const imgModalCoverElem = createElem(madalInfoCoverElem, 'img', '', '');

    const modalInfoInfoElem = createElem(madalInfoInnerElem, 'div', 'modal-info__info', '');
    const modalInfoAuthorElem = createElem(modalInfoInfoElem, 'h4', 'modal-info__author', '');
    const modalInfoTitleElem = createElem(modalInfoInfoElem, 'h3', 'modal-info__title', '');
    const modalInfoPriceElem = createElem(modalInfoInfoElem, 'h4', 'modal-info__price', '');
    const modalInfoDescriptionElem = createElem(modalInfoInfoElem, 'p', 'modal-info__description', '');

    modalInfoElem.hidden = true;
}


//  ----------  ADD ELEMENTS TO PAGE   ----------
createFrameElem();
createBooksELem(booksWithId);
// Add mask and modal elements
createMaskElem();
createModalInfoElem();
drawModalWindow();
// Add shopping cart counter and cart menu
createCartMenu();
createShopingCartCounter()


// Popup

// Create new map-books collection
let mapBooks = new Map();

for (let i = 0; i < booksWithId.length; i++) {
    mapBooks.set(i + 1, booksWithId[i]);
}

// Add to session storage books catalog
const serializedBooks = JSON.stringify(Object.fromEntries(mapBooks));
sessionStorage.setItem('books', serializedBooks);

// Draw "modal-info" window
function drawModalWindow() {
    const catalogElem = document.querySelector('.catalog__shelf');
    catalogElem.addEventListener('click', function(event) {
        let btnInfo = event.target.closest('.btn-info');
        let bookElem = event.target.closest('.book');

        if (!btnInfo) return;

        if (!catalogElem.contains(btnInfo)) return;

        maskElem.hidden = !maskElem.hidden;
        modalInfoElem.hidden = !modalInfoElem.hidden;
        body.style.overflow = 'hidden';
        fillModalContent(mapBooks, bookElem.id);
    });
}

// Add content to modal window
function fillModalContent(map, key) {
    let currentBook = map.get(+key);

    const imgElem = document.querySelector('.modal-info__cover img');
    imgElem.setAttribute('src', currentBook.imageLink);
    imgElem.setAttribute('alt', currentBook.author);

    const authorElem = document.querySelector('.modal-info__author');
    authorElem.innerHTML = currentBook.author;

    const titleElem = document.querySelector('.modal-info__title');
    titleElem.innerHTML = currentBook.title;

    const priceElem = document.querySelector('.modal-info__price');
    priceElem.innerHTML = 'Price: &#36;' + currentBook.price;

    const descriptionElem = document.querySelector('.modal-info__description');
    descriptionElem.innerHTML = currentBook.description;
}

// Find general modal's and mask's elements
const maskElem = document.querySelector('.mask');
const modalInfoElem = document.querySelector('.modal-info');
const modalCrossElem = document.querySelector('.modal-info__cross');
const cartMenuElem = document.querySelector('.cart-menu');

// Add listener for cross to close modal window
if (modalCrossElem) {
    modalCrossElem.addEventListener('click', function() {
        modalInfoElem.hidden = !modalInfoElem.hidden;
        maskElem.hidden = !maskElem.hidden;
        body.style.overflow = 'visible';
    });
}

// Add listener for mask when mouseenter event to add hover for cross
if (maskElem) {
    maskElem.addEventListener('mouseenter', function() {
        if (modalCrossElem) {
            modalCrossElem.classList.toggle('hover');
        }
    });
}

// Add listener for mask when mouseleave event to remove hover for cross
if (maskElem) {
    maskElem.addEventListener('mouseleave', function() {
        if (modalCrossElem) {
            modalCrossElem.classList.toggle('hover');
        }
    });
}

// Add listener for mask to close modal and hide mask
if (maskElem) {
    maskElem.addEventListener('click', function() {
        if (modalInfoElem) {
            modalInfoElem.hidden = true;
            maskElem.hidden = true;
            cartMenuElem.classList.remove('open');
            body.style.overflow = 'visible';
        }
    });
}

// Shopping cart

// Initial cart's amount variable and order collection
let sumOrder = 0;
let orderMap = new Map();

// Add to session storage ordered books
function setOrderToStorage(orderMapArg) {
    const serializedOrder = JSON.stringify(Object.fromEntries(orderMapArg));
    sessionStorage.setItem(ORDER_STORAGE_NAME, serializedOrder);
}

// Add elements to map collection
function addElemToMap(elem) {
    const id = elem.getAttribute('id');
    let countBooks = orderMap.get(id);
    if (isNaN(countBooks)) {
        countBooks = 0;
    }

    ++countBooks;
    sumOrder += +elem.dataset.price;

    orderMap.set(id, countBooks);
    setOrderToStorage(orderMap);
}

// Create cart menu
function createCartMenu() {
    const cartMenuElem = createElem(body, 'div', 'cart-menu', '');
    const cartMenuInnerElem = createElem(cartMenuElem, 'div', 'cart-menu__inner', '');
    const cartBtnAndAmountOrderElem = createElem(cartMenuElem, 'div', 'cart-menu__inter', '');
    const cartBtnOrderElem = createElem(cartBtnAndAmountOrderElem, 'a', 'cart-menu__btn', 'Order');
    cartBtnOrderElem.setAttribute('href', 'form.html');
    const cartAmountOrderElem = createElem(cartBtnAndAmountOrderElem, 'div', 'cart-menu__amount', '');


    let widthWidow = document.documentElement.clientWidth;

    if (widthWidow < 1650) return;

    const cartBtn = document.querySelector('.header__cart button');
    let coordsCartBtn = getCoords(cartBtn);

    cartMenuElem.style.left = coordsCartBtn.left + 'px';
}

// Create cart menu item
function createCartMenuItem(key) {
    let book = bookCatalogMap.get(key);

    const cartMenuInnerElem = document.querySelector('.cart-menu__inner');

    const cartMenuItemELem = document.createElement('div');
    cartMenuItemELem.dataset.id = key;
    cartMenuItemELem.classList.add('cart-menu__item');
    cartMenuItemELem.dataset.price = book.price;

    const cartMenuCoverELem = createElem(cartMenuItemELem, 'div', 'cart-menu__cover', '');
    const cartMenuImgELem = createElem(cartMenuCoverELem, 'img', 'cart-menu__cover', '');
    cartMenuImgELem.setAttribute('src', book.imageLink);
    cartMenuImgELem.setAttribute('alt', book.author);

    const cartMenuInfoElem = createElem(cartMenuItemELem, 'div', 'cart-menu__info', '');
    const cartMenuAuthorElem = createElem(cartMenuInfoElem, 'h4', 'cart-menu__author', book.author);

    let title = '';
    if (book.title.length > 42) {
        title = book.title.slice(0, 38) + '...'
    } else {
        title = book.title;
    }

    const cartMenuTitleElem = createElem(cartMenuInfoElem, 'h3', 'cart-menu__title', title);
    const cartMenuPriceElem = createElem(cartMenuInfoElem, 'h4', 'cart-menu__price', 'Price: $' + book.price);

    const cartMenuBtnCrossElem = createElem(cartMenuItemELem, 'button', 'cart-menu__cross', '');
    cartMenuBtnCrossElem.setAttribute('type', 'button');
    const cartMenuImgCrossElem = createElem(cartMenuBtnCrossElem, 'img', '', '');
    cartMenuImgCrossElem.setAttribute('src', 'assets/icons/cross.svg');
    cartMenuImgCrossElem.setAttribute('alt', 'cross');

    cartMenuInnerElem.append(cartMenuItemELem);
}

// Get element's coords
function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      right: box.right + window.pageXOffset,
      bottom: box.bottom + window.pageYOffset,
      left: box.left + window.pageXOffset
    };
}

// Initial cart's counter variable
let counterCart = 0;

// Create shopping cart counter
function createShopingCartCounter() {
    const cart = document.querySelector('.header__cart button');
    const counterShoppingCart = createElem(cart, 'div', 'header__cart-counter', '');
    const quantityBooksElem = createElem(counterShoppingCart, 'h5', 'header__cart-counter_quantity', '');
    counterShoppingCart.hidden = true;
}

// Change shopping cart counter
function changeCartCounter() {
    const counterShoppingCart = document.querySelector('.header__cart-counter');
    let quantityBooksElem = document.querySelector('.header__cart-counter_quantity');

    quantityBooksElem.innerHTML = --counterCart;
    if (counterCart > 0) {
        counterShoppingCart.classList.add('active');
    } else {
        counterShoppingCart.classList.remove('active');
        counterShoppingCart.hidden = true;
        cartMenuElem.classList.remove('open');
        maskElem.hidden = !maskElem.hidden;
        body.classList.remove("noscroll");
    }
}

// Add listener for cart's button when cart's counter not equal "0" to open cart menu
const btnCart = document.querySelector('.header__cart button');
btnCart.addEventListener('click', function() {
    if (counterCart === 0) return;
    const cartMenuElem = document.querySelector('.cart-menu');
    modalInfoElem.hidden = true;

    cartMenuElem.classList.toggle('open');
    if (cartMenuElem.classList.contains('open')) {
        maskElem.hidden = false;
        body.style.overflow = 'hidden';
    } else {
        maskElem.hidden = true;
        body.style.overflow = 'visible';
    }
});

// Add listener for window to correct position cart menu
window.addEventListener('resize', function() {
    const cartMenuElem = this.document.querySelector('.cart-menu');
    let widthWidow = document.documentElement.clientWidth;

    const cartBtn = document.querySelector('.header__cart button');
    let coordsCartBtn = getCoords(cartBtn);

    if (widthWidow < 1665) {
        cartMenuElem.style.left = widthWidow - 338 + 'px';

    } else {
        cartMenuElem.style.left = coordsCartBtn.left + 'px';
    }
});

// Add listener for catalog shelf when happened 'click' on order button
// Do:
// Add book's elements to "order map"
// Create and append book's elements to cart menu
// Show shopping cart's counter and change сontent
const catalogElem = document.querySelector('.catalog__shelf');
catalogElem.addEventListener('click', function (event) {
    let bookElem = event.target.closest('.book');
    let btnOrder = event.target.closest('.btn-order');
    const counterShoppingCart = document.querySelector('.header__cart-counter');
    let quantityBooksElem = document.querySelector('.header__cart-counter_quantity');
    let cartAmountOrderElem = document.querySelector('.cart-menu__amount');

    if (!btnOrder) return;

    if (!catalogElem.contains(btnOrder)) return;

    addElemToMap(bookElem);

    createCartMenuItem(+bookElem.id);
    counterShoppingCart.hidden = false;
    counterShoppingCart.classList.add('active');
    quantityBooksElem.innerHTML = ++counterCart;
    cartAmountOrderElem.innerHTML = '$' + sumOrder;
});



// Add listener for cart menu when happened 'click' on cross book's elements
// Do: remove book's elements and reduce counter's content
cartMenuElem.addEventListener('click', function(event) {
    let cross = event.target.closest('.cart-menu__cross');
    let item = event.target.closest('.cart-menu__item');
    let cartAmountOrderElem = document.querySelector('.cart-menu__amount');
    const id = item?.dataset.id;

    if (!cross) return;

    if (!cartMenuElem.contains(cross)) return;

    sumOrder -= +item.dataset.price;

    item.remove();
    const currentCount = orderMap.get(id);
    const newCount = currentCount - 1;
    if (newCount === 0) {
        orderMap.delete(id);
    } else {
        orderMap.set(id, newCount);
    }
    setOrderToStorage(orderMap);

    item = null;

    changeCartCounter();
    cartAmountOrderElem.innerHTML = '$' + sumOrder;
    if (counterCart === 0) {
        body.style.overflow = 'visible';
    }
});


// Drag'n'Drop

// Target for drag'n'drop
let currentDroppable = null;
let target = false;

// Add listener for book's elements
catalogElem.addEventListener('mousedown', function(event) {
    event.preventDefault();
    let bookElem = event.target.closest('.book');

    if (!bookElem) return;

    let cloneBookElem = document.createElement('img');
    cloneBookElem.setAttribute('src', bookElem.querySelector('img').getAttribute('src'));
    cloneBookElem.style.position = 'absolute';
    cloneBookElem.style.width = '100px';
    cloneBookElem.style.height = 'auto';
    cloneBookElem.style.cursor = 'grab';

    document.body.append(cloneBookElem);
    cloneBookElem.style.zIndex = 1000;

    function moveAt(pageX, pageY) {
        cloneBookElem.style.left = pageX - 50 + 'px';
        cloneBookElem.style.top = pageY - cloneBookElem.offsetHeight / 2 + 'px';
    }

    function onMouseMove(e) {
        moveAt(e.pageX, e.pageY);

        cloneBookElem.hidden = true;
        let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
        cloneBookElem.hidden = false;

        if (!elemBelow) return;

        let droppableBelow = elemBelow.closest('.header__cart button');
        if (currentDroppable != droppableBelow) {
            if (currentDroppable) {
                leaveDroppable(currentDroppable);
                cloneBookElem.style.opacity = 1;
                cloneBookElem.style.cursor = 'grab';

                target = false;
            }
            currentDroppable = droppableBelow;
            if (currentDroppable) {
                enterDroppable(currentDroppable);
                cloneBookElem.style.opacity = 0.2;
                cloneBookElem.style.cursor = 'crosshair';

                target = true;
            }
        }
    }

    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('mouseup', function() {
        const counterShoppingCart = document.querySelector('.header__cart-counter');
        const btnCart = document.querySelector('.header__cart button');
        let quantityBooksElem = document.querySelector('.header__cart-counter_quantity');
        let cartAmountOrderElem = document.querySelector('.cart-menu__amount');
        let bookElem = event.target.closest('.book');

        document.removeEventListener('mousemove', onMouseMove);

        if (cloneBookElem) {
            if (target) {
                addElemToMap(bookElem);
                createCartMenuItem(+bookElem.id);
                counterShoppingCart.hidden = false;
                counterShoppingCart.classList.add('active');
                quantityBooksElem.innerHTML = ++counterCart;
                cartAmountOrderElem.innerHTML = '$' + sumOrder;

                cloneBookElem.remove();
                cloneBookElem = null;
                target = false;
                leaveDroppable(btnCart);
            } else {
                cloneBookElem.remove();
                cloneBookElem = null;
            }
        }

    });

    cloneBookElem.ondragstart = function() {
        return false;
    };

});

function leaveDroppable(elem) {
    elem.style.transform = 'scale(1)';
}

function enterDroppable(elem) {
    elem.style.transform = 'scale(1.2)';
}


})();
