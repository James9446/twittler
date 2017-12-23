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

var $body = $('body');
$body.html('');


// ---=== Twittler stream ===---
const $twittlesStreamDiv = $('<div></div>');
$twittlesStreamDiv.addClass('container')
$body.append($twittlesStreamDiv);

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


// var numberOfTweets = index;
function addTweetsToDOM () {
  index = currentIndex;
  while(index > previousIndex){
    var tweet = streams.home[index];
    // console.log('index:', index)

    var $tweet = $('<div></div>');
    $tweet.addClass('tweets')
    const $user = $('<h3>@' + tweet.user + '</h3>');
    $user.addClass('user row justify-content-left');
    // console.log(checkForHashtag(tweet));
    const $message = $('<p>' + checkForHashtag(tweet) + '</p>');
    $message.addClass('message row justify-content-center')
    // $message.addClass('message');

    // $tweet.text('@' + $user + ': ' + $message);
    // $tweet.html('<h3>' + $user + '</h3>')
    $tweet.append($user).append($message);

    $tweet.prependTo($twittlesStreamDiv);
    index -= 1;
    // console.log(tweet);
  }
  // var addMore = addTweetsToDOM();
  // addMore.delay(1000);
};
addTweetsToDOM ();

// setInterval(function() {
  // if (streams.home.length - 1 > currentIndex) {
  //   previousIndex = currentIndex
  //   currentIndex = streams.home.length - 1
  //   console.log('previousIndex:', previousIndex)
  //   console.log('currentIndex:', currentIndex);
  // }
// }, 5000);


setInterval(function() {
  updateIndex();
  addTweetsToDOM();
}, 5000);

  // var addMore = addTweetsToDOM();
  // addMore.delay(1000);
// ---=== Add event listener to streams.home
// if (numberOfTweets < streams.home.length - 1) {
//   console.log('more tweets are here')
// } 
// console.log('streams.home',streams.home)
// const $title = $('<h4>What\'s happening now on twittler</h4>');
// $twittlesStreamDiv.prepend($title);

// console.log(tweet);

// ---=== New Tweets ===---
// var newIndex = streams.home.length - 1;
// setInterval(function() {
//   newIndex = streams.home.length - 1;
// }, 500)

// function addNewTweetsToDOM () {

//   while(newIndex >= index){
//     var tweet = streams.home[newIndex];
//     // console.log('index:', index)

//     var $tweet = $('<div></div>');
//     $tweet.addClass('tweets')
//     const $user = $('<h3>@' + tweet.user + '</h3>');
//     $user.addClass('user row justify-content-left');
//     console.log(checkForHashtag(tweet));
//     const $message = $('<p>' + checkForHashtag(tweet) + '</p>');
//     $message.addClass('message row justify-content-center')
//     // $message.addClass('message');

//     // $tweet.text('@' + $user + ': ' + $message);
//     // $tweet.html('<h3>' + $user + '</h3>')
//     $tweet.append($user).append($message);

//     $tweet.prependTo($twittlesStreamDiv);
//     newIndex -= 1;
//     // console.log(tweet);
//   }
//     // console.log(tweet);
//   // var addMore = addTweetsToDOM();
//   // addMore.delay(1000);
//   index = newIndex;
// };

// setInterval( addNewTweetsToDOM(), 500);

// ---=== hashtag checker ===---
// function(string) {
//   if (string.indexOf('#')) {
//     return true;
//   }
// }

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


        // const $title = $('<h1>Tweets: </h1>');
        // $($title).addClass('title');
        // $('body').prepend($title);
      // });