let ideas = [];

displayInitialIdeas()

document.querySelector('.js-idea-form').addEventListener('submit', handleSubmit);
document.querySelector('.js-ideas-contain').addEventListener('click', handleClick);
document.querySelector('.js-ideas-contain').addEventListener('focusout', handleEdit);
document.querySelector('.js-search').addEventListener('keyup', handleSearch)

function displayIdeaCard({ title, body, id, quality }) {
  document.querySelector('.js-ideas-contain').insertAdjacentHTML('afterBegin',
    `<div class="js-idea-bubble idea-bubble" data-id=${id}>
    <h2 class= "js-idea-title" contenteditable = "true" >${title}</h2 >
    <p class="js-idea-body" contenteditable="true">${body}</p>
    <div class="quality-sect">
      <i class="js-upvote fas fa-chevron-circle-up"></i>
      <i class="js-downvote fas fa-chevron-circle-down"></i>
      <p class="js-quality quality">Quality: ${quality}</p>
      <i class="js-delete far fa-times-circle"></i>
    </div>
    </div>`);
}

function displayInitialIdeas() {
  if (localStorage.getItem('ideas') && localStorage.getItem('ideas').length > 0) {
    repopulateIdeas()
  }
}

function decreaseQuality() {
  const dataId = parseInt(event.target.closest('.js-idea-bubble').dataset.id);
  ideas.forEach(idea => {
    if (idea.id === dataId) {
      idea.updateQuality('down');
      event.target.nextElementSibling.innerHTML = `Quality: ${idea.quality}`;
      idea.saveToStorage(ideas);
    }
  });
}

function handleClick(event) {
  const { classList } = event.target
  if (classList.contains('js-delete')) {
    removeIdea(event.target.closest('.js-idea-bubble'))
  } else if (classList.contains('js-upvote')) {
    increaseQuality()
  } else if (classList.contains('js-downvote')) {
    decreaseQuality(event)
  }
}

function handleEdit(event) {
  const { innerHTML, previousElementSibling, nextElementSibling } = event.target
  if (event.target.classList.contains('js-idea-title')) {
    updateSelf(innerHTML, nextElementSibling.innerHTML, event.target.closest('.js-idea-bubble').dataset.id)
  } else if (event.target.classList.contains('js-idea-body')) {
    updateSelf(previousElementSibling.innerHTML, innerHTML, event.target.closest('.js-idea-bubble').dataset.id)
  }
}

function handleSearch() {
  document.querySelector('.js-ideas-contain').innerHTML = '';
  const query = document.querySelector('.js-search').value.toLowerCase();
  const filteredIdeas = ideas.filter(idea => {
    return (idea.title.toLowerCase().includes(query) || idea.body.toLowerCase().includes(query)) 
  });
  filteredIdeas.forEach(idea => displayIdeaCard(idea));
}

function handleSubmit(event) {
  event.preventDefault();
  const title = document.querySelector('.js-title-input');
  const body = document.querySelector('.js-body-input')
  createIdea(title.value, body.value);
  title.value = '';
  body.value = '';

}

function increaseQuality() {
  const dataId = parseInt(event.target.closest('.js-idea-bubble').dataset.id);
  ideas.forEach(idea => {
    if (idea.id === dataId) {
      idea.updateQuality('up');
      event.target.nextElementSibling.nextElementSibling.innerHTML = `Quality: ${idea.quality}`;
      idea.saveToStorage(ideas);
    }
  });
}

function updateSelf(title, body, dataId) {
  const id = parseInt(dataId)
  ideas.forEach(idea => {
    if(idea.id === id) {
      idea.updateContent(title, body)
    }
  });
}

function createIdea(title, body) {
  const idea = new Idea(title, body);
  ideas = [...ideas, idea];
  idea.saveToStorage(ideas);
  displayIdeaCard(idea);
}

function removeIdea(ideaCard) {
  const dataId = parseInt(ideaCard.dataset.id);
  const updatedIdeas = ideas.filter(idea => {
    if(idea.id === dataId) {
      idea.deleteFromStorage(ideas)
    }
    return idea.id !== dataId
  });
  ideas = [...updatedIdeas];
  ideaCard.closest('.js-idea-bubble').remove()
}

function repopulateIdeas() {
  const storedIdeas = JSON.parse(localStorage.getItem('ideas'));
  const instancitedIdeas = storedIdeas.map(idea => {
    const updateIdea = new Idea(idea.title, idea.body, idea.id, idea.quality, idea.qualityIndex);
    displayIdeaCard(updateIdea);
    return updateIdea;
  });

  ideas = [...instancitedIdeas]
}



