"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //checks if user is logged in, if so, show their favorites
  const loggedIn = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? deleteBtnHTML() : ""}
      ${loggedIn ? favStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//Add delete button for HTML story
function deleteBtnHTML() {
  return `<span class="trash-can">&#128465;</span>`
}

//Stars to show depending on if a favorite or not
function favStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
    <span class="star">
    <i class ="${starType} fa-star"></i>
    </span>`;
}

//Removes a story from DOM
async function deleteStory(evt) {
  console.debug('deleteStory');
  const $closestLi = $(evt.target).closest('li');
  const storyId = $closestLi.attr('id');

  await storyList.removeStory(currentUser, storyId);

  await putOwnStoriesOnPage();
}
$('my-stories').on('click', '.trash-can', deleteStory);

//Shows  the list of stories created by current user
function putOwnStoriesOnPage() {
  console.debug('putOwnStoriesOnPage');

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user</h5>");
  } else {
    //make loop for all of users stories and generate HTML for story
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

//Shows list of favorite stories
function putFavoriteStoriesOnPage() {
  console.debug('putFavoriteStoriesOnPage');

  $favoritedStories.empty();

  if(currentUser.favorites.length === 0) {
    $favoritedStories.append('<h5>No favorites added</h5>');
  } else {
    //create loop to iterate over all user favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      let $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}

//Handler for adding/removing a favorite story
async function toggleStoryFavorite(evt) {
  console.debug('toggleStoryFavorite');

  const $target = $(evt.target);
  const $parentLi = $target.closest('li');
  const storyId = $parentLi.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  //check if target story is a favorite
  if ($target.hasClass("fas")) {
    //if target story is a favorite, unfavorite and empty star icon
    await currentUser.removeFavorite(story);
    $target.closest('i').toggleClass('fas far');
  } else {
    //if target story is not a favorite, favorite it and fill star icon
    await currentUser.addFavoriteStory(story);
    $target.closest("i").toggleClass('fas far');
  }
}
$('.stories-list').on('click', '.star', toggleStoryFavorite);

//Submitting new story form
async function submitNewStory(evt) {
  console.debug('submitNewStory');
  evt.preventDefault();

  //new story form inputs
  const title = $('#create-title').val();
  const author = $('#create-author').val();
  const url = $('#create-url').val();
  const username = currentUser.username;
  const storyData = {title, url, author, username};
  
  // creates the new story and prepends it to story list
  const story = await storyList.addStory(currentUser, storyData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  // resets and hides form
  $('#submit-form').slideUp('slow');
  $('#submit-form').trigger('reset');
}
$('#submit-form').on('submit', submitNewStory);