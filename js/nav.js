"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSpacer.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Shows add story form when a click happens on 'Submit Story'
function navSubmitClick (evt) {
  console.debug('navSubmitClick', evt);
  hidePageComponents();
  $('#all-stories-list').show();
  $('submit-form').show();
}

$('#nav-submit-story').on('click', navSubmitClick);

// Shows user favorite stories when click on 'Favorite Stories'
function navFavoriteStoriesClick (evt) {
  console.debug('navFavoriteStoriesClick', evt);
  hidePageComponents();
  putFavoriteStoriesOnPage();
} 

$body.on('click', '#nav-favorites', navFavoriteStoriesClick);

// Shows user myStories on click 'My Stories'
function navMyStoriesClick (evt) {
  console.debug('navMyStoriesClick', evt);
  hidePageComponents();
  putOwnStoriesOnPage();
  $('#my-stories').show();
}

$body.on('click', '#nav-my-stories', navMyStoriesClick);

// Hide everything but profile on click on 'profile'
function navProfileClick(evt) {
  console.debug('navProfileClick', evt);
  hidePageComponents();
  $userProfile.show();
}
$navUserProfile.on('click', navProfileClick);