'use strict';

// Model


let recipeInfo;

recipeInfo = {
  conversionFactor: '',
  prevId: 0,
  recipe: []
}


// Creates a new id
const createId = () => {
  if (recipeInfo.hasOwnProperty('prevId')) {
    recipeInfo.prevId = recipeInfo.prevId + 1;
  } else {
    recipeInfo.prevId = 0;
  }
  return recipeInfo.prevId;
}


// Creates a conversion factor
const createConversionFactor = (initialYield, expectedYield) => {
  if (initialYield.length !== 0 && expectedYield.length !== 0) {
    let conversionFactor = expectedYield / initialYield;
    conversionFactor = Math.round(conversionFactor * 100) / 100;

    recipeInfo.conversionFactor = conversionFactor;
  }
}

// Deletes current conversion factor
const removeConversionFactor = () => {
  delete recipeInfo.conversionFactor;
}

// Creates a recipe item
const createRecipeItem = (quantity, unit, ingredient) => {
  if (ingredient.length != 0) {
    const id = createId();

    recipeInfo.recipe.push(
      {
        id: id,
        quantity: quantity,
        unit: unit,
        ingredient: ingredient
      }
    );
  }
}

// Deletes recipe item
const removeRecipeItem = idToDelete => {
  recipeInfo.recipe = recipeInfo.recipe.filter(item => {
    if (item.id == idToDelete) {
      return false;
    } else {
      return true;
    }
  })
}

// Create adjusted recipe
const createRecipeAdjustment = () => {
  if (recipeInfo.hasOwnProperty('conversionFactor') && typeof recipeInfo.conversionFactor === 'number') {
    recipeInfo.recipe.forEach(function (item) {
      const adjustedQuantity = item.quantity * recipeInfo.conversionFactor;
      item.adjustedQuantity = Math.round(adjustedQuantity * 1000) / 1000;
    });
  }
}

// Saves the state
const saveTodos = () => {
  localStorage.setItem('recipeInfo', JSON.stringify(recipeInfo));
}


// View


// generates an element for one ingredient
const makeIngredientElem = (quantity, unit, ingredient, id) => {
  const container = document.createElement('div');
  container.setAttribute('id', "" + id);
  container.classList.add('current__ingredient');

  const qtyElem = document.createElement('input');
  qtyElem.setAttribute('type', 'number');
  qtyElem.setAttribute('id', 'qty');
  qtyElem.setAttribute('placeholder', 'Qty');
  qtyElem.setAttribute('name', 'qty');
  qtyElem.setAttribute('value', quantity.toString());
  const unitElem = document.createElement('input');
  unitElem.setAttribute('type', 'text');
  unitElem.setAttribute('id', 'unit');
  unitElem.setAttribute('placeholder', 'Unit');
  unitElem.setAttribute('name', 'unit');
  unitElem.setAttribute('value', unit);
  const ingElem = document.createElement('input');
  ingElem.setAttribute('type', 'text');
  ingElem.setAttribute('id', 'ingredient');
  ingElem.setAttribute('placeholder', 'Enter your ingredient');
  ingElem.setAttribute('name', 'ingredient');
  ingElem.setAttribute('value', ingredient);
  ingElem.classList.add('input__ingredient');
  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('type', 'button');
  deleteBtn.setAttribute('name', 'add');
  deleteBtn.classList.add('remove__ingredient');
  deleteBtn.textContent = "x";
  deleteBtn.id = id;
  deleteBtn.onclick = deleteRecipeItem;

  container.appendChild(qtyElem);
  container.appendChild(unitElem);
  container.appendChild(ingElem);
  container.appendChild(deleteBtn);

  return container;
}

// generates an element for a adjusted ingredient
const makeAdjustedIngredientElem = (quantity, unit, ingredient, id) => {
  const container = document.createElement('div');
  container.setAttribute('id', "r" + id);
  container.classList.add('adjusted__ingredient');

  const qtyElem = document.createElement('input');
  qtyElem.disabled = true;
  qtyElem.setAttribute('type', 'number');
  qtyElem.setAttribute('id', 'qty');
  qtyElem.setAttribute('placeholder', 'Qty');
  qtyElem.setAttribute('name', 'qty');
  qtyElem.setAttribute('value', quantity.toString());
  const unitElem = document.createElement('input');
  unitElem.disabled = true;
  unitElem.setAttribute('type', 'text');
  unitElem.setAttribute('id', 'unit');
  unitElem.setAttribute('placeholder', 'Unit');
  unitElem.setAttribute('name', 'unit');
  unitElem.setAttribute('value', unit);
  const ingElem = document.createElement('input');
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

// Renders all components
const render = () => {
  if (recipeInfo.hasOwnProperty('conversionFactor')) {
    // render conversion factor
    document.querySelector('.yield__factor').textContent = recipeInfo.conversionFactor;

    // clear ingredients
    const recipeContainer = document.querySelector('.recipe__add');
    const recipeFormElem = recipeContainer.children[0];
    const formInputs = document.querySelectorAll('form input');
    for (let i = 0; i < formInputs.length; i++) {
      formInputs[i].value = '';
    }
    recipeContainer.innerHTML = '';
    recipeContainer.appendChild(recipeFormElem);
    const adjRecipeContainer = document.querySelector('.recipe__outcome');
    adjRecipeContainer.innerHTML = '';

    // render ingredients
    recipeInfo.recipe.forEach(function (item) {
      const recipeItemElem = makeIngredientElem(item.quantity, item.unit, item.ingredient, item.id);
      recipeContainer.appendChild(recipeItemElem);

      if (item.hasOwnProperty('adjustedQuantity')) {
        const adjRecipeItemElem = makeAdjustedIngredientElem(item.adjustedQuantity, item.unit, item.ingredient, item.id);
        adjRecipeContainer.appendChild(adjRecipeItemElem);
      }
    });
  }
}


// Controller


// Make conversiont factor based on initial yield
const makeConversionFactorX = event => {
  const initialYield = event.target.value;
  const desiredYield = document.querySelector('#expected__yield').value;

  createConversionFactor(initialYield, desiredYield);
  createRecipeAdjustment();
  render();
}

// Make conversiont factor based on desired yield
const makeConversionFactorY = event => {
  const initialYield = document.querySelector('#current__yield').value;
  const desiredYield = event.target.value;

  createConversionFactor(initialYield, desiredYield);
  createRecipeAdjustment();
  render();
}

// Add a recipe item
const addRecipeItem = () => {
  const quantity = document.querySelector('.recipe__add__form #qty').value;
  const unit = document.querySelector('.recipe__add__form #unit').value;
  const ingredient = document.querySelector('.recipe__add__form #ingredient').value;

  createRecipeItem(quantity, unit, ingredient);
  createRecipeAdjustment();
  render();
}

// Delete a recipe item
const deleteRecipeItem = event => {
  const deleteButton = event.target;
  const idToDelete = deleteButton.id;

  removeRecipeItem(idToDelete);
  render();
}

// initiate listening to yields and adding
const beginControl = () => {
  const initialYieldElem = document.querySelector('#current__yield');
  const expectedYieldElem = document.querySelector('#expected__yield');
  initialYieldElem.onchange = makeConversionFactorX;
  expectedYieldElem.onchange = makeConversionFactorY;

  const addBtn = document.querySelector('.add__ingredient');
  addBtn.onclick = addRecipeItem;
}
beginControl();
