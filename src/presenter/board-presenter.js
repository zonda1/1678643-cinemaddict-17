import {NewFilmsSectionView} from '../view/new-films-section-view';
import {NewFilmsListSectionView} from '../view/new-films-list-section-view';
import {NewFilmsListContainerView} from '../view/new-films-container-view';
import {NewButtonView} from '../view/new-button-view.js';
import {NewFilmCardView} from '../view/new-film-card-view.js';
import {render} from '../render.js';
import {NewPopupView} from '../view/new-popup-view.js';
import {NewCommentsView} from '../view/new-popup-view.js';


const siteBody=document.querySelector('body');
export class BoardPresenter {
  #boardContainer=null;
  #featureModel=null;
  #boardFeatures=[];
  filmsSection = new NewFilmsSectionView();
  filmsListSection = new NewFilmsListSectionView();
  filmsListContainer = new NewFilmsListContainerView();


  init = (boardContainer,featureModel) => {

    this.#boardContainer = boardContainer;
    this.#featureModel = featureModel;
    this.#boardFeatures = [...this.#featureModel.features];

    render(this.filmsSection, this.#boardContainer);
    render(this.filmsListSection, this.filmsSection.element);
    render(this.filmsListContainer, this.filmsListSection.element);


    for (let i = 0; i < this.#boardFeatures.length; i++) {
      this.#renderFeature(this.#boardFeatures[i]);
    }

    render(new NewButtonView(), this.filmsListSection.element);
  };

  #renderFeature(task) {
    const popupComments = this.#featureModel.getCommentForFeature(this.#boardFeatures[0].id);
    const commentsAmount=popupComments.length;
    const featureComponent= new NewFilmCardView(task);
    render(featureComponent, this.filmsListContainer.element);

    function renderPopup() {
      const popupComponent=new NewPopupView(task);
      document.body.append(popupComponent.element);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', onEscKeyDown);
      popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', onCloseButtonClick);
    }

    function renderPopupComments(arr) {
      for (let j = 0; j < arr.length; j++) {
        render(new NewCommentsView(arr[j]), siteBody.querySelector('.film-details__comments-list'));
      }
      siteBody.querySelector('.film-details__comments-count').textContent=commentsAmount;
    }

    featureComponent.element.addEventListener('click',()=>{
      renderPopup();
      renderPopupComments(popupComments);
    });

    function onCloseButtonClick() {
      document.querySelector('.film-details').remove();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('click', onCloseButtonClick);
      document.removeEventListener('keydown', onEscKeyDown);
    }

    function onEscKeyDown(evt) {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        document.querySelector('.film-details').remove();
        document.body.classList.remove('hide-overflow');
        document.removeEventListener('keydown', onEscKeyDown);
        document.removeEventListener('click', onCloseButtonClick);
      }
    }
  }
}
