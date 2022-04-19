import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';

class BookMark extends View {
  _parentElment = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _Message = '';
  addHandler(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookMark => previewView.render(bookMark, false))
      .join('');
  }
}

export default new BookMark();
