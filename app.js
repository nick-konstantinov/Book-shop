"use strict";

(async () => {

// General global variables
const mask = document.querySelector('.mask');
const body = document.body;
const modal = document.querySelector('.modal-info');

// Get book's collection
let response = await fetch('../books.json');
let books = await response.json();

// Add id atributes for books
let booksWithId = books.map((item, i) => ({...item, id: i + 1}));

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

    const headerBasketElem = createElem(headerInnerElem, 'div', 'header__bag', '');

    const btnBasket = createElem(headerBasketElem, 'button', '', '');
    btnBasket.setAttribute('type', 'button');

    const basketLogoElem = createElem(btnBasket, 'img', 'header__logo', '');
    basketLogoElem.setAttribute('src', 'assets/icons/basket.svg');
    basketLogoElem.setAttribute('alt', 'basket');

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
    console.log(shelf);

    for (let i = 0; i < arr.length; i++) {
        const bookElem = document.createElement('div');
        bookElem.classList.add('book');

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

//  ----------  ADD ELEMENTS TO PAGE   ----------
createFrameElem();
createBooksELem(booksWithId);

})();
