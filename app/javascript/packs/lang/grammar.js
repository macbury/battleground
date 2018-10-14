if (process.title == 'browser') {
  var GRAMMAR_SRC = require('./tank.ohm')
} else {
  let fs = require('fs')
  var GRAMMAR_SRC = fs.readFileSync('./app/javascript/packs/lang/tank.ohm')
}

export { GRAMMAR_SRC }
