import * as model from './model.js';
import recipeView from './view/RecipeView.js';
import RecipeView from './view/RecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import searchview from './view/searchVier';
import resultView from './view/resultView.js';
import PaginationtView from './view/PaginationView.js';
import bookMarkView from './view/bookMArkView.js';
import addRecipeView from './view/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
//const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();
    //update results
    resultView.update(model.getSearchREsultOage());
    // update the selected book mark
    bookMarkView.update(model.state.bookMark);
    //loading
    await model.loadRecipe(id); // should be await cuz it will return promise

    //const { recipe } = model.state;
    // rendering
    recipeView.render(model.state.recipe);
    //testing
    //controlServing();
  } catch (err) {
    recipeView.renderError(recipeView._errorMessage);
  }
};
const controlSearchResult = async function () {
  try {
    //resultView.renderSpinner();
    //get search querry
    const quey = searchview.getQuery();
    if (!quey) return;
    // laod search results
    await model.loadSearchResult(quey);
    // resultView.render(model.state.search.result);
    resultView.render(model.getSearchREsultOage());
    //render paginaton
    PaginationtView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

//controlSearchResult();
const controlPagination = function (gotoPage) {
  //render New REsult
  resultView.render(model.getSearchREsultOage(gotoPage));
  //render NEw paginaton
  PaginationtView.render(model.state.search);
};

const controlServing = function (newServng) {
  // update the recipe serving
  model.updateServing(newServng);
  // update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  // we check if the bookmark elment sis false or true to simply book or un book the recipe
  if (!model.state.recipe.bookMark) model.addBookMark(model.state.recipe);
  else model.deletBookMark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  //render bookMark
  bookMarkView.render(model.state.bookMark);
};
const controlBookMark = function () {
  bookMarkView.render(model.state.bookMark);
};

const controlAddRecipe = async function (newData) {
  try {
    // spinner load
    addRecipeView.renderSpinner();

    //uplaod new recipe
    await model.uplaoadRecipe(newData);
    //render new Recipe
    recipeView.render(model.state.recipe);
    // render a succes messge
    addRecipeView.renderMessage();
    //render the bookmark view
    bookMarkView.render(model.state.bookMark);

    //change id url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form windo
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

controlRecipe();
const init = function () {
  bookMarkView.addHandler(controlBookMark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHAndlerUpdateServing(controlServing);
  recipeView.addHandlerBookMark(controlAddBookMark);
  searchview.addHandlerSearch(controlSearchResult);
  PaginationtView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
//window.addEventListener('hashchange', controlRecipe);
