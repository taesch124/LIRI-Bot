# LIRI-Bot

LIRI is a command line application that prompts the user for inputs to search for movies, songs, and concerts based on a search phrase provided by the user. The application prompts the user for what they are searching for, or if they just want LIRI to run a random command from a provided list. Each command is described in further detail below. The starting prompt looks like the below.
![Image of user prompt](https://github.com/taesch124/LIRI-Bot/blob/master/assets/images/application-flow/user-prompt.PNG)

## Search Songs


After the selection to search for a song, the user will be asked what they are looking for.
![Image of song prompt](https://github.com/taesch124/LIRI-Bot/blob/master/assets/images/application-flow/song-prompt.PNG)
The user then enters in a song that they would like to search for using the Spotify API. The response for this search will be up to 20 results of matches for the provided search phrase. Below is a sample of the output when searching for "All the Small Things". 
![Image of song search results](https://github.com/taesch124/LIRI-Bot/blob/master/assets/images/application-flow/song-results.PNG)

## Search Movies

After the selection to search for a movie, the user will be asked what they are looking for.
![Image of movie prompt](https://github.com/taesch124/LIRI-Bot/blob/master/assets/images/application-flow/movie-prompt.PNG)
The user then enters in a movie that they would like to search for using the OMDB API. The response of this search will return a single response from the API based on their search algorithm. Below is a sample of the output when searching for "Saving Private Ryan".
![Image of movie search results](https://github.com/taesch124/LIRI-Bot/blob/master/assets/images/application-flow/movie-results.PNG)

## Search Concerts

After the selection to search for concerts, the user will be asked what they are looking for.
![Image of concert prompt](https://github.com/taesch124/LIRI-Bot/blob/master/assets/images/application-flow/concert-prompt.PNG)
The user then enters an artist they would like to find upcoming concerts for using the Bands in Town API. The response of this search will return a list of all upcoming concerts for the searched artist. Below is a sample output when searching for "Tycho".
![Image of concert search results](https://github.com/taesch124/LIRI-Bot/blob/master/assets/images/application-flow/concert-results.PNG)

## Random

The user can also select to chose a random command, the list of which is provided by the application in the random.txt file. Below is an example of running the random command. 
![Image of random command](https://github.com/taesch124/LIRI-Bot/blob/master/assets/images/application-flow/random-results.PNG)

## Logging

The application will also log every command that has been run as well as the date and time that it has been run. Below is a sample of the log file.
![Sample image of log file](https://github.com/taesch124/LIRI-Bot/blob/master/assets/images/application-flow/log-sample.PNG)