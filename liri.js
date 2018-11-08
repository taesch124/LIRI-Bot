require("dotenv").config();
const Spotify = require('node-spotify-api');
const Request = require('request');
const Moment = require('moment');
const keys = require('./keys.js');

const command = process.argv[2];
let searchPhrase = process.argv[3];

//Initialize APIs
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
}); 

console.log(command);

if(command === 'spotify-this-song') {
  if(!searchPhrase) searchPhrase = 'The Sign';

  spotify.search({ type: 'track', query: searchPhrase }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

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
    if(error && response.statusCode !== 200) return;
    if( /warn=Not found/g.test(body) || /error=Not Found/g.test(body)) {
      console.log('Artist not found.');
    } else {
      printConcerts(JSON.parse(body));
    }
  });
} else if (command === 'movie-this') {
  if(!searchPhrase) searchPhrase = 'Mr. Nobody';

  Request('http://www.omdbapi.com/?apikey=trilogy&t=' + searchPhrase, function(error, response, body) {
    if(error && response.statusCode !== 200) return;
    let data = JSON.parse(body);
    if(data.Response === 'False') {
      console.log('Movie not found');
    } else {
      printMovie(data);
    }

  })
}
 

 
function printSpotifyTracks(tracks) {
  for(let i = 0; i < tracks.length; i++) {
    let currentTrack = tracks[i];
    console.log('Name:   ' + currentTrack.name);
    console.log('Artist: ' + currentTrack.artists[0].name);
    console.log('Album:  ' + currentTrack.album.name);
    console.log('');  
  }
}

function printConcerts(concerts) {
  for(let i = 0; i < concerts.length; i++) {
    let concert = concerts[i];
    let date = Moment(concert.datetime);
    let lineup = '';
    concert.lineup.forEach((b, i, arr) => {
      
      if(i === arr.length - 1) {
        lineup += b;
      } else  {
        lineup += b + ', ';
      }
      
    })
    console.log('Lineup:   ' + lineup);
    console.log('Venue:    ' + concert.venue.name);
    console.log('Location: '+ concert.venue.city + ', ' + concert.venue.region + ' ' + concert.venue.country);
    console.log('Date:     ' + date.format('MM/DD/YYYY'));
    console.log('');
  }
}

function printMovie(movie) {
  console.log('Title:    ' + movie.Title);
  console.log('Year:     ' + movie.Year);
  console.log('IMDB:     ' + movie.imdbRating);
  console.log('RT:       ' + (movie.Ratings.filter(e => e.Source === 'Rotten Tomatoes'))[0].Value);
  console.log('Country:  ' + movie.Country);
  console.log('Language: ' + movie.Language);
  console.log('Plot:     ' + movie.Plot);
  console.log('Actors:   ' + movie.Actors);
}