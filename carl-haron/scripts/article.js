'use strict';

function Article(rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// COMMENT: Why isn't this method written as an arrow function?
// DONE - It uses contextual this so to maintain the scope it can't be an arrow function.
Article.prototype.toHtml = function () {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn)) / 60 / 60 / 24 / 1000);

  // COMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // DONE - The ternary operator is in place of an if/else statement. It's checking if there is a value for this.publishedOn, after the '?' the first value is if it's true, after the colon is the value if it's false.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// DONE - This function will be called in the if statement of the fetchAll method. 'rawData' represents the array of the blog articles which will be parsed before passing it into the loadAll method.
Article.loadAll = rawData => {
  rawData.sort((a, b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  rawData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage?
  console.log('checking local storage');
  if (localStorage.rawData) {
    console.log('local storage - yes');
    let dataToLoad = JSON.parse(localStorage.rawData);
    Article.loadAll(dataToLoad);
    articleView.initIndexPage();
  }else {
    console.log('local storage - no');
    $.getJSON('data/hackerIpsum.json')
      .then((data) => {
        localStorage.setItem('rawData', JSON.stringify(data));
        let dataToLoad = JSON.parse(localStorage.rawData);
        Article.loadAll(dataToLoad);
        articleView.initIndexPage();
      })
  }
}