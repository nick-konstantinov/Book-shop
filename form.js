"use strict";

// Check does it match entered data to pattern attribute regular expression
function checkValidInput(elem, err) {
    if (elem.validity.patternMismatch || elem.value === '' || elem.value === null) {
        elem.classList.add('invalid');
        err.hidden = false;
    }
}

// Remove class invalid and error message if retrying to enter
function removeInvalidErr(elem, err) {
    elem.classList.remove('invalid');
    err.hidden = true;
}

// Handling input "name"
const nameElem = document.querySelector('#name');
const errorName = document.querySelector('.error__name');

nameElem.addEventListener('blur', function() {
    checkValidInput(nameElem, errorName);
});

nameElem.addEventListener('focus', function() {
    removeInvalidErr(nameElem, errorName);
});

// Handling input "surname"
const surnameElem = document.querySelector('#surname');
const errorSurname = document.querySelector('.error__surname');

surnameElem.addEventListener('blur', function() {
    checkValidInput(surnameElem, errorSurname);
});

surnameElem.addEventListener('focus', function() {
    removeInvalidErr(surnameElem, errorSurname);
});

// Handling input "date"
const dateElem = document.querySelector('#date');

let minDeliveryDate = new Date();
minDeliveryDate.setDate(minDeliveryDate.getDate() + 1);

const year = minDeliveryDate.getFullYear();
let month = minDeliveryDate.getMonth() + 1;
if (month < 10) month = '0' + month;
let day = minDeliveryDate.getDate();
if (day < 10) day = '0' + day;

const currentDate = String(year + '-' + month + '-' + day);

dateElem.defaultValue = currentDate;
dateElem.min = currentDate;

dateElem.addEventListener('focus', function() {
    dateElem.style.color = '#000';
});

// Handling input "street"
const streetElem = document.querySelector('#street');
const errorStreet = document.querySelector('.error__street');

streetElem.addEventListener('blur', function() {
    checkValidInput(streetElem, errorStreet);
});

streetElem.addEventListener('focus', function() {
    removeInvalidErr(streetElem, errorStreet);
});

// Handling input "houseNumber"
const houseNumberElem = document.querySelector('#houseNumber');
const errorHouseNumber = document.querySelector('.error__house-number');

houseNumberElem.addEventListener('blur', function() {
    checkValidInput(houseNumberElem, errorHouseNumber);
});

houseNumberElem.addEventListener('focus', function() {
    removeInvalidErr(houseNumberElem, errorHouseNumber);
});

// Handling input "flatNumber"
const flatNumberElem = document.querySelector('#flatNumber');
const errorFlatNumber = document.querySelector('.error__flat-number');

flatNumberElem.addEventListener('blur', function() {
    checkValidInput(flatNumberElem, errorFlatNumber);
});

flatNumberElem.addEventListener('focus', function() {
    removeInvalidErr(flatNumberElem, errorFlatNumber);
});

// Handling input "gifts"
const checkboxItem = document.querySelector('.form__gifts');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const errorGifts = document.querySelector('.error__gifts');
const limit = 2;

function checkBoxLimit() {
	for (let i = 0; i < checkboxes.length; i++) {
		checkboxes[i].addEventListener('click', function() {
			let checkedcount = 0;
			for (let i = 0; i < checkboxes.length; i++) {
				checkedcount += (checkboxes[i].checked) ? 1 : 0;
			}
			if (checkedcount > limit) {
                errorGifts.innerHTML = 'You can select maximum of ' + limit + ' checkboxes';
                errorGifts.hidden = false;
				this.checked = false;
			} else  if (checkedcount <= limit){
                errorGifts.hidden = true;
            }
        });
	}
}

checkBoxLimit();

// Handling input "submit"

// Check inputs:
// if inputs data - valid -> submit - active
// if inputs data - invalid -> submit - disabled
function checkInputsForSubmit(){
    let inputs = document.querySelectorAll('.required');
    let radio = document.querySelectorAll('input[type="radio"]');
    let btnSubmit = document.querySelector('input[type="submit"]');
    let isValid = true;
    let isRadioChecked = false;


    for (let i = 0; i < inputs.length; i++){
        let changedInput = inputs[i];

        if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
        } else {
            isValid = true;
        }
    }

    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            isRadioChecked = true;
            break;
        }
    }

    btnSubmit.disabled = !isValid || !isRadioChecked;
    if (!btnSubmit.disabled) {
        btnSubmit.classList.remove('disabled_btn');
    }
}

// Modal window with confirmation of an order

let orderMap, booksMap;

// Submit Form
function submitForm() {
    const orderJson = sessionStorage.getItem('order');
    const booksJson = sessionStorage.getItem('books');

    orderMap = new Map(Object.entries(JSON.parse(orderJson)));
    booksMap = new Map(Object.entries(JSON.parse(booksJson)));
}

submitForm();

// Find general modal's and mask's elements
const body = document.querySelector('body');
const maskElem = document.querySelector('.mask');
const modalElem = document.querySelector('.modal');
const modalCrossElem = document.querySelector('.modal__cross');

// Add listener for document to check inputs for submit
const formOrder = document.forms.formOrder;
formOrder.addEventListener('change', checkInputsForSubmit);
formOrder.addEventListener('submit', drawModalWindow);

// Draw "modal-info" window
function drawModalWindow(event) {
    event.preventDefault();
    maskElem.hidden = !maskElem.hidden;
    modalElem.hidden = !modalElem.hidden;
    body.style.overflow = 'hidden';
    fillModalContent(booksMap, orderMap);
    // Clear session storage
    sessionStorage.clear();
}

// Add content to modal window
function fillModalContent(booksMap, orderMap) {
    const address = streetElem.value + ' street, ' + houseNumberElem.value + ', ' + flatNumberElem.value;
    const addressElem = document.querySelector('.modal__address');
    const spanAddress = document.createElement('span');
    addressElem.append(spanAddress);
    spanAddress.innerHTML = address;

    const customer = surnameElem.value + ' ' + nameElem.value;
    const customerElem = document.querySelector('.modal__customer');
    const spanCustomer = document.createElement('span');
    customerElem.append(spanCustomer);
    spanCustomer.innerHTML = customer;

    const date = dateElem.value;
    const dateModalElem = document.querySelector('.modal__date');
    const spanDate = document.createElement('span');
    dateModalElem.append(spanDate);
    spanDate.innerHTML = date;

    addBookInfoToModal(booksMap, orderMap);
}

// Add ordered books to modal window
function addBookInfoToModal(booksMap, orderMap) {
    const iteratorOrderMap = orderMap.keys();
    const booksElemList = document.querySelector('.modal__list-books');
    const totalSumElem = document.querySelector('.modal__total-sum');
    let totalSum = 0;
    for (let i = 0; i < orderMap.size; i++) {
        const key = iteratorOrderMap.next().value;
        const currentBook =  booksMap.get(key);
        const currentBookCount = orderMap.get(key);
        totalSum += currentBook.price * currentBookCount;

        const bookModalName = document.createElement('span');
        bookModalName.innerHTML = currentBook.title + ' (' + currentBookCount + ')';
        booksElemList.append(bookModalName);
    }

    totalSumElem.innerHTML = 'Total: $' + totalSum;
}


// Add listener for cross to close modal window
if (modalCrossElem) {
    modalCrossElem.addEventListener('click', function() {
        modalElem.hidden = !modalElem.hidden;
        maskElem.hidden = !maskElem.hidden;
        body.style.overflow = 'visible';
        window.location.href = "./index.html";
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
        if (modalElem) {
            modalElem.hidden = true;
            maskElem.hidden = true;
            body.style.overflow = 'visible';
            window.location.href = "./index.html";
        }
    });
}

















