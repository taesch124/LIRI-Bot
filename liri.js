require("dotenv").config();
const Spotify = require('node-spotify-api');
const Request = require('request');
const Moment = require('moment');
const Inquirer = require('inquirer');
const keys = require('./keys.js');
const fs = require('fs');

//Initialize APIs
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
}); 

promptUser();

function promptUser() {
  Inquirer.prompt([
    {
      type: 'list',
      message: 'What do you want to search for?',
      choices: ['Song', 'Movie', 'Concert', 'Random'],
      name: 'command'
    },
    {
      type: 'input',
      message: 'What are you looking for?',
      name: 'searchPhrase',
      when: (answers) => {return answers.command !== 'Random';}
     }
  ])
  .then(runLiri);
}

function runLiri(answers) {
  searchPhrase = answers.searchPhrase;
    switch(answers.command) {
      case 'Song':
      case 'spotify-this-song':
        command = 'spotify-this-song';
        if(!searchPhrase) searchPhrase = 'The Sign';
        searchSpotifyTrack(searchPhrase);
        break;
      case 'Movie':
      case 'movie-this':
        command = 'movie-this';
        if(!searchPhrase) searchPhrase = 'Mr. Nobody';
        searchMovie(searchPhrase);
        break;
      case 'Concert':
      case 'concert-this':
        command = 'concert-this';
        if(!searchPhrase) searchPhrase = 'Tycho';
        searchArtistConcerts(searchPhrase);
        break;
      case 'Random':
        performRandomCommand();
        return;
      default:
        break;
    }
}

function searchSpotifyTrack(searchPhrase) {
  spotify.search({ type: 'track', query: searchPhrase }, function(err, data) {
    if (err) {
      let message = 'Error occurred: ' + err;
      console.log(message);
      logMessage(message);
      return;
    }

    if(data.tracks.items.length === 0) {
      let message = 'No track found with name \"' + searchPhrase + '\".';
      console.log(message);
      logMessage(message);
      return;
    } else {
      printSpotifyTracks(data.tracks.items);
    }
    
  });
}
 
function printSpotifyTracks(tracks) {
  let message = '';

  for(let i = 0; i < tracks.length; i++) {
    let currentTrack = tracks[i];
    let name = 'Name:   ' + currentTrack.name;
    let artist = 'Artist: ' + currentTrack.artists[0].name;
    let album = 'Album:  ' + currentTrack.album.name;

    message += name + '\n' + artist + '\n' + album + '\n\n';
  }

  console.log(message);
  logMessage(message);
}

function searchArtistConcerts(searchPhrase) {
  Request('https://rest.bandsintown.com/artists/' + searchPhrase + '/events?app_id=' + keys.bit, function (error, response, body) {
      if(error && response.statusCode !== 200) return;
      if( /warn=Not found/g.test(body) || /error=/g.test(body)) {
        let message = 'Could not find any concerts for \"' + searchPhrase + '\".';
        console.log(message);
        logMessage(message);
      } else {
        printConcerts(JSON.parse(body));
      }
    });
}

function printConcerts(concerts) {
  let message = '';

  for(let i = 0; i < concerts.length; i++) {
    let concert = concerts[i];
    let date = Moment(concert.datetime);
    let lineup = 'Lineup:   ';
    concert.lineup.forEach((b, i, arr) => {
      
      if(i === arr.length - 1) {
        lineup += b;
      } else  {
        lineup += b + ', ';
      }
      
    });

    let venue = 'Venue:    ' + concert.venue.name;
    let location = 'Location: '+ concert.venue.city + ', ' + concert.venue.region + ' ' + concert.venue.country;
    let dateString = 'Date:     ' + date.format('MM/DD/YYYY');

    message += lineup + '\n' + venue + '\n' + location + '\n' + dateString + '\n\n';

    
  }

  console.log(message);
  logMessage(message);
}

function searchMovie(searchPhrase) {
  Request('http://www.omdbapi.com/?apikey=' + keys.omdb + '&t=' + searchPhrase, function(error, response, body) {
      if(error && response.statusCode !== 200) return;
      let data = JSON.parse(body);
      if(data.Response === 'False') {
        let message = 'Could not find movie \"' + searchPhrase + '\".';
        console.log(message);
        logMessage(message);
      } else {
        printMovie(data);
      }
  
    });
}

function printMovie(movie) {
  let title = 'Title:    ' + movie.Title;
  let year = 'Year:     ' + movie.Year;
  let imdb = 'IMDB:     ' + movie.imdbRating;
  let rt
  if(movie.Ratings.filter(e => e.Source === 'Rotten Tomatoes').length > 0) {
    rt = 'RT:       ' + (movie.Ratings.filter(e => e.Source === 'Rotten Tomatoes'))[0].Value;
  }
  
  let country = 'Country:  ' + movie.Country;
  let language = 'Language: ' + movie.Language;
  let plot = 'Plot:     ' + movie.Plot;
  let actors = 'Actors:   ' + movie.Actors;
  
  let message = title + '\n' + year + '\n' + imdb + '\n' ;
  if(rt) message += rt + '\n';
  message += country + '\n' + language + '\n' + plot + '\n' + actors + '\n';
  console.log(message);
  logMessage(message);
}

function performRandomCommand() {
  fs.readFile('./random.txt', 'utf8', function(err, data) {
    if(err) return console.log(err);

    let answers = {};
    let options = data.split('\r\n');
    let random = Math.floor(Math.random() * options.length);
    let randomCommand = options[random].split(',');

    answers.command = randomCommand[0];
    answers.searchPhrase = randomCommand[1];
    runLiri(answers);
  });
}

function logMessage(msg) {
  let currentTime = Moment();
  let log = '======================================================\n';
  log += currentTime.format('YYYY-MM-DD hh:mm:ss A') + ': ' + command + ' \"' + searchPhrase + '\"\n\n';
  log += "Response:\n";
  log += msg;
  fs.appendFile('./log.txt', log, function(err) {
    if (err) return console.log(err);
  })
}