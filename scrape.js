const discord = require('discord.js')
const fs = require('fs')

const client = new discord.Client()

const config = require('./config.json')

client.login(config.botToken)

let out = []

async function fetch (channel, before) {
  let options = { limit: 100 }
  if (before != null) options.before = before
  let messages = await channel.fetchMessages(options)
  for (var message of messages.values()) {
    if (message.author.id === config.watchID) out.push(message.cleanContent)
  }
  return message
}

async function crawl (guild, channel) {
  let result = await fetch(channel)
  while (result != null) {
    console.log(guild.name, channel.name, result.createdAt, 'Current corpus length:', out.length)
    result = await fetch(channel, result.id)
    fs.writeFile('corpus.json', JSON.stringify(out), 'utf8', err => {
      if (err) {
        console.error(err)
        fs.writeFileSync(`${(new Date()).getTime()}.json`, JSON.stringify(out), 'utf8')
      }
    })
  }
}

client.on('ready', () => {
  let guilds = client.guilds.values().filter(guild => {
    return !config.ignoreGuilds.includes(guild.id)
  })
  for (let guild of guilds) {
    let channels = guild.channels.values().filter(channel => {
      if (channel.type !== 'text') return false
      return !config.ignoreChannels.includes(channel.id)
    })
    for (let channel of channels) {
      crawl(guild, channel)
    }
  }
})
