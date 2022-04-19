import icons from 'url:../../img/icons.svg';
_Message;

export default class View {
  _data;

  /**
   * Render the Recived object to Dom
   * @param {object | object[] } data the data to be render
   * @param {boolean} [render=true] if false create markup string instead of rendreing the DOm
   * @returns {undefined | string}
   * @this {object} View intance
   * @author Ace
   * @todo Finish implentaion
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(this._errorMessage);

    this._data = data;
    const markUp = this._generateMarkup();
    if (!render) return markUp;
    this._clear();
    this._parentElment.insertAdjacentHTML('afterbegin', markUp);
  }
  // to update results without re rendering the whoel page
  update(data) {
    this._data = data;
    const newmarkUp = this._generateMarkup();
    //nove nodelist in memory
    const newDOM = document.createRange().createContextualFragment(newmarkUp);
    //selecting the new Nodelist
    const newElment = [...newDOM.querySelectorAll('*')];
    //select the old NodeList
    const curElment = [...this._parentElment.querySelectorAll('*')];
    //looping over the new one and Compare it with the old one
    newElment.forEach((newEl, i) => {
      const curEL = curElment[i];
      //console.log(curEL, newEl.isEqualNode(curEL));
      //update Textes
      if (
        !newEl.isEqualNode(curEL) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //console.log(newEl.firstChild.nodeValue.trim());
        curEL.textContent = newEl.textContent;
      }
      //update Attribute
      if (!newEl.isEqualNode(curEL)) {
        [...newEl.attributes].forEach(attr =>
          curEL.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElment.innerHTML = '';
  }

  renderError(Message = this._errorMessage) {
    const markUp = `
  <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${Message}</p>
          </div>`;
    this._clear();
    this._parentElment.insertAdjacentHTML('afterbegin', markUp);
  }

  renderMessage(Message = this._Message) {
    const markUp = `
  <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${Message}</p>
          </div>`;
    this._clear();
    this._parentElment.insertAdjacentHTML('afterbegin', markUp);
  }

  renderSpinner() {
    const markUp = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`;
    this._parentElment.innerHTML = '';
    this._parentElment.insertAdjacentHTML('afterbegin', markUp);
  }
}
