require('fastclick')(document.body);

// Get the hash of the url /////////////////////////start of auth
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '4b2ee515c60b4396af0d0932511b1634';
const redirectUri = 'https://healthy-composer.glitch.me/';
const scopes = [
  'streaming',
  'user-read-birthdate',
  'user-read-private',
  'user-modify-playback-state'
];


// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
}

////////////////////end of auth




////////////////////////////////////

var webplayerdeviceid 
var assign = require('object-assign');
var createConfig = require('./../config');
var createRenderer = require('./../lib/createRenderer');
var createLoop = require('raf-loop');
var contrast = require('wcag-contrast');

var canvas = document.querySelector('#canvas');
var background = new window.Image();

var palette;


var context = canvas.getContext('2d');

var loop = createLoop();
var seedContainer = document.querySelector('.seed-container');
var seedText = document.querySelector('.seed-text');

var isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);

if (isIOS) { // iOS bugs with full screen ...
  const fixScroll = () => {
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 500);
  };

  fixScroll();
  window.addEventListener('orientationchange', () => {
    fixScroll();
  }, false);
}

window.addEventListener('resize', resize);
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
canvas.style.position = 'absolute';

var randomize = (palette) => {
  reload(createConfig(), palette);
};

resize();

const targets = [ document.querySelector('#fill'), canvas ];

function reload (config, palette) {
  loop.removeAllListeners('tick');
  loop.stop();

  var opts = assign({
    backgroundImage: background,
    context: context,
    palette: palette
  }, config);

  var pixelRatio = typeof opts.pixelRatio === 'number' ? opts.pixelRatio : 1;
  canvas.width = opts.width * pixelRatio;
  canvas.height = opts.height * pixelRatio;
  
  
  console.log('palette before bg:', opts.palette)

  document.body.style.background = opts.palette[0];

  seedContainer.style.color = getBestContrast(opts.palette[0], opts.palette.slice(1));
  
  console.log('bg: ', opts.palette[0])
  
  background.onload = () => {
    console.log('It has loaded!');
    var renderer = createRenderer(opts);

    if (opts.debugLuma) {
      renderer.debugLuma();

    } else {
      
      renderer.clear();
      var stepCount = 0;
      loop.on('tick', () => {
        renderer.step(opts.interval);
        stepCount++;
        if (!opts.endlessBrowser && stepCount > opts.steps) {
          loop.stop();
        }
      });
      loop.start();
    }
  };
  
  
  $.get('/get-track?id=', function(data) {
      // "Data" is the object we get from the API. See server.js for the function that returns it.
      console.group('%cResponse from /get-track', 'color: #F037A5; font-size: large');
      console.log(data);
      console.groupEnd();
    
      
  });

 
  
  background.crossOrigin = "Anonymous";
  
}

function resize () {
  letterbox(canvas, [ window.innerWidth, window.innerHeight ]);
}

function getBestContrast (background, colors) {
  var bestContrastIdx = 0;
  var bestContrast = 0;
  colors.forEach((p, i) => {
    var ratio = contrast.hex(background, p);
    if (ratio > bestContrast) {
      bestContrast = ratio;
      bestContrastIdx = i;
    }
  });
  return colors[bestContrastIdx];
}

// resize and reposition canvas to form a letterbox view
function letterbox (element, parent) {
  var aspect = element.width / element.height;
  var pwidth = parent[0];
  var pheight = parent[1];

  var width = pwidth;
  var height = Math.round(width / aspect);
  var y = Math.floor(pheight - height) / 2;

  if (isIOS) { // Stupid iOS bug with full screen nav bars
    width += 1;
    height += 1;
  }

  element.style.top = y + 'px';
  element.style.width = width + 'px';
  element.style.height = height + 'px';
}


window.onSpotifyPlayerAPIReady = () => {
  const player = new Spotify.Player({
    name: 'Web Playback SDK Template',
    getOAuthToken: cb => { cb(_token); }
  });

  // Error handling
  player.on('initialization_error', e => console.error(e));
  player.on('authentication_error', e => console.error(e));
  player.on('account_error', e => console.error(e));
  player.on('playback_error', e => console.error(e));

  // Playback status updates
  player.on('player_state_changed', state => {
    console.log(state)
    $('#current-track').attr('src', state.track_window.current_track.album.images[0].url);
    $('#current-track-name').text(state.track_window.current_track.name);
  });
  // Ready
  player.on('ready', data => {
    console.log('Ready with Device ID', data.device_id);
    
    // Play a track using our new device ID

    webplayerdeviceid = data.device_id
    
  });

  // Connect to the player!
  player.connect();
}


// Play a specified track on the Web Playback SDK's device ID
function play(device_id, id) {
  $.ajax({
   url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
   type: "PUT",
   data: '{"uris": [ "spotify:track:' + id + '" ]}',
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) { 
     console.log(data)
   }
  });
}
  

$('form').submit(function(event) {
  event.preventDefault();


  let query = $('input').val();
  let context = $('input[name="context"]:checked').val();

  $.get('/search?' + $.param({context: context, query: query}), function(data) {
    $('#results').empty();
    $('input[type="text"]').val('');
    $('input').focus();
    
    
    var url = data.album.images[0].url;
    
    console.log(url);
    
    
    play(webplayerdeviceid, data.id);
    
    $.get('/colors?' + $.param({url: url}), function(data) {
  
      var array = JSON.parse(data);

      console.log('colors: ', array)
      palette = array;
      
      background.src = url;
      randomize(palette);

    });
    
  });
});
  

