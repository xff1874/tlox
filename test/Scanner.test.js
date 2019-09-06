/* global describe, it */
// import Scanner from "./build/Scanner"
const fs = require('fs')
const assert = require('assert')
const Scanner = require('../build/Scanner')

test('produces tokens for basic arithmetic', () => {
    const source = fs.readFileSync('./examples/simple.lox', 'utf-8')

    const tokens = new Scanner(source).scanTokens()
    expect(
      tokens.map(t => t.type),
      [
        'PRINT',
        'LEFT_PAREN',
        'NUMBER',
        'PLUS',
        'NUMBER',
        'RIGHT_PAREN',
        'STAR',
        'LEFT_PAREN',
        'NUMBER',
        'MINUS',
        'NUMBER',
        'RIGHT_PAREN',
        'SEMICOLON',
        'EOF'
      ]
    )
  })
