var ejs = require('ejs')
  , through = require('through')

module.exports = function(file, options) {
  
  var match = file.match(/(.*\.ejs)(\$|%|)$/)

  if (!match) return through()

  options = options || {}

  var buffer = ""

  return through(function write(chunk) {
    buffer += chunk
  }, function end() {
    var template = ejs.compile(buffer, {
        client: true
      , compileDebug: options.debug || false
      , delimiter: match[2].length > 0 ? match[2] : '%'
      , filename: match[1]
    })

    this.queue('module.exports = (' + template + ')')
    this.queue(null)
  })
}
