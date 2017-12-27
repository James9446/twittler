// *** Variables ***
var $body = $('body');
const $navDiv = $('<div></div>');
const $navLinks = $('<ul></ul>');
const $home = $('<li><a>Home</a></li>');
const $postTweet = $('<li><a>Tweet</a></li>');
const $tweetInput = $('<input></input>');
const $search = $('<li><a>Search</a></li>');
const $searchInput = $('<input></input>');
var hashtags = {};
const $twittlerStreamDiv = $('<div></div>');
var currentIndex = streams.home.length - 1;
var previousIndex = 0;
var $userStreamDiv;
var $searchStreamDiv;

// $body.html('');


// ---=== Navigation ===---  
$navDiv.addClass('nav');
$body.prepend($navDiv);
$navDiv.append($navLinks);
// home
$home.attr('id', 'home');
$navLinks.append($home);
$navLinks.append($postTweet);
// tweet
$tweetInput.attr('id', 'tweetInput');
$tweetInput.attr('type', 'text');
$tweetInput.attr('placeholder', 'tweet:');
$navLinks.append($tweetInput);
$tweetInput.hide();
// search
$search.attr('id','search');
$navLinks.append($search);
$searchInput.attr('id', 'searchInput');
$searchInput.attr('type', 'search');
$searchInput.attr('placeholder', '#:');
$searchInput.attr('autocomplete', true);
$navLinks.append($searchInput);
$searchInput.hide();

// ---=== Twittler Main Stream ===---
$twittlerStreamDiv.addClass('container')
$body.append($twittlerStreamDiv);


// *** Functions ***
// ---=== Hashtag check and storage function ===---
function checkForHashtag(tweet) {
  var message = tweet.message
  var hashtag = [];
  if (message.indexOf('#') > -1) {
    message = message.split('#');
    // Side effect that stores all hash-tags in an object to make tweets search-able
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

// ---=== Index update ===---
function updateIndex() {
  if (streams.home.length - 1 > currentIndex) {
    previousIndex = currentIndex;
    currentIndex = streams.home.length - 1;
    // console.log('previousIndex:', previousIndex);
    // console.log('currentIndex:', currentIndex);
    return true;
  }
}

// ---=== Main DOM interface function for displaying tweets ===---
function addTweetsToDOM (tweetSource, shouldPrepend, prependTweetsTo, index, previousIndex) {
  while(index >= previousIndex){
    // console.log('index:', index, 'previousIndex:', previousIndex);
    const tweet = tweetSource[index];
    // div for each tweet
    const $tweet = $('<div></div>');
    $tweet.addClass('tweets');
    // user
    const $user = $('<h3>@' + tweet.user + '</h3>');
    $user.addClass(' user row justify-content-left');
    $user.attr('id', tweet.user);
    // tweet message and hashtag
    const $message = $('<p>' + checkForHashtag(tweet) + '</p>');
    $message.addClass('message row justify-content-center');
    // Time stamp
    const $timeStamp = $('<p>' + '<span data-livestamp="' + tweet.created_at + '"></span>' + '</p>');
    $timeStamp.addClass('timeStamp row justify-content-center');
    // user and tweet attached to tweet div
    $tweet.append($user).append($message).append($timeStamp);
    // tweet div attached to top of stream div
    if (shouldPrepend) {
      prependTweetsTo.prepend($tweet);
    } else {
      prependTweetsTo.append($tweet);
    }    
    index -= 1;
  }
  // console.log('index:', index, 'previousIndex:', previousIndex);
};
addTweetsToDOM (streams.home, true, $twittlerStreamDiv, currentIndex, previousIndex);

// // ---=== New Tweets ===---
setInterval(function() {
  if (updateIndex()) {
    updateIndex();
    addTweetsToDOM(streams.home, true, $twittlerStreamDiv, currentIndex, previousIndex);
  }
  
}, 100);


// *** Event listeners ***
// ---=== user selection ===---
$twittlerStreamDiv.on('click', '.user', function(event) {
  $userStreamDiv = $('<div></div>');
  $userStreamDiv.addClass('container');
  $twittlerStreamDiv.slideUp(1000);
  $userStreamDiv.show();
  $body.append($userStreamDiv);
  addTweetsToDOM (streams.users[$(this.id).selector], false, $userStreamDiv, streams.users[$(this.id).selector].length - 1, 0);
  const $backButton = $('<button>Back</button>');
  $backButton.addClass('btn btn-primary');
  $userStreamDiv.prepend($backButton);
  $backButton.on('click', function() {
    $userStreamDiv.remove();
    $twittlerStreamDiv.show(500);
  });
});

// ---=== Home ===---
$home.on('click', function(event) {
  if ($searchStreamDiv) {
      $searchStreamDiv.remove();
    }
  if ($userStreamDiv) {
      $userStreamDiv.remove();
    }
  $twittlerStreamDiv.show(500);

});

// // ---=== postTweet ===---
// $postTweet.on('click', function(event) {
//   $tweetInput.toggle();
// });

// $tweetInput.keydown(function(event) {
//   const newPost = $tweetInput.val();
//   if (event.keyCode === 13) {
//     console.log(writeTweet(newPost));
//     writeTweet(newPost);
//   }
// });

// ---=== Search ===--- 
$search.on('click', function(event) {
  $searchInput.toggle();
});

$searchInput.keydown(function(event) {
  const searchTerm = $searchInput.val();
  if (event.keyCode === 13) {
    if ($searchStreamDiv) {
      $searchStreamDiv.remove();
    }
    $searchStreamDiv = $('<div></div>');
    $searchStreamDiv.addClass('container');
    $twittlerStreamDiv.hide(500);
    if ($userStreamDiv) {
      $userStreamDiv.remove();
    }
    $searchStreamDiv.slideDown();
    $body.append($searchStreamDiv)
    addTweetsToDOM (hashtags[searchTerm], false, $searchStreamDiv, hashtags[searchTerm].length - 1, 0); 
    $(this).val('');
    $searchInput.hide();
    const $backButton = $('<button>Back</button>');
    $backButton.addClass('btn btn-primary');
    $searchStreamDiv.append($backButton);
    $searchStreamDiv.prepend($backButton);
    $backButton.on('click', function() {
      $searchStreamDiv.remove();
      $twittlerStreamDiv.show(500);
    })
  }
  // Usernames from search result can be selected 
  $searchStreamDiv.on('click', '.user', function(event) {
    $userStreamDiv = $('<div></div>');
    $userStreamDiv.addClass('container');
    $searchStreamDiv.slideUp(500);
    $userStreamDiv.show();
    $body.append($userStreamDiv);
    addTweetsToDOM (streams.users[$(this.id).selector], false, $userStreamDiv, streams.users[$(this.id).selector].length - 1, 0);
    const $backButton = $('<button>Back</button>');
    $backButton.addClass('btn btn-primary');
    $userStreamDiv.prepend($backButton);
    $backButton.on('click', function() {
      $userStreamDiv.remove();
      $searchStreamDiv.show(500);
    });
  });
});


