var path = require('path')
var funcs = require('./funcs')
var encodeName = funcs.encodName
var name = process.argv[2]
var hashes = process.argv[3]
//console.log(name + " " + hashes)
var session = {
  username: name,
  lastHash: hashes
}

if (!session.username || !session.lastHash) {
  console.log('Usage: node index.js <username> <hash>')
  process.exit(0)
}

// 1. load the database
var dbFile = path.join(__dirname, 'db', 'index.json')
//console.log(dbFile);
funcs.loadDb(dbFile, function (err, db) {

  // 2. encode the name
  var encoded = funcs.encodeName(name)
  //var decoded = funcs.decodeName(encoded)

  // 3. find the user's inbox
  var inbox = funcs.findInbox(db, encoded)

  // 4. find the next message
  var nextMessage = funcs.findNextMessage(inbox, session.lastHash)

  // 5. print out the message.
  // Paste the console output into the "Solution" field and you're done!
  console.log(nextMessage)
})
