import VirtualMachine from '@language/virtual_machine'
import Compiler from '@language/compiler'
import bodyParser from 'body-parser'
import bootPhaser from './phaser'
import express from 'express'
import { VSScene } from '@game/scene/vs'

const app = express()
const port = process.env['PORT'] || 4000

app.use(express.json())
app.use(bodyParser.json())

app.get('/api/vs', (req, res) => {
  let { player } = req.body
  res.send({ works: true })
})

app.post('/api/compile', (req, res) => {
  let { content } = req.body
  let compiler = new Compiler()
  try {
    let { code } = compiler.compile(content).toProgram()
    res.send(code)
  } catch (e) {
    res.status(422).json({ error: e.toString() })
  }
})

class TestScene extends Phaser.Scene {
  preload() {
    console.log('preload')
  }

  create() {
    console.log('create')
    this.steps = 0
    this.lastDate = Date.now()
  }

  update(time, delta) {
    this.steps += 1
    if (time - this.lastDate >= 1000) {
      console.log(`Fps: ${this.steps}`)
      this.steps = 0
      this.lastDate = time
    }
  }
}

bootPhaser((game) => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
  game.scene.add('test', TestScene, true)
})
