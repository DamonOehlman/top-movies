var assert = require('assert')
  , topMovies = require('..')
  , _ = require('underscore')
  , path = require('path')
  , targetPath = path.resolve(__dirname, 'data')
  , targetCollection;

describe('loader tests', function() {
  it('should be able to load the default local file', function(done) {
    topMovies(function(err, collection) {
      assert.ifError(err);
      assert(collection);
      
      done();
    });
  });
  
  it('should be able to load a file from the local filesystem', function(done) {
    topMovies({ sourceFile: path.join(targetPath, 'too-many-points.csv') }, function(err, collection) {
      assert.ifError(err);
      assert(collection);
      
      done();
    });
  });
  
  it('should error when the local file specified doesn\'t exist', function(done) {
    topMovies({ sourceFile: path.join(targetPath, 'invalid-file.csv') }, function(err, collection) {
      assert(err);
      
      done();
    });
  });
});