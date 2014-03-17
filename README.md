gulp-deps
=========
[![Build Status](https://drone.io/github.com/themang/gulp-deps/status.png)](https://drone.io/github.com/themang/gulp-deps/latest)
Get a stream of a module's dependencies


## Example

```javascript

var deps = require('gulp-deps');
gulp.src('./app.js')
  .pipe(deps({match: '!node_modules/**'}))
  .pipe(es.through(function(file) {
    // Add the file to our watched list
    self.add(file.path);
  });
```
