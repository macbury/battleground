import { expect } from 'chai'
import { readFileSync } from 'fs'
import { compile, loadAndcompile, expectToRaiseCompileError, expectToLoadAndRaiseCompileError } from '../helpers'

describe('Syntax', function () {
  it('allow part of keyword in name', compile('let messages = false;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(0)
  }))

  it('dont allow keyword in name', 
    expectToRaiseCompileError(
      "let message : boolean = true;", 
      'Expected an alpha-numeric character or "_"'
    )
  )
})
