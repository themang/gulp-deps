var chai = require('chai');
var expect = chai.expect;
var gulp = require('gulp');
var deps = require('../');
var path = require('path');
var es = require('event-stream');

function aggregator(arr) {
  return function(file) {
    arr.push(file.path);
    this.emit('data', file);
  };
}

describe('gulp-deps', function() {
  it('should parse a basic file', function(done) {
    var files = [];

    gulp.src('test/fixtures/index.js')
      .pipe(deps())
      .pipe(es.through(aggregator(files), function() {
        expect(files).to.contain(require.resolve('./fixtures/dep1.js'));
        expect(files).to.contain(require.resolve('./fixtures/dep2.js'));
        expect(files).to.contain(require.resolve('./fixtures/dep3.js'));
        expect(files).not.to.contain(require.resolve('path'));
        done();
      }));
  });

  it('should exclude properly', function(done) {
    var files = [];

    gulp.src('test/fixtures/index.js')
      .pipe(deps({
        match: ['!**/dep1*']
      }))
      .pipe(es.through(aggregator(files), function() {
        expect(files).not.to.contain(require.resolve('./fixtures/dep1.js'));
        expect(files).to.contain(require.resolve('./fixtures/dep2.js'));
        expect(files).to.contain(require.resolve('./fixtures/dep3.js'));
        expect(files).not.to.contain(require.resolve('path'));
        done();
      }));
  });
});