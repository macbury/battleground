import { expect } from 'chai'
import { Frames } from '../app/javascript/packs/lang/frame'

describe('Frame', function () {
  describe('globalFrame', function() {
    it('throws UndefinedVariable error if variable dont exists', function () {
      let frames = new Frames()
      expect(() => frames.current.get(1000)).to.throw(/Could not find variable 1000 in frame/)
    })

    it('fetch global variable', function() {
      let frames = new Frames()
      frames.current.set(1000, 5)
      expect(frames.current.get(1000)).to.eq(5)
    })
  })

  describe('sub frame', function() {
    it('throws UndefinedVariable error if variable dont exists localy and globally', function () {
      let frames = new Frames()
      frames.push(1)
      frames.push(2)
      expect(() => frames.current.get(1000)).to.throw(/Could not find variable 1000 in frame/)
    })

    it('fetch frame from global scope', function () {
      let frames = new Frames()
      frames.current.set(1000, 5)
      frames.push(1)
      frames.push(2)
      expect(frames.current.get(1000)).to.eq(5)
    })

    it('local frame have precedence', function () {
      let frames = new Frames()
      frames.current.set(1000, 5)
      frames.push(1)
      frames.push(2)
      frames.current.set(1000, 15)
      expect(frames.current.get(1000)).to.eq(15)
    })

    it('set value to global frame if local frame dont have reference', function () {
      let frames = new Frames()

      frames.current.set(1000, 0)
      frames.push(1)
      frames.current.set(1000, 15)
      frames.pop()
      expect(frames.current.get(1000)).to.eq(15)
    })
  })
})
