var moduleDeps = require('module-deps');
var browserResolve = require('browser-resolve');
var path = require('path');
var es = require('event-stream')
var File = require('vinyl');
var builtinLibs = require('repl')._builtinLibs;
var minimatch = require('minimatch');

module.exports = function(opts) {
  opts = opts || {};
  opts.match = opts.match || ['**/*'];
  opts.match = [].concat(opts.match);

  var patterns = opts.match.map(function(pat) {
    return new minimatch.Minimatch(pat);
  });

  function match(file) {
    for(var i = 0; i < patterns.length; i++)
      if(patterns[i].match(file)) return true;
    return false;
  }

  var empty = path.join(__dirname, 'empty.js');
  return es.through(function(file) {
    var self = this;
    moduleDeps(file.path, {
      resolve: function(id, parent, cb) {
        browserResolve(id, parent, function(err, id, pkg) {
          if((builtinLibs.indexOf(id) == -1 || opts.bulitin) && match(id))
            cb(err, id, pkg);
          else
            cb(null, empty);
        });
      },
      packageFilter: function(pkg) {
        if(! opts.browser)
          delete pkg.browser;
        return pkg;
      }
    })
    .pipe(es.through(function(file) {
      if(file.id === empty)
        return;
      self.emit('data', new File({path: file.id}));
    }, function() { self.emit('end'); }));
  }, function() {});
};