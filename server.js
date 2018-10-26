// server.js
// where your node app starts

// init project

var express = require('express');
var app = express();
var assets = require('./assets');
var fs = require('fs');
let data3;

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

//-------------------------------------------------------------//
//----------------------- AUTHORIZATION -----------------------//
//-------------------------------------------------------------//


// Initialize Spotify API wrapper
var SpotifyWebApi = require('spotify-web-api-node');

// The object we'll use to interact with the API
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET
});

// Using the Client Credentials auth flow, authenticate our app
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
  
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err.message);
  });

// For IMAGGA
var request2 = require('request'),
      apiKey = process.env.IMAGGA_KEY,
      apiSecret = process.env.IMAGGA_SECRET;

// API CALL
app.get('/get-track', function (request, response) {
  
  // Search for a track!
  spotifyApi.getTrack(request.query.id, {limit: 1})
    .then(function(data) {
    
      // Send the first (only) track object
    response.send(data.body);
      
    }, function(err) {
      console.error(err);
    });
});

/////////


app.use("/maps", assets);

// http://expressjs.com/en/starter/basic-routing.html   
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
  });

// listen for requests 
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.get("/search", function (request, response) {
  let query = request.query.query;
  
  spotifyApi.searchTracks(query)
  .then(function(data) {
    response.send(data.body.tracks.items[0]);
  }, function(err) {
    console.log(err)
  });
  
});
  

// Get colors!!
app.get("/colors", function(request, response) {

  var imageUrl = decodeURIComponent(request.query.url)
      console.log('URLNOW: ', imageUrl)

      request2.get('https://api.imagga.com/v2/colors?image_url='+encodeURIComponent(imageUrl), function (error, resp, body) {
      var obj = JSON.parse(body);
        var background_colors = obj.result.colors.background_colors
        var background_array = []
        var i;
        for (i = 0; i < background_colors.length;i++) {
          background_array.push(background_colors[i].closest_palette_color_html_code)
        }
        
        var foreground_colors = obj.result.colors.foreground_colors
        var foreground_array = []
        for (i = 0; i < background_colors.length;i++) {
          foreground_array.push(foreground_colors[i].closest_palette_color_html_code)
        }

        var tot_array = foreground_array.concat(background_array);
        //console.log(tot_array)
        data3 = JSON.stringify(tot_array)
        console.log(data3);
        response.json(data3);
        
        
  }).auth(apiKey, apiSecret, true); //END OF SAVE COLORS FOR IMAGE URL ************
  
});


