import { expect } from 'chai'
import { expectToRaiseCompileError } from '../helpers'

describe('break', function () {
  it('cant break in main context', 
    expectToRaiseCompileError('break;', 'break can be used only inside loops at line 1')
  )

  it('cant break in method context', 
    expectToRaiseCompileError('test() { break; }', 'break can be used only inside loops at line 1')
  )

  it('cant break in if context', 
    expectToRaiseCompileError('if(true) { break; }', 'break can be used only inside loops at line 1')
  )
})
