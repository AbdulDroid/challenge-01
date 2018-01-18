var fs = require('fs')
var path = require('path')

/**
 * General purpose data encoding
 *
 * (string): string
 */
function encode (data) {
  return (Buffer.from(data).toString('base64'))
}

/**
 * Inverse of `encode`
 *
 * (string): string
 */
function decode (data) {
  return (Buffer.from('' + data, 'base64').toString('ascii'))
}

/**
 * Encode a superhero name
 *
 * (string): string
*/
module.exports.encodeName = function (name) {
  //console.log('Entered Name: ' + encode("@" + name));
  return encode("@" + name)
}

/*module.exports.decodeName = function (codeName){
  return decode(codeName)
}*/

/**
 * Load the database
 *
 * (string, (?Error, ?Object))
 */
module.exports.loadDb = function (dbFile, cb) {
  fs.readFile(dbFile, function (err, res) {
    if (err) { return cb(err) }

    var messages
    try {
      messages = JSON.parse(res)
      //console.log(messages);
    } catch (e) {
      return cb(err)
    }

    return cb(null, { file: dbFile, messages: messages })
  })
}

/**
 * Find the user's inbox, given their encoded username
 *
 * (Object, string): Object
 */
module.exports.findInbox = function (db, encodedName) {
  var messages = db.messages
  //console.log(messages[0].last);
  return {
    dir: path.dirname(db.file),
    messages: Object.keys(messages).reduce(function (acc, key) {
      if (!acc) console.log("error")
      else{
        if (messages[key].to === encodedName) {
          //console.log(messages[key].to);
        return {
          hash: key,
          to: messages[key].to,
          lastHash: messages[key].last,
          from: messages[key].from
        }
      } else { return acc }
    }
  },[])
  }
}

/**
 * Find the next message, given the hash of the previous message
 *
 * ({ messages: Array<Object> }, string): string
 */
module.exports.findNextMessage = function (inbox, lastHash) {
  // find the message which comes after lastHash
  var found
  //console.log(inbox.messages);
  //console.log(inbox.messages.length)
  for (var i = 0; i < inbox.messages.length; i ++) {
    if (inbox.messages.lastHash === lastHash) {
      found = i
      /*console.log(inbox.messages[i]);
      console.log(found);
      console.log(inbox.messages[i].to);
      console.log(inbox.messages[i].from);
      console.log(inbox.messages[i].last);*/
      break
    }
    //console.log("No messages found");
  }

  // read and decode the message
  return /*'to: ' + decode(inbox.messages.to) + '\n---\n' + */'from: ' + decode(inbox.messages.from) + '\n---\n' +
    decode(fs.readFile(path.join(inbox.dir, inbox.messages.hash), 'utf8'))
}
