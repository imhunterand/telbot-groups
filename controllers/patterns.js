'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const utils = require('../core/utils')

bot.onText(/^\/?s\/(.+)\/(.+)\/?/, (msg, match) => {
  const message = msg.reply_to_message
  // Return if there is no message to change.
  if (!message) { return }

  const lang = utils.getUserLang(msg)
  let input = message.text
  let re

  if (!input) { return }

  if (message.from.id === config.bot.ID) {
    const head = '^Did you mean:\n"'
    const pre = new RegExp(head, '')
    const post = new RegExp('"$', '')
    input = input.replace(pre, '')
    input = input.replace(post, '')
  }

  try {
    re = new RegExp(match[1], 'g')
  } catch (error) {
    bot.reply(msg, `SyntaxError: Invalid regular expression: <code>/${match[1]}/</code>: Nothing to repeat`)
    return
  }

  let output = input.replace(re, match[2])

  // 4096 is the characters limit count of Telegram post
  if (utils.escapeHtml(output).length >= 4000) {
    output = utils.escapeHtml(output).substr(0, 4000)
  } else {
    output = utils.escapeHtml(output)
  }

  bot.reply(msg, `<b>${lang.patterns.dlg[0]}:</b>\n"${output}"`)
})
