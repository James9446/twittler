// *** Global Variables ***
const $body = $('body');
const $container = $('<div></div>');
const $navDiv = $('<div></div>');
const $navLinks = $('<ul></ul>');
const $home = $('<li><a>Home</a></li>');
const $postTweet = $('<li><a>Tweet</a></li>');
const $tweetInput = $('<input></input>');
const $search = $('<li><a>Search</a></li>');
const $searchInput = $('<input></input>');
const $twittlerStreamDiv = $('<div></div>');
const hashtags = {};
var currentIndex = streams.home.length - 1;
var $userStreamDiv;
var $searchStreamDiv;
 
// *** Functions ***
// ---=== Hashtag check and storage function ===---
function checkForHashtag(tweet) {
  var message = tweet.message;
  if (message.indexOf('#') > -1 && message.indexOf('span') === -1) {
    message = message.split('#');
    // Side effect that stores all hash-tags in an object to make tweets search-able
    tweet.message = message[0] + ' ' + '<span class="hash" id=' + message[1] + '>#' + message[1] + '</span>';
    if (hashtags.hasOwnProperty(message[1])) {
      hashtags[message[1]].push(tweet);
    } else {
      hashtags[message[1]] = [tweet];
    }
    return $('<p>' + tweet.message + '</p>');
  }
  return $('<p>' + message + '</p>');
}

// ---=== Index update ===---
function updateIndex() {
  if (streams.home.length - 1 > currentIndex) {
    currentIndex = streams.home.length - 1;
    return true;
  }
}

// ---=== Main DOM interface function for displaying tweets ===---
function addTweetsToDOM(tweetSource, shouldPrepend, tweetDiv, index) {
  while(index >= 0) {
    const tweet = tweetSource[index];
    const $tweet = $('<div></div>');
    const $user = $('<h3>@' + tweet.user + '</h3>');
    const $message = checkForHashtag(tweet);
    const $timeStamp = $('<p>' + '<span data-livestamp="' + tweet.created_at + '"></span>' + '</p>');
    $tweet.addClass('tweets');
    $user.prepend('<i class="fa fa-user-circle" aria-hidden="true"></i>');
    $user.addClass(' user row justify-content-left');
    $user.attr('id', tweet.user);
    $message.addClass('message row justify-content-center');
    $timeStamp.addClass('timeStamp row justify-content-center');
    $tweet.append($user).append($message).append($timeStamp);
    if (shouldPrepend) {
      tweetDiv.prepend($tweet);
    } else {
      tweetDiv.append($tweet);
    }    
    index -= 1;
  }
};
addTweetsToDOM (streams.home, true, $twittlerStreamDiv, currentIndex);

// // ---=== New Tweets ===---
setInterval(function() {
  if (updateIndex()) {
    const tweet = streams.home[streams.home.length - 1];
    const $tweet = $('<div></div>');
    const $user = $('<h3>@' + tweet.user + '</h3>');
    const $message = checkForHashtag(tweet);
    const $timeStamp = $('<p>' + '<span data-livestamp="' + tweet.created_at + '"></span>' + '</p>');
    $tweet.addClass('tweets');
    $user.prepend('<i class="fa fa-user-circle" aria-hidden="true"></i>');
    $user.addClass(' user row justify-content-left');
    $user.attr('id', tweet.user);
    $message.addClass('message row justify-content-center');
    $timeStamp.addClass('timeStamp row justify-content-center');
    $tweet.append($user).append($message).append($timeStamp);
    $twittlerStreamDiv.prepend($tweet);
  }
}, 100);

// *** Structure ***
$container.addClass('container');
$body.append($container);

// ---=== Navigation ===--- 
$navDiv.addClass('nav');
$navDiv.append($navLinks);
$body.prepend($navDiv);
// home button
$home.attr('id', 'home');
$navLinks.append($home);
$navLinks.append($postTweet);
// tweet button
$tweetInput.attr('id', 'tweetInput');
$tweetInput.attr('type', 'text');
$tweetInput.attr('placeholder', 'tweet:');
$navLinks.append($tweetInput);
$tweetInput.hide();
// search button
$search.attr('id','search');
$navLinks.append($search);
$searchInput.attr('id', 'searchInput');
$searchInput.attr('type', 'search');
$searchInput.attr('placeholder', '#:');
$searchInput.attr('autocomplete', true);
$navLinks.append($searchInput);
$searchInput.hide();

// ---=== Twittler Main Stream ===---
$container.append($twittlerStreamDiv);

// *** Event listeners ***
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

// ---=== Post Tweet ===---
$postTweet.on('click', function(event) {
  $tweetInput.toggle();
});

$tweetInput.keydown(function(event) {
  const newPost = $tweetInput.val();
  if (event.keyCode === 13) {
    writeTweet(newPost);
    $(this).val('');
    $tweetInput.hide(500);
  }
});

// ---=== Username selection ===---
$container.on('click', '.user', function(event) {
  const $backButton = $('<button>Back</button>');
  if ($userStreamDiv) {
    $userStreamDiv.remove();
  }
  if ($searchStreamDiv) {
    $searchStreamDiv.remove();
  }
  $userStreamDiv = $('<div></div>');
  $twittlerStreamDiv.slideUp(500);
  $userStreamDiv.slideDown(500);
  $container.append($userStreamDiv);
  addTweetsToDOM (streams.users[$(this.id).selector], false, $userStreamDiv, streams.users[$(this.id).selector].length - 1);
  $backButton.addClass('btn btn-primary');
  $userStreamDiv.append($backButton);
  $backButton.on('click', function() {
    $userStreamDiv.remove();
    $twittlerStreamDiv.show(500);
  });
});

// ---=== Search by hashtag ===--- 
$search.on('click', function(event) {
  $searchInput.toggle();
});
// input field
$searchInput.keydown(function(event) {
  const searchTerm = $searchInput.val();
  const $backButton = $('<button>Back</button>');
  var validSearch = false;
  if (event.keyCode === 13) {
    if ($searchStreamDiv) {
      $searchStreamDiv.remove();
    }
    if ($userStreamDiv) {
      $userStreamDiv.remove();
    }
    $searchStreamDiv = $('<div></div>');
    $twittlerStreamDiv.hide(500);
    $searchStreamDiv.slideDown(500);
    $container.append($searchStreamDiv);
    for (let key in streams.users) {
      if (key === searchTerm) {
        addTweetsToDOM (streams.users[searchTerm], false, $searchStreamDiv, streams.users[searchTerm].length - 1);
        validSearch = true;
      }
    }
    for (let key in hashtags) {
      if (key === searchTerm) {
        addTweetsToDOM (hashtags[searchTerm], false, $searchStreamDiv, hashtags[searchTerm].length -1);
        validSearch = true;
      }
    }
    if (!validSearch) {
      $searchStreamDiv.append($('<h2 class="error"> Sorry, no results for "<span>' + searchTerm + '</span>"</h2>'));
    }
    $(this).val('');
    $searchInput.hide(500);
    $backButton.addClass('btn btn-primary');
    $searchStreamDiv.append($backButton);
    $searchStreamDiv.append($backButton);
    $backButton.on('click', function() {
      $searchStreamDiv.remove();
      $twittlerStreamDiv.show(500);
    })
  }
});
// click #
$container.on('click', '.hash', function(event) {
  const searchTerm = $(this.id).selector;
  const $backButton = $('<button>Back</button>');
  if ($searchStreamDiv) {
    $searchStreamDiv.remove();
  }
  if ($userStreamDiv) {
    $userStreamDiv.remove();
  }
  $searchStreamDiv = $('<div></div>');
  $twittlerStreamDiv.hide(500);
  $searchStreamDiv.slideDown(500);
  $container.append($searchStreamDiv);
  addTweetsToDOM (hashtags[searchTerm], false, $searchStreamDiv, hashtags[searchTerm].length -1); 
  $searchInput.hide(500);
  $backButton.addClass('btn btn-primary');
  $searchStreamDiv.append($backButton);
  $searchStreamDiv.append($backButton);
  $backButton.on('click', function() {
    $searchStreamDiv.remove();
    $twittlerStreamDiv.show(500);
  })
});


