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

const $search = $('<li><a>Search</a></li>');
$search.attr('id','search');
$navLinks.append($search);

const $searchInput = $('<input></input>');
$searchInput.attr('id', 'searchInput');
$searchInput.attr('type', 'text');
$searchInput.attr('placeholder', ' #:');
$navDiv.append($searchInput)
$searchInput.hide();

// ---=== Hashtag check and storage function ===---
var hashtags = {};
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

// ---=== Twittler Main Stream ===---
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

// ---=== Main DOM interface function for displaying tweets ===---
function addTweetsToDOM (tweetSource, prependTweetsTo, index, previousIndex) {
  while(index > previousIndex){
    const tweet = tweetSource[index];
    // div for each tweet
    const $tweet = $('<div></div>');
    $tweet.addClass('tweets')
    // user
    const $user = $('<h3>@' + tweet.user + '</h3>');
    $user.addClass(' user row justify-content-left');
    $user.attr('id', tweet.user);
    // tweet message and hashtag
    const $message = $('<p>' + checkForHashtag(tweet) + '</p>');
    $message.addClass('message row justify-content-center')
    // Time stamp
    const $timeStamp = $('<p>' + tweet.created_at + '</p>');
    $timeStamp.addClass('timeStamp row justify-content-center');
    // user and tweet attached to tweet div
    $tweet.append($user).append($message).append($timeStamp);
    // tweet div attached to top of stream div
    $tweet.prependTo(prependTweetsTo);
    index -= 1;
  }
};
addTweetsToDOM (streams.home, $twittlerStreamDiv, currentIndex, previousIndex);

// // ---=== New Tweets ===---
// setInterval(function() {
//   updateIndex();
//   addTweetsToDOM(streams.home, $twittlerStreamDiv, currentIndex, previousIndex);
// }, 2000);

// ---=== Event listener for user selection ===---
$twittlerStreamDiv.on('click', '.user', function(event) {
  console.log($(this.id).selector)
  console.log(streams.users[$(this.id).selector])
  console.log('length:', streams.users[$(this.id).selector].length)

  // create $userStreamDiv
  const $userStreamDiv = $('<div></div>');
  $userStreamDiv.addClass('container')
    // Hide $twittlerStreamDiv    (also maybe also first hide $userStreamDiv incase it's clicked again)
  $twittlerStreamDiv.hide(500);
    // Show $userStreamDiv
  $userStreamDiv.show();
  $body.append($userStreamDiv)
    // create an h3 element to display the username from from event.target

    // for each matching tweet in streams.users 
  addTweetsToDOM (streams.users[$(this.id).selector], $userStreamDiv, streams.users[$(this.id).selector].length -1, 0)
      // create a tweet message and prepend it to the modal div 
      // Do this by calling addTweetsToDom()  
        // with $userStreamDiv passed in as first argument
        // streams.users[$(this.id).selector].length - 1 as the second argument
        // 0 as the third argument 
  const $backButton = $('<button>Back</button>');
  $backButton.addClass('btn btn-primary')
  $userStreamDiv.append($backButton);
  $userStreamDiv.prepend($backButton);
  $backButton.on('click', function() {
    $userStreamDiv.hide(500);
    $twittlerStreamDiv.show(500);
  })
})

// ---=== Search button ===--- 

$search.on('click', function(event) {
  $searchInput.show();
})

// $searchInput

