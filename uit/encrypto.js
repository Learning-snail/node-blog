const crypto = require('crypto')
module.exports = function (password,key='wang') {
    const hmac = crypto.createHmac('sha256',key)
    hmac.update(password)
    const passwordHmac=hmac.digest()
    return passwordHmac
}