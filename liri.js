require("dotenv").config();
const Spotify = require('node-spotify-api');
const Request = require('request');
const keys = require('./keys.js');

const command = process.argv[2];
let searchPhrase = process.argv[3];

//Initialize APIs
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
}); 



console.log(keys);
console.log(command);

if(command === 'spotify-this-song') {
  if(!searchPhrase) searchPhrase = 'The Sign';

  spotify.search({ type: 'track', query: searchPhrase }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    console.log(data.tracks.items);
    if(data.tracks.items.length === 0) {
      console.log('No track found with provided name.');
      return;
    } else {
      printSpotifyTracks(data.tracks.items);
    }
    
  });
} else if (command === 'concert-this') {
  if(!searchPhrase) searchPhrase = 'Tycho';
  
  Request('https://rest.bandsintown.com/artists/' + searchPhrase + '/events?app_id=codingbootcamp', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
});
}
 

 
function printSpotifyTracks(tracks) {
  for(let i = 0; i < tracks.length; i++) {
    let currentTrack = tracks[i];
    console.log(currentTrack.name);
    console.log(currentTrack.artists[0].name);
    console.log(currentTrack.album.name);
    console.log('');  
  }
}