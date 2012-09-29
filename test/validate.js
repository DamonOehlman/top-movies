var assert = require('assert')
  , topMovies = require('..')
  , _ = require('underscore')
  , path = require('path')
  , targetPath = path.resolve(__dirname, 'data')
  , targetCollection;
  
describe('valid movie detection', function() {
  it('should be able to create a new target collection', function(done) {
    topMovies({ sourceFile: path.join(targetPath, 'too-many-points.csv') }, function(err, collection) {
      assert.ifError(err);
      assert(collection);
      
      targetCollection = collection;
      done();
    });
  });
});