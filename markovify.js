module.exports = class {
  constructor (input) {
    if (!input) {
      throw new Error('Input was empty.')
    }
    let model = new Map([['START', new Map()]])
    this.rawInput = []
    for (let words of input) {
      this.rawInput.push(JSON.stringify(words))
      let start = model.get('START')
      let firstWord = JSON.stringify(words[0])
      start.set(firstWord, (start.get(firstWord) || 0) + 1)

      let lastWord = JSON.stringify(words[words.length - 1])
      if (!model.has(lastWord)) model.set(lastWord, new Map())
      let last = model.get(lastWord)
      last.set('END', (last.get('END') || 0) + 1)

      for (let i = 0; i < words.length - 1; i++) {
        let word = JSON.stringify(words[i])
        let next = JSON.stringify(words[i + 1])
        if (!model.has(word)) model.set(word, new Map())
        let map = model.get(word)
        map.set(next, (map.get(next) || 0) + 1)
      }
    }

    this.model = new Map()
    for (let [word, map] of model.entries()) {
      let acc = 0
      let weights = []
      for (let [key, val] of map.entries()) {
        acc += val
        weights.push([acc, key])
      }
      this.model.set(word, weights)
    }
  }

  choice (weights) {
    let random = Math.floor(Math.random() * weights[weights.length - 1][0])
    let lo = 0
    let hi = weights.length
    while (lo < hi) {
      let mid = Math.floor((lo + hi) / 2)
      if (random < weights[mid][0]) hi = mid
      else lo = mid + 1
    }
    return weights[lo][1]
  }

  isDuplicate (chain) {
    return this.rawInput.includes(JSON.stringify(chain))
  }

  makeChain () {
    let chain
    let dupCount = 0
    let singleCount = 0
    do {
      let word = this.choice(this.model.get('START'))
      chain = [word]
      while (word !== 'END') {
        word = this.choice(this.model.get(word))
        chain.push(word)
      }
      chain = chain.slice(0, -1).map(data => JSON.parse(data))
      if (chain.length === 1) singleCount++
      else dupCount++
    } while (
      (chain.length !== 1 && singleCount < 2) &&
      (this.isDuplicate(chain) && dupCount < 5)
    )

    let out = ''
    for (let [word, POS, space] of chain) {
      out += space + word
    }

    return out
  }
}
