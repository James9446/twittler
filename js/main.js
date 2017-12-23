var $body = $('body');
$body.html('');

// ---=== Navigation ===---  
const $navDiv = $('<div></div>');
$navDiv.addClass('nav');
$body.prepend($navDiv);

const $navLinks = $('<ul></ul>');
$navDiv.append($navLinks);

const $home = $('<li><a href="">Home</a></li>');
$navLinks.append($home);

const $following = $('<li><a href="">Following</a></li>');
$navLinks.append($following);

const $search = $('<li><a href="">Search</a></li>');
$navLinks.append($search);

// ---=== Hashtag check and storage function ===---
var hashtags = {};
function checkForHashtag(tweet) {
  var message = tweet.message
  var hashtag = [];
  if (message.indexOf('#') > -1) {
    message = message.split('#');
    // Side effect that stores all hash-tags in an object to make them search-able 
    tweet.message = message[0] + ' ' + '<span>' + '#' + message[1] + '</span>'
    if (hashtags.hasOwnProperty(message[1])) {
      hashtags[message[1]].push(tweet);
    } else {
      hashtags[message[1]] = [tweet];
    }
    return tweet.message;
  }
  return message;
}

// ---=== Twittler stream ===---
const $twittlerStreamDiv = $('<div></div>');
$twittlerStreamDiv.addClass('container')
$body.append($twittlerStreamDiv);

var currentIndex = streams.home.length - 1;
var previousIndex = 0;

function updateIndex() {
  if (streams.home.length - 1 > currentIndex) {
    previousIndex = currentIndex;
    currentIndex = streams.home.length - 1;
    // console.log('previousIndex:', previousIndex)
    // console.log('currentIndex:', currentIndex);
  }
}

function addTweetsToDOM () {
  index = currentIndex;
  while(index > previousIndex){
    var tweet = streams.home[index];
    // div for each tweet
    var $tweet = $('<div></div>');
    $tweet.addClass('tweets')
    // user
    const $user = $('<h3>@' + tweet.user + '</h3>');
    $user.addClass('user row justify-content-left');
    // tweet message and hashtag
    const $message = $('<p>' + checkForHashtag(tweet) + '</p>');
    $message.addClass('message row justify-content-center')
    // user and tweet attached to tweet div
    $tweet.append($user).append($message);
    // tweet div attached to top of stream div
    $tweet.prependTo($twittlerStreamDiv);
    index -= 1;
  }
};
addTweetsToDOM ();

setInterval(function() {
  updateIndex();
  addTweetsToDOM();
}, 2000);



