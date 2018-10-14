export default class Random {
  constructor(seed) {
    this.seed = seed
    if (this.seed == null) {
      this.seed = (new Date()).getTime()
    }
    this.nonce = this.seed
  }

  next() {
    let x = Math.sin(this.nonce++) * 10000
    return x - Math.floor(x)
  }

  between(from, to) {
    let diff = to - from
    return Math.round(diff * this.next() + from)
  }
}
