import { async } from 'regenerator-runtime';
import { API_URL, KEY, RES_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helper.js';

export const state = {
  recipe: {},
  search: {
    quey: '',
    result: [],
    page: 1,
    resultPerPAge: RES_PER_PAGE,
  },
  bookMark: [],
};

const createRcipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    key: recipe.key,
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRcipeObject(data);
    //checling if there is any bookd mark recipe so we use some Method to check if any recipe is booked
    if (state.bookMark.some(bookMark => bookMark.id === id))
      state.recipe.bookMark = true;
    else state.recipe.bookMark = false;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchResult = async function (quey) {
  try {
    state.search.quey = quey;
    const data = await getJSON(`${API_URL}?search=${quey}&key=${KEY}`);
    console.log(data);

    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        key: rec.key,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchREsultOage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPAge;
  const end = page * state.search.resultPerPAge;

  return state.search.result.slice(start, end);
};

export const updateServing = function (newServng) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServng) / state.recipe.servings;
  });
  state.recipe.servings = newServng;
};

const presistBookMark = function () {
  localStorage.setItem('bookMark', JSON.stringify(state.bookMark));
};

export const addBookMark = function (recipe) {
  //add BookMark
  state.bookMark.push(recipe);
  //maek recent recipe as bookd mark
  if (recipe.id === state.recipe.id) state.recipe.bookMark = true;
  presistBookMark();
};
export const deletBookMark = function (id) {
  //selecting teh item taht we wanna to delet
  const index = state.bookMark.findIndex(el => el.id === id);
  //deleting fom state book mark array
  state.bookMark.splice(index, 1);
  //maek recent recipe as not bookd mark
  if (id === state.recipe.id) state.recipe.bookMark = false;
  presistBookMark();
};

const init = function () {
  const storage = localStorage.getItem('bookMark');
  if (storage) state.bookMark = JSON.parse(storage);
};
init();
const clearBookMark = function () {
  localStorage.clear('bookMark');
};
//clearBookMark()

export const uplaoadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      // get out the ingredient and make new arry of it
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        //make an arry have only the ingerdient
        //const ingarr = ing[1].replaceAll(' ', '').split(',');
        const ingarr = ing[1].split(',').map(el => el.trim());

        if (ingarr.length !== 3)
          throw new Error('Wrong Ingerdient Format Please Use The Corevt One');
        // distructure the array
        const [quantity, unit, description] = ingarr;
        // return the array to an object
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRcipeObject(data);
    //state.recipe.key = data.data.recipe.key;
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
