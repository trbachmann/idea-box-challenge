class Idea {
  constructor(title, body, id = Date.now(), quality = 'Swill', qualityIndex = 0) {
    this.title = title;
    this.body = body;
    this.quality = quality;
    this.qualityIndex = qualityIndex;
    this.id = id;
  }

  saveToStorage(ideas) {
    localStorage.setItem('ideas', JSON.stringify(ideas));
  }
  
  deleteFromStorage(ideas) {
    const updatedIdeas = ideas.filter(idea => idea.id !== this.id);
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
  }

  updateContent(title, body) {
    this.title = title;
    this.body = body;
    this.saveToStorage(ideas);
  }

  updateQuality(type) {
    const qualities = ['Swill', 'Plausible', 'Genius'];
    if (type === 'up' && this.qualityIndex !== 2) {
      this.qualityIndex++
    } else if ( type === 'down' && this.qualityIndex !== 0) {
      this.qualityIndex--
    }

    this.quality = qualities[this.qualityIndex];
  }
}