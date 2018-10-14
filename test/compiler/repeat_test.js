import { expect } from 'chai'
import { loadAndcompile, compile } from '../helpers'

describe('repeat', function () {
  it('(10 times)', loadAndcompile('./test/factories/repeat.tank', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(10)
  }))

  it('nested repeat', loadAndcompile('./test/factories/nested_repeat.tank', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(1000)
  }))

  it('can break the repeat loop', compile('let a = 0; repeat(10) { a = a+5; break; a = a+100; }', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(5)
  }))
})
