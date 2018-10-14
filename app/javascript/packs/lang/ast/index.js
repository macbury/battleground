import { Number, Boolean, Text, Type } from './values'
import { DeclareVariable, AssignVariable, VarExp } from './variables'
import { Program, Block, LocalBlock, Joiner, StackPop, Base } from './base'
import { AddOpExpression, MulOpExpression, LogicExpression, CompareExpression, UnaryExpression } from './expressions'
import { IfStatement, IfElseStatement } from './logic'
import { WhileStatement, RepeatStatement, LoopStatement, BreakStatement } from './loop'
import { DefGlobalVoidMethod, DefGlobalMethod, Param, RunMethod, ReturnStatement, ReturnVoidStatement } from './methods'
import { CastVariable } from './cast'
import { MessageMethod, WaitMethod, MoveMethod, TurnMethod, RotateCannonMethod, FireMethod } from './stdlib'

export const generateAst = {
  Program: (block) => {
    return new Program(block.toAst())
  },

  GlobalBlock: (statements) => {
    return new Block(statements.toAst())
  },

  LocalBlock: (statements) => {
    return new LocalBlock(statements.toAst())
  },

  CurlBlock: (_lcurl, block, _rcurl) => {
    return block.toAst()
  },

  Type: (type) => {
    return Type.for(type.sourceString)
  },

  VarExp: (id) => {
    return (new VarExp(id.toAst())).enrichWithDebugInformation(id)
  },

  Exp_or: (leftExpression, or, rightExpression) => {
    return (new LogicExpression(leftExpression.toAst(), 'or', rightExpression.toAst())).enrichWithDebugInformation(or)
  },

  Exp1_and: (leftExpression, and, rightExpression) => {
    return (new LogicExpression(leftExpression.toAst(), 'and', rightExpression.toAst())).enrichWithDebugInformation(and)
  },

  Exp2_compare: (leftExpression, operator, rightExpression) => {
    return (new CompareExpression(leftExpression.toAst(), operator.toAst(), rightExpression.toAst())).enrichWithDebugInformation(operator)
  },

  Exp3_add: (leftExpression, operator, rightExpression) => {
    return (new AddOpExpression(leftExpression.toAst(), operator.toAst(), rightExpression.toAst())).enrichWithDebugInformation(operator)
  },

  Exp4_mul: (leftExpression, operator, rightExpression) => {
    return (new MulOpExpression(leftExpression.toAst(), operator.toAst(), rightExpression.toAst())).enrichWithDebugInformation(operator)
  },

  Exp5_unary: (operator, expression) => {
    return (new UnaryExpression(expression.toAst(), operator.toAst())).enrichWithDebugInformation(operator)
  },

  OtherExp_parens: (_left, expression, _right) => {
    return expression.toAst()
  },

  OtherExp_CastVariable: (type, _lparen, expression, _rparen) => {
    return (new CastVariable(type.toAst(), expression.toAst())).enrichWithDebugInformation(type)
  },

  GlobalStatement_DefVoidMethod: (id, params, block) => {
    return (new DefGlobalVoidMethod(id.toAst(), params.toAst(), block.toAst())).enrichWithDebugInformation(id)
  },

  GlobalStatement_DefReturnMethod: (id, params, _sep, returnType, block) => {
    return (new DefGlobalMethod(id.toAst(), params.toAst(), returnType.toAst(), block.toAst())).enrichWithDebugInformation(id)
  },

  LocalStatement_decl: (_let, varAndType, _br) => {
    let ve = varAndType.toAst()
    return (new DeclareVariable(ve, ve.type)).enrichWithDebugInformation(varAndType)
  },

  LocalStatement_declAssign: (_let, varAndType, _assigment, value, _br) => {
    let ve = varAndType.toAst()
    return new Joiner(
      new DeclareVariable(ve, ve.type).enrichWithDebugInformation(varAndType),
      new AssignVariable(ve, value.toAst()).enrichWithDebugInformation(value)
    ).enrichWithDebugInformation(_let)
  },

  LocalStatement_declGuessType: (_let, varExp, _assigment, value, _br) => {
    let ve = varExp.toAst()
    let v = value.toAst()
    return new Joiner(
      new DeclareVariable(ve, v.type).enrichWithDebugInformation(varExp),
      new AssignVariable(ve, value.toAst()).enrichWithDebugInformation(value)
    ).enrichWithDebugInformation(_let)
  },

  LocalStatement_ReturnExp: (_return, expression, _br) => {
    return new ReturnStatement(expression.toAst()).enrichWithDebugInformation(_return)
  },

  LocalStatement_ReturnVoid: (_return, _br) => {
    return new ReturnVoidStatement().enrichWithDebugInformation(_return)
  },

  LocalStatement_Assign: (varExp, _assign, exp, _br) => {
    return new AssignVariable(varExp.toAst(), exp.toAst()).enrichWithDebugInformation(varExp)
  },

  LocalStatement_if: (_if, _lparen, expression, _rparen, block) => {
    return new IfStatement(expression.toAst(), block.toAst()).enrichWithDebugInformation(_if)
  },

  LocalStatement_ifElse: (_if, _lparen, expression, _rparen, ifBlock, _else, elseBlock) => {
    return new IfElseStatement(expression.toAst(), ifBlock.toAst(), elseBlock.toAst()).enrichWithDebugInformation(_if)
  },

  LocalStatement_While: (_while, _lparen, expression, _rparen, block) => {
    return new WhileStatement(expression.toAst(), block.toAst()).enrichWithDebugInformation(_while)
  },

  LocalStatement_Loop: (_loop, block) => {
    return new LoopStatement(block.toAst()).enrichWithDebugInformation(_loop)
  }, 

  LocalStatement_Break: (_keyword, _br) => {
    return new BreakStatement().enrichWithDebugInformation(_keyword)
  }, 

  LocalStatement_Repeat: (_repeat, _lparen, number, _rparen, block) => {
    return new RepeatStatement(number.toAst(), block.toAst()).enrichWithDebugInformation(_repeat)
  },

  LocalStatement_RunVoidMethod: (method, _br) => {
    return new Joiner(
      method.toAst(),
      new StackPop()
    ).enrichWithDebugInformation(method)
  },

  RunMethod_FireCannon(_keyword, args) {
    return (new FireMethod(args.toAst())).enrichWithDebugInformation(_keyword)
  },

  RunMethod_Turn(_keyword, args) {
    return (new TurnMethod(args.toAst())).enrichWithDebugInformation(_keyword)
  },

  RunMethod_RotateCannon(_keyword, args) {
    return (new RotateCannonMethod(args.toAst())).enrichWithDebugInformation(_keyword)
  },

  RunMethod_Message: (_keyword, args) => {
    return (new MessageMethod(args.toAst())).enrichWithDebugInformation(_keyword)
  },

  RunMethod_Move(_keyword, args) {
    return (new MoveMethod(args.toAst())).enrichWithDebugInformation(_keyword)
  },

  RunMethod_Wait: (_keyword, args) => {
    return (new WaitMethod(args.toAst())).enrichWithDebugInformation(_keyword)
  },

  RunMethod_Custom: (id, args) => {
    return (new RunMethod(id.toAst(), args.toAst())).enrichWithDebugInformation(id)
  },

  VarAndType: (varExp, _sep, type) => {
    let va = varExp.toAst()
    va.type = type.toAst()
    return va
  },

  Args: (_lparen, expressions, _rparen) => {
    return expressions.toAst()
  },

  Params: (_lparen, params, _rparen) => {
    return params.toAst()
  },

  Param: (id, _sep, type) => {
    return (new Param(id.toAst(), type.toAst())).enrichWithDebugInformation(id)
  },

  number: (number) => {
    return (new Number(number.sourceString)).enrichWithDebugInformation(number)
  },

  text: (_lparen, text, _rparen) => {
    return (new Text(text.sourceString)).enrichWithDebugInformation(text)
  },

  boolean: (boolean) => {
    return (new Boolean(boolean.sourceString)).enrichWithDebugInformation(boolean)
  },

  addop: (op) => {
    return op.sourceString
  },

  mulop: (op) => {
    return op.sourceString
  },

  id: (op, rest) => {
    return op.sourceString + rest.sourceString
  },

  prefixop: (op) => {
    return op.sourceString
  },

  compare: (op) => {
    return op.sourceString
  },

  comments: (_hash, _text) => {
    return new Base()
  },

  EmptyListOf: () => [],

  NonemptyListOf: function(el, _sep, els) {
    return [el.toAst()].concat(els.toAst())
  }
}

