# Donko
Discord Markov bot and generator

## Requirements

- Node.js (also version something)
- npm or discord.js
- Python (version something)
- spaCy (English model)

## Usage

`npm install` to get dependencies (discord.js)

Rename `config.json.example` to `config.json` and fill in the variables.

Scrape user messages with `node scrape.js`. Will crawl every text channel of every server the bot is on.

Scraped messages need to be "cleaned" with part of speech tagging, run `python clean.py`

Run the bot with `node app.js`
