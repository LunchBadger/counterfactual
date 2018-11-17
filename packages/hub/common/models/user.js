'use strict';

const moment = require('moment')
const assert = require('assert')

const {
  prefixMsg,
  getAccount,
  getWeb3,
  toWei,
  toEth,
  fromEth,
  buildCreate2Address,
} = require('../../lib/helpers')
const {
  buildCFContractAddress
} = require('../../lib/contract')
const {
  sendMail
} = require('../../lib/mail')

function getUser(User, where) {
  return new Promise((resolve, reject) => {
    User.findOne({where}, (err, result) =>
      err ? reject(err) : resolve(result)
    )
  })
}

module.exports = function(User) {
  User.settings.caseSensitiveEmail = false

  User.validatesUniquenessOf('email')

  User.observe('before save', function(ctx, next) {
    ;(async () => {
      if (!ctx.isNewInstance) {
        return next()
      }

      const salt = Date.now()

      ctx.instance.contractAddress = await buildCFContractAddress(salt)
      ctx.instance.status = 'inactive'

      next()
    })();
  })

  User.updatePasswordFromToken = (accessToken, _, newPassword, cb) => {
    ;(async () => {
      try {
        if (!accessToken) {
          throw Error('access token is required')
        }

        User.findById(accessToken.userId, (err, user) => {
          user.updateAttribute('password', newPassword, (err, user) => {
            if (err) {
              cb({
                error: err.message
              })
              return
            }

            cb(null, true)
          })
        })
      } catch(err) {
        cb({
          error: err.message
        })
      }
    })();
  }

  User.remoteMethod('updatePasswordFromToken', {
    isStatic: true,
    accepts: [
      {
        arg: 'accessToken',
        type: 'object',
        http: function(ctx) {
          return ctx.req.accessToken;
        }
      },
      {arg: 'access_token', type: 'string', required: true, 'http': { source: 'query' }},
      {arg: 'newPassword', type: 'string', required: true},
    ],
    http: {path: '/update-password-from-token', verb: 'post'},
    returns: {type: 'boolean', arg: 'passwordChanged'}
  })

  User.on('resetPasswordRequest', function (info) {
    ;(async () => {
      const { email, accessToken } = info
      const {id:token} = accessToken

      console.log(token)

      const text = `Reset password http://localhost:8080/reset-password?access_token=${token}`

      await sendMail({
        to: email,
        text,
        html: text
      })
    })();
  });
}
