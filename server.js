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
      apiKey = 'acc_474c1db4ddb65fa',
      apiSecret = 'fd19b547da488025924458e76827e159';

// API CALL
app.get('/get-track', function (request, response) {
  
  // Search for a track!
  spotifyApi.getTrack(request.query.id, {limit: 1})
    .then(function(data) {
    
      // Send the first (only) track object
    //console.log(data);  
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

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});



app.get("/search", function (request, response) {
  let query = request.query.query;
  
  if(request.query.context) {
    if(request.query.context == 'artist') {
      query = 'artist:' + request.query.query;
    }
    if(request.query.context == 'track') {
      query = 'track:' + request.query.query;
    }
  }
  spotifyApi.searchTracks(query)
  .then(function(data) {
    
    
   /* 
    // SAVE COLORS FOR IMAGE URL **********  
  var imageUrl = data.body.tracks.items[0].album.images[0].url; 
  //console.log(imageUrl);
  
  var request2 = require('request'),
      apiKey = 'acc_cc460a0148240e3',
      apiSecret = '6aec2457dbf5eb07e0a5f627e500a7ac';

      request2.get('https://api.imagga.com/v2/colors?image_url='+encodeURIComponent(imageUrl), function (error, response, body) {
      console.log('REAL imageUrl: ', imageUrl)
      var obj = JSON.parse(body);
     //console.log('back1', obj.result.colors.background_colors)
        var background_colors = obj.result.colors.background_colors
        //console.log('back_colors: ', background_colors);
        var background_array = []
        var i;
        for (i = 0; i < background_colors.length;i++) {
          background_array.push(background_colors[i].closest_palette_color_html_code)
          //background_array[i] = background_colors[i].closest_palette_color_html_code;
        }
        
        var foreground_colors = obj.result.colors.foreground_colors
        var foreground_array = []
        for (i = 0; i < background_colors.length;i++) {
          foreground_array.push(foreground_colors[i].closest_palette_color_html_code)
          //foreground_array[i] = foreground_colors[i].closest_palette_color_html_code;
        }
        var tot_array = [background_array.concat(foreground_array)];
        //console.log(tot_array)
         let data3 = JSON.stringify(tot_array)
        
        console.log('song: ', data3)
        //console.log('data3:', data3)
        
      
      fs.writeFileSync(__dirname+'/lib/color-palettes.json', data3, { flag: 'w' }, function(err){
        if (err) { console.log(err) }
        console.log('File saved.');
      })
  }).auth(apiKey, apiSecret, true); //END OF SAVE COLORS FOR IMAGE URL ************
    //console.log('req: ', request2.getParameter("data3"))
    */
    
    //console.log(data.body);
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
      //console.log('BODY: ', obj)
     //console.log('back1', obj.result.colors.background_colors)
        var background_colors = obj.result.colors.background_colors
        //console.log('back_colors: ', background_colors);
        var background_array = []
        var i;
        for (i = 0; i < background_colors.length;i++) {
          background_array.push(background_colors[i].closest_palette_color_html_code)
          //background_array[i] = background_colors[i].closest_palette_color_html_code;
        }
        
        var foreground_colors = obj.result.colors.foreground_colors
        var foreground_array = []
        for (i = 0; i < background_colors.length;i++) {
          foreground_array.push(foreground_colors[i].closest_palette_color_html_code)
          //foreground_array[i] = foreground_colors[i].closest_palette_color_html_code;
        }
        //var tot_array = background_array.concat(foreground_array);
        var tot_array = foreground_array.concat(background_array);
        //console.log(tot_array)
        data3 = JSON.stringify(tot_array)
        console.log(data3);
        response.json(data3);
        
        
  }).auth(apiKey, apiSecret, true); //END OF SAVE COLORS FOR IMAGE URL ************
  
  //console.log('sent: ', data3);
  
  //
  });


