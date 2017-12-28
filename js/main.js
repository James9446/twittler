// *** Variables ***
const $body = $('body');
const $container = $('<div></div>');
const $navDiv = $('<div></div>');
const $navLinks = $('<ul></ul>');
const $home = $('<li><a>Home</a></li>');
const $postTweet = $('<li><a>Tweet</a></li>');
const $tweetInput = $('<input></input>');
const $search = $('<li><a>Search</a></li>');
const $searchInput = $('<input></input>');
const hashtags = {};
const $twittlerStreamDiv = $('<div></div>');
var currentIndex = streams.home.length - 1;
var previousIndex = 0;
var $userStreamDiv;
var $searchStreamDiv;
 
$container.addClass('container');
$body.append($container);
// ---=== Navigation ===--- 
$navDiv.addClass('nav');
$navDiv.append($navLinks);
$body.prepend($navDiv);
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
$container.append($twittlerStreamDiv);


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
    // previousIndex = currentIndex;
    currentIndex = streams.home.length - 1;
    // console.log('previousIndex:', previousIndex);
    // console.log('currentIndex:', currentIndex);
    return true;
  }
}

// ---=== Main DOM interface function for displaying tweets ===---
function addTweetsToDOM(tweetSource, shouldPrepend, prependTweetsTo, index) {
  while(index >= 0) {
    // console.log('index:', index, 'previousIndex:', previousIndex);
    const tweet = tweetSource[index];
    // div for each tweet
    const $tweet = $('<div></div>');
    $tweet.addClass('tweets');
    // user
    const $user = $('<h3>@' + tweet.user + '</h3>');
    $user.prepend('<i class="fa fa-user-circle" aria-hidden="true"></i>');
    $user.addClass(' user row justify-content-left');
    $user.attr('id', tweet.user);
    // tweet message and hashtag
    const $message = checkForHashtag(tweet);
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
addTweetsToDOM (streams.home, true, $twittlerStreamDiv, currentIndex);

// // ---=== New Tweets ===---
setInterval(function() {
  if (updateIndex()) {
    const tweet = streams.home[streams.home.length - 1];
    // div for each tweet
    const $tweet = $('<div></div>');
    $tweet.addClass('tweets');
    // user
    const $user = $('<h3>@' + tweet.user + '</h3>');
    $user.prepend('<i class="fa fa-user-circle" aria-hidden="true"></i>');
    $user.addClass(' user row justify-content-left');
    $user.attr('id', tweet.user);
    // tweet message and hashtag
    const $message = checkForHashtag(tweet);
    $message.addClass('message row justify-content-center');
    // Time stamp
    const $timeStamp = $('<p>' + '<span data-livestamp="' + tweet.created_at + '"></span>' + '</p>');
    $timeStamp.addClass('timeStamp row justify-content-center');
    // user and tweet attached to tweet div
    $tweet.append($user).append($message).append($timeStamp);
    $twittlerStreamDiv.prepend($tweet);
  }
}, 100);


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

// ---=== postTweet ===---
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
  const $backButton = $('<button>Back</button>');
  $backButton.addClass('btn btn-primary');
  $userStreamDiv.append($backButton);
  $backButton.on('click', function() {
    $userStreamDiv.remove();
    $twittlerStreamDiv.show(500);
  });
});

// ---=== Search ===--- 
$search.on('click', function(event) {
  $searchInput.toggle();
});
// input field
$searchInput.keydown(function(event) {
  const searchTerm = $searchInput.val();
  if (event.keyCode === 13) {
    if ($searchStreamDiv) {
      $searchStreamDiv.remove();
    }

    $searchStreamDiv = $('<div></div>');
    $twittlerStreamDiv.hide(500);
    $searchStreamDiv.slideDown(500);
    $container.append($searchStreamDiv)
    addTweetsToDOM (hashtags[searchTerm], false, $searchStreamDiv, hashtags[searchTerm].length -1); 
    $(this).val('');
    $searchInput.hide(500);
    const $backButton = $('<button>Back</button>');
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
  console.log(searchTerm);
    if ($searchStreamDiv) {
      $searchStreamDiv.remove();
    }
    if ($userStreamDiv) {
      $userStreamDiv.remove();
    }
    $searchStreamDiv = $('<div></div>');
    $twittlerStreamDiv.hide(500);
    $searchStreamDiv.slideDown(500);
    $container.append($searchStreamDiv)
    addTweetsToDOM (hashtags[searchTerm], false, $searchStreamDiv, hashtags[searchTerm].length -1); 
    $searchInput.hide(500);
    const $backButton = $('<button>Back</button>');
    $backButton.addClass('btn btn-primary');
    $searchStreamDiv.append($backButton);
    $searchStreamDiv.append($backButton);
    $backButton.on('click', function() {
      $searchStreamDiv.remove();
      $twittlerStreamDiv.show(500);
    })
});


