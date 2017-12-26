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
$searchInput.attr('type', 'search');
$searchInput.attr('placeholder', ' #:');
$searchInput.attr('autocomplete', true);
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

// ---=== Time ===---
// var initialTime = streams[0].users.created_at
// console.log(initialTime);
var timeOfPageLoad = new Date().getTime();
// console.log(d);

function createDynamicTimeStamp() {
  var currentTime = new Date().getTime();
  // timeStamp = tweet.created_at
  currentTime = (currentTime - timeOfPageLoad) / 60000;
  console.log(currentTime);
  if (currentTime < 1) {
    return 'Just now';
  }
  if (currentTime > 1) {
    return 'One minute ago';
  }
  if (currentTime > 2) {
    return 'Two minutes ago';
  }
  if (currentTime > 3) {
    return 'Three minutes ago';
  }
  if (currentTime > 4) {
    return 'Four minutes ago';
  }
  if (currentTime > 5) {
    return 'Five minutes ago';
  }
  if (currentTime > 6) {
    return 'Over five minutes ago';
  }
  if (currentTime > 10) {
    return 'Ten minutes ago';
  }
  if (currentTime > 11) {
    return 'Over Ten minutes ago';
  }
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
    // console.log('previousIndex:', previousIndex);
    // console.log('currentIndex:', currentIndex);
    return true;
  }

}

// ---=== Main DOM interface function for displaying tweets ===---
function addTweetsToDOM (tweetSource, prependTweetsTo, index, previousIndex) {
  while(index > previousIndex){
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
    const $timeStamp = $('<p>' + createDynamicTimeStamp() + '</p>');
    $timeStamp.addClass('timeStamp row justify-content-center');
    // user and tweet attached to tweet div
    $tweet.append($user).append($message).append($timeStamp);
    // tweet div attached to top of stream div
    $tweet.prependTo(prependTweetsTo);
    index -= 1;
  }
  // console.log('index:', index, 'previousIndex:', previousIndex);
};
addTweetsToDOM (streams.home, $twittlerStreamDiv, currentIndex, previousIndex);

// // ---=== New Tweets ===---
setInterval(function() {
  if (updateIndex()) {
    updateIndex();
    addTweetsToDOM(streams.home, $twittlerStreamDiv, currentIndex, previousIndex);
  }
  
}, 100);

// ---=== Event listener for user selection ===---
var $userStreamDiv;
$twittlerStreamDiv.on('click', '.user', function(event) {
  // console.log($(this.id).selector)
  // console.log(streams.users[$(this.id).selector])
  // console.log('length:', streams.users[$(this.id).selector].length)

  // create $userStreamDiv
  $userStreamDiv = $('<div></div>');
  $userStreamDiv.addClass('container')
    // Hide $twittlerStreamDiv    (also maybe also first hide $userStreamDiv incase it's clicked again)
  $twittlerStreamDiv.slideUp(1000);
    // Show $userStreamDiv
  $userStreamDiv.show();
  $body.append($userStreamDiv)
    // create an h3 element to display the username from from event.target

    // for each matching tweet in streams.users 
  addTweetsToDOM (streams.users[$(this.id).selector], $userStreamDiv, streams.users[$(this.id).selector].length - 1, 0)
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
    $userStreamDiv.remove();
    // $searchStreamDiv.slideUp(1500);
    $twittlerStreamDiv.show(500);
  })
})

// ---=== Search ===--- 

$search.on('click', function(event) {
  $searchInput.toggle();
  // $userStreamDiv.hide(500);
  // $searchStreamDiv.hide(500);
  // $twittlerStreamDiv.show(500);
  // Search button just toggles search input on and off
})

var $searchStreamDiv;
$searchInput.keydown(function(event) {
  const searchTerm = $searchInput.val();
  // if (searchTerm.indexOf('#') > -1) {
  //   searchTerm.split('').shift().join('');
  // }
  if (event.keyCode === 13) {
    if ($searchStreamDiv) {
      // this is to prevent multiple divs from being created if user does mutliple searches in a row
      $searchStreamDiv.remove();
    }
    console.log(searchTerm);
    $searchStreamDiv = $('<div></div>');
    $searchStreamDiv.addClass('container');
      // Hide $twittlerStreamDiv    (also maybe also first hide $searchStreamDiv incase it's clicked again);
    $twittlerStreamDiv.hide(500);
    // $userStreamDiv.hide(500)
      // Show $searchStreamDiv
    $searchStreamDiv.slideDown();
    $body.append($searchStreamDiv)
      // create an h3 element to display the username from from event.target

      // for each matching tweet in streams.users 
    addTweetsToDOM (hashtags[searchTerm], $searchStreamDiv, hashtags[searchTerm].length - 1, 0)
        // create a tweet message and prepend it to the modal div 
        // Do this by calling addTweetsToDom()  
          // with $searchStreamDiv passed in as first argument
          // streams.users[$(this.id).selector].length - 1 as the second argument
          // 0 as the third argument 
    $(this).val('');
    $searchInput.hide();
    const $backButton = $('<button>Back</button>');
    $backButton.addClass('btn btn-primary')
    $searchStreamDiv.append($backButton);
    $searchStreamDiv.prepend($backButton);
    $backButton.on('click', function() {
      $searchStreamDiv.remove();
      // $userStreamDiv.hide(500)
      $twittlerStreamDiv.show(500);
      // $searchInput.val() = '';
    })
  }
})

console.log($searchInput.val());

