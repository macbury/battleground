import { expect } from 'chai'
import { compile, loadAndcompile } from '../helpers'

describe('comments', function () {
  it('let a = 1; # some text here', compile('let a = 9; # some text here', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(9)
  }))
})
