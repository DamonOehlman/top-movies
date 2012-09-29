var csv = require('csv')
  , debug = require('debug')('topmovies')
  , path = require('path')
  , filePath = path.resolve(__dirname, 'movies.csv')
  , getit = require('getit')
  , pkgData = require('./package.json')
  , _ = require('underscore');
  
function MovieCollection() {
  this.movies = [];
}

MovieCollection.prototype = {
  cleanse: function() {
    // iterate through the movie collection and ensure we valid points allocated
    this.movies.forEach(function(movie) {
      if (typeof movie.points == 'number') {
        movie.points = Math.min(Math.max(movie.points, 1), 5);
      }
    });
  },
  
  getValid: function(maxPoints) {
    var valid = []
      , requiringPoints = []
      , moviesWithPoints
      , toAllocate
      , totalAllocatedPoints = 0
      , remainingPoints
      , pointsPerRemaining
      , nextMovie;
      
    // initialise the maxpoints to the default as outlined in the package.json
    maxPoints = maxPoints || pkgData.maxPoints || 50;
      
    // extract the movies with points
    moviesWithPoints = this.movies.filter(function(movie) {
      var include = typeof movie.points == 'number' && movie.points >= 1 && movie.points <= 5;
      
      // check whether this movies pushes us over the total allowed maxPoints
      include = include && (totalAllocatedPoints + movie.points <= maxPoints);
      
      // if we are to include the movie, update the total allocated points
      if (include) {
        totalAllocatedPoints += movie.points;
      }
      
      return include;
    });
    
    debug('found ' + moviesWithPoints.length + ' movies with valid points allocated');
    
    // get the movies that have no points
    toAllocate = this.movies.filter(function(movie) {
      return typeof movie.points == 'undefined';
    });
    
    debug('found ' + toAllocate.length + ' movies that will be allocated points');
    
    // determine the number of points to allocate to each of the autoallocated movies
    // bearing in mind that the mininum number of points that can be allocated to a movie is 1 point
    remainingPoints = maxPoints - totalAllocatedPoints;
    pointsPerRemaining = Math.min(5, Math.max(1, remainingPoints / toAllocate.length));

    // while we have at least one point remaining, then allocate those points
    // and movies left to allocate points to, allocate points
    while (toAllocate.length > 0 && remainingPoints >= 1) {
      // get the next movie
      nextMovie = toAllocate.shift();
      
      // allocate the points and add to the movie with points array
      nextMovie.points = pointsPerRemaining;
      moviesWithPoints.push(nextMovie);
      
      // decrement the remaining points by the same amount
      remainingPoints -= pointsPerRemaining;
    }
    
    // return the movies with points allocated
    return moviesWithPoints;
  }
}

module.exports = function(opts, callback) {
  var collection = new MovieCollection()
    , sourceFile;

  // handle no opts
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }
  
  // initialise the source file
  sourceFile = opts.sourceFile || path.resolve(__dirname, 'movies.csv');
  
  // get the target sourceFile
  debug('requesting: ' + sourceFile);
  csv()
    .from.stream(getit(sourceFile))
    .on('data', function(data, index) {
      collection.movies.push({
        title: data[0],
        points: typeof data[1] != 'undefined' ? parseInt(data[1], 10) : undefined
      });
    })
    .on('error', callback)
    .on('end', function() {
      callback(null, collection);
    });
};