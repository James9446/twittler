var hashtags = {};
function checkForHashtag(tweet) {
  var message = tweet.message
  var hashtag = [];
  if (message.indexOf('#') > -1) {
    message = message.split('#');
    // Side effect that stores all hash-tags in an object to make them search-able 
    tweet.message = message[0] + '<span>#' + message[1] + '</span>'
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

var index = streams.home.length - 1;
while(index >= 0){
  var tweet = streams.home[index];
  // console.log('index:', index)

  var $tweet = $('<div></div>');
  $tweet.addClass('tweets')
  const $user = $('<h3>' + tweet.user + '</h3>');
  $user.addClass('user row justify-content-left');

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
console.log('streams.home',streams.home)
// const $title = $('<h4>What\'s happening now on twittler</h4>');
// $twittlesStreamDiv.prepend($title);

console.log(tweet);

// ---=== New Tweets ===---


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