const discord = require('discord.js')
const fs = require('fs')

const client = new discord.Client()

const config = require('./config.json')

client.login(config.botToken)

let out = []

function fetch (channel, before) {
  return async () => {
    let options = { limit: 100 }
    if (before != null) options.before = before
    let messages = await channel.fetchMessages(options)
    for (var message of messages.values()) {
      if (message.author.id === config.watchId) out.push(message.cleanContent)
    }
    return message
  }
}

client.on('ready', async () => {
  for (let guild of client.guilds.values()) {
    for (let channel of guild.channels.filter(channel => channel.type === 'text')) {
      let result = await fetch(channel)
      while (result != null) {
        console.log(result.createdAt, out.length)
        result = await fetch(channel, result.id)
        fs.writeFile('corpus.json', JSON.stringify(out), 'utf8', err => {
          if (err) {
            console.error(err)
            fs.writeFileSync(`${(new Date()).getTime()}.json`, JSON.stringify(out), 'utf8')
          }
        })
      }
    }
  }
})
