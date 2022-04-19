import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
import View from './View.js';

class ResultView extends View {
  _parentElment = document.querySelector('.results');
  _errorMessage = 'No Reciepe Found For Your Query! Please Try Again';
  _Message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
