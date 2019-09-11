const fs = require('fs')
const path = require('path')

const discord = require('discord.js')

const Markov = require('./markovify.js')
const config = require('./config.json')

const client = new discord.Client()
const corpus = JSON.parse(fs.readFileSync(path.join(__dirname, 'corpus.json'), 'utf8'))
const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'cured.json'), 'utf8'))
let markov = new Markov(tokens)

client.login(config.botToken)

client.on('ready', () => {
  console.log('hi')
})

client.on('message', message => {
  if (message.isMentioned(client.user.id)) {
    message.channel.send(markov.makeChain()).catch(console.error)
  } else if (config.watchID && message.author.id === config.watchID) {
    if (message.cleanContent === '') return console.log('Empty message')
    if (corpus.indexOf(message.cleanContent) !== -1) return console.log('Duplicate message')
    corpus.push(message.cleanContent)
    console.log(`New message: corpus length: ${corpus.length}`)
    fs.writeFile(path.join(__dirname, 'corpus.json'), JSON.stringify(corpus), 'utf8', err => {
      if (err) {
        console.error(err)
        fs.writeFileSync(String((new Date()).getTime()), JSON.stringify(corpus), 'utf8')
      }
    })
  }
})

client.on('messageUpdate', (oldMessage, newMessage) => {
  if (config.ignoreEdits) return
  if (config.watchID && oldMessage.author.id === config.watchID) {
    let msg = `Edit message: corpus length: ${corpus.length}`
    console.time(msg)
    let index = corpus.indexOf(oldMessage.cleanContent)
    if (index !== -1 && !config.retainEdits) {
      corpus[index] = newMessage.cleanContent
    } else {
      corpus.push(newMessage.cleanContent)
    }
    console.timeEnd(msg)
  }
})
