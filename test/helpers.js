import chai from 'chai'
import { expect } from 'chai'
import { VirtualMachine } from '../app/javascript/packs/lang/virtual_machine'
import { ArrayIO } from '../app/javascript/packs/lang/io'
import Compiler from '../app/javascript/packs/lang/compiler'
import { readFileSync } from 'fs'
import chaiAsPromised from "chai-as-promised"

const cache = {}

chai.use(chaiAsPromised);

export function withVM(instructions, callback) {
  return function() {
    let vm = new VirtualMachine(instructions)
    callback(vm)
  }
}

export function withVMAndEvents(instructions, callback) {
  return function(done) {
    let vm = new VirtualMachine(instructions)
    callback(vm, vm.events, done)
  }
}

export function expectToRaiseCompileError(content, message) {
  return function() {
    let compiler = new Compiler()
    expect(() => compiler.compile(content)).to.throw(message)
  }
}

export function expectToRaiseOutOfPowerError(content, callback) {
  return function() {
    let compiler = new Compiler()
    let bytecode = compiler.compile(content)
    let { code, sourceMap } = bytecode.toProgram()

    let vm = new VirtualMachine(code)
    vm.voltage = 1000
    
    expect(::vm.run).to.throw(/Out of power/)
    callback(vm, bytecode.toArray())
  }
}

export function expectToLoadAndRaiseCompileError(path, message) {
  return function() {
    let compiler = new Compiler()
    let content = readFileSync(path)
    expect(() => compiler.compile(content)).to.throw(message)
  }
}

export function loadAndcompile(path, callback) {
  return function() {
    let compiler = new Compiler()
    let bytecode = compiler.compile(cache[path] || readFileSync(path))
    
    let { code, sourceMap } = bytecode.toProgram()

    let vm = new VirtualMachine(code)
    vm.io = new ArrayIO()
    
    vm.run()
    callback(vm, bytecode.toArray(), sourceMap, vm.events)
  }
}

export function generateBytecode(content, callback) {
  return function() {
    let compiler = new Compiler()
    let bytecode = compiler.compile(content)
    let { code, sourceMap } = bytecode.toProgram()
  
    callback(bytecode.toArray(), sourceMap)
  }
}

export function compileWithEvents(content, eventsCallback, callback) {
  return function(done) {
    let compiler = new Compiler()
    let bytecode = compiler.compile(content)
    let { code, sourceMap } = bytecode.toProgram()
    
    let vm = new VirtualMachine(code)
    vm.io = new ArrayIO()
    eventsCallback(vm, vm.events)

    function run() {
      if (vm.step()) {
        setTimeout(run, 1)
      } else {
        callback(vm, bytecode.toArray(), sourceMap)
        done()
      }
    }

    run()
  }
}


export function compile(content, callback) {
  return function() {
    let compiler = new Compiler()
    let bytecode = compiler.compile(content)
    let { code, sourceMap } = bytecode.toProgram()
    
    let vm = new VirtualMachine(code)
    vm.io = new ArrayIO()
    vm.run()
    callback(vm, bytecode.toArray(), sourceMap, vm.events)
  }
}
