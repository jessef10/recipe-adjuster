'use strict';

let state = {'1': {
                quantity: 1,
                unit: 'cups',
                ingredient: 'flour'
              }
            };
let id = 0;
let currentYieldElem = document.querySelector('#current__yield');
let desiredYieldElem = document.querySelector('#expected__yield');
let conversionFactor = 1;

// window.onscroll = function() {showPageLogo()};
//
// function showPageLogo() {
//   let logo = document.querySelector('.page__logo');
//   if (document.body.scrollTop > 700 || document.documentElement.scrollTop > 700) {
//     logo.style.display = "block";
//   } else if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
//     logo.style.display = "none";
//   } else {
//     logo.style.display = "block";
//   }
// }

computeConversionFactor();
function computeConversionFactor() {
  console.log(currentYieldElem);
  currentYieldElem.onchange = handleXChange;
  console.log(desiredYieldElem);
  desiredYieldElem.onchange = handleYChange;
}

function handleXChange(e) {
  let currentYield = e.target.value;
  let desiredYield = desiredYieldElem.value;
  if (desiredYield.length !== 0 && currentYield.length !== 0) {
    conversionFactor = desiredYield / currentYield;
    document.querySelector('.yield__factor').textContent = Math.round(conversionFactor * 100) /100;
    console.log(conversionFactor);
  }
}

function handleYChange(e) {
  let desiredYield = e.target.value;
  let currentYield = currentYieldElem.value;
  if (currentYield.length !== 0 && desiredYield.length !== 0) {
    conversionFactor = desiredYield / currentYield;
    document.querySelector('.yield__factor').textContent = Math.round(conversionFactor * 100) /100;
    console.log(conversionFactor);
  }
}

function makeId() {
  id += 1;
  return id;
}

function updateState(quantity, unit, ingredient, id) {
  state['' + id] = {
    quantity: quantity,
    unit: unit,
    ingredient: ingredient
  };
}

addIngredient();
function addIngredient() {
  let addBtn = document.querySelector('.add__ingredient');
  addBtn.addEventListener('click', function() {
    console.log('clicked add');
    let ingInput = document.querySelector('.recipe__add__form #ingredient').value;
    if (ingInput.length !== 0) {
      let qtyInput = document.querySelector('.recipe__add__form #qty').value;
      if (qtyInput.length === 0) {
        qtyInput = 0;
      }
      let unitInput = document.querySelector('.recipe__add__form #unit').value;
      if (unitInput.length === 0) {
        unitInput = "";
      }
      let currId = makeId();
      updateState(qtyInput, unitInput, ingInput, currId);
      let recipeItem = makeIngredient(qtyInput, unitInput, ingInput, currId);
      let recipeContainer = document.querySelector('.recipe__add');
      recipeContainer.appendChild(recipeItem);

      let adjRecipeItem = makeAdjustedIngredient(qtyInput * conversionFactor, unitInput, ingInput, currId);
      let adjRecipeContainer = document.querySelector('.recipe__outcome');
      adjRecipeContainer.appendChild(adjRecipeItem);
      includeRemoveOption(currId);
    }
  });
}

function includeRemoveOption(id) {
  let allRemoveButtons = document.querySelectorAll('.remove__ingredient');
  let removeButton = allRemoveButtons[allRemoveButtons.length - 1];
  removeButton.addEventListener('click', function() {
    removeButton.parentElement.remove();
    let removeId = '#r' + id;
    let correspondingIngredient = document.querySelector(removeId);
    correspondingIngredient.remove();
  });
}

//console.log(makeIngredient(4, "grams", "sugar", 123));
function makeIngredient(quantity, unit, ingredient, id) {
  let container = document.createElement('div');
  container.setAttribute('id', "" + id);
  container.classList.add('current__ingredient');

  let qtyElem = document.createElement('input');
  qtyElem.setAttribute('type', 'number');
  qtyElem.setAttribute('id', 'qty');
  qtyElem.setAttribute('placeholder', 'Qty');
  qtyElem.setAttribute('name', 'qty');
  qtyElem.setAttribute('value', quantity.toString());
  let unitElem = document.createElement('input');
  unitElem.setAttribute('type', 'text');
  unitElem.setAttribute('id', 'unit');
  unitElem.setAttribute('placeholder', 'Unit');
  unitElem.setAttribute('name', 'unit');
  unitElem.setAttribute('value', unit);
  let ingElem = document.createElement('input');
  ingElem.setAttribute('type', 'text');
  ingElem.setAttribute('id', 'ingredient');
  ingElem.setAttribute('placeholder', 'Enter your ingredient');
  ingElem.setAttribute('name', 'ingredient');
  ingElem.setAttribute('value', ingredient);
  ingElem.classList.add('input__ingredient');
  let deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('type', 'button');
  deleteBtn.setAttribute('name', 'add');
  deleteBtn.classList.add('remove__ingredient');
  deleteBtn.textContent = "x";

  container.appendChild(qtyElem);
  container.appendChild(unitElem);
  container.appendChild(ingElem);
  container.appendChild(deleteBtn);

  return container;
}

//console.log(makeAdjustedIngredient(4, "grams", "sugar", 123));
function makeAdjustedIngredient(quantity, unit, ingredient, id) {

  let container = document.createElement('div');
  container.setAttribute('id', "r" + id);
  container.classList.add('adjusted__ingredient');

  let qtyElem = document.createElement('input');
  qtyElem.disabled = true;
  qtyElem.setAttribute('type', 'number');
  qtyElem.setAttribute('id', 'qty');
  qtyElem.setAttribute('placeholder', 'Qty');
  qtyElem.setAttribute('name', 'qty');
  qtyElem.setAttribute('value', quantity.toString());
  let unitElem = document.createElement('input');
  unitElem.disabled = true;
  unitElem.setAttribute('type', 'text');
  unitElem.setAttribute('id', 'unit');
  unitElem.setAttribute('placeholder', 'Unit');
  unitElem.setAttribute('name', 'unit');
  unitElem.setAttribute('value', unit);
  let ingElem = document.createElement('input');
  ingElem.disabled = true;
  ingElem.setAttribute('type', 'text');
  ingElem.setAttribute('id', 'ingredient');
  ingElem.setAttribute('placeholder', 'Enter your ingredient');
  ingElem.setAttribute('name', 'ingredient');
  ingElem.setAttribute('value', ingredient);
  ingElem.classList.add('input__ingredient');

  container.appendChild(qtyElem);
  container.appendChild(unitElem);
  container.appendChild(ingElem);
  return container;
}
