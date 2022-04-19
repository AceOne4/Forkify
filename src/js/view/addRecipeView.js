import icons from 'url:../../img/icons.svg';
import View from './View.js';

class AddRecipeView extends View {
  _parentElment = document.querySelector('.upload');
  _windwo = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _Message = 'Successed';
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._windwo.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElment.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.upload__btn');
      // new method to handle the the data coming for user interface turning it to array
      const dataarr = [...new FormData(this)];
      // method to convert the array to object
      const data = Object.fromEntries(dataarr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
