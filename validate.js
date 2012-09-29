var imdb = require('imdb-api')
  , out = require('out')
  , topMovies = require('./index')
  , errors = {
      aboveMax: 'Points allocated to movies greater than max points: {0}'
    , cannotOpenFile: 'Unable to open movie file'
    }
  , _ = require('underscore')
  , pkgData = require('./package.json');

topMovies(function(err, collection) {
  var totalPoints
    , maxPoints = pkgData.maxPoints || 50
    , allocatedOK
    , validMovies
    , dodgyMovies;
    
  if (err) return out.error(errors.cannotOpenFile);
  
  out('  !{grey}General Checks');

  // get the valid movies
  validMovies = collection.getValid();

  /*
  // provide info on whether too many points have been allocated
  out.passfail(
    collection.allocatedPoints <= maxPoints
  , 'checking total allocated points: {0}/{1}'
  , collection.allocatedPoints
  , maxPoints
  );
  */
  
  // get the movies that aren't valid
  dodgyMovies = _.difference(collection.movies, validMovies);
  
  // if we have dodgy movies, then report the problems
  if (dodgyMovies.length > 0) {
    out('\n  !{grey}Reporting on invalid movies in the list');
    console.log(dodgyMovies);
  }
});
  