monaco.languages.register({ id: 'TankLang' })

monaco.languages.registerCompletionItemProvider('TankLang', {
  provideCompletionItems: () => {
    return [
      {
        label: 'let',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: {
          value: 'let ${1:variable} = ${2:value};'
        }
      },
      {
        label: 'fire',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: {
          value: 'fire();'
        }
      },
      {
        label: 'wait',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: {
          value: 'wait(${1:1000});'
        }
      },
      {
        label: 'rotateCannon',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: {
          value: 'rotateCannon(${1:degrees});'
        }
      },
      {
        label: 'move',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: {
          value: 'move(${1:distance});'
        }
      },
      {
        label: 'turn',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: {
          value: 'turn(${1:degrees});'
        }
      },
      {
        label: 'message',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: {
          value: 'message("${1:content}");'
        }
      },
      {
        label: 'ifelse',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            'if (${1:condition}) {',
            '  $0',
            '} else {',
            '  ',
            '}'
          ].join('\n')
        }
      },

      {
        label: 'loop',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            'loop {',
            '  $0',
            '}'
          ].join('\n')
        }
      },

      {
        label: 'repeat',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            'repeat(${1:times}) {',
            '  $0',
            '}'
          ].join('\n')
        }
      },

      {
        label: 'while',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: {
          value: [
            'while(${1:condition}) {',
            '  $0',
            '}'
          ].join('\n')
        }
      }
    ]
  }
})

monaco.languages.setLanguageConfiguration('TankLang', {
  comments: {
    lineComment: '#'
  },

  tabSize: 2,

  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],

  autoClosingPairs: [
    { open: '{', close: '}' },
    //{ open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' }
  ],

  surroundingPairs: [
    { open: '{', close: '}' },
    //{ open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ]
})

monaco.languages.setMonarchTokensProvider('TankLang', {
  // Set defaultToken to invalid to see what you do not tokenize yet
  // defaultToken: 'invalid',

  keywords: [
    "let", "if", "else", "print", "return", "message", "repeat", "loop", 
    "while", "not", "and", "or", "true", "false", "break", "constant",

    "wait", "move", "turn", "rotateCannon", "fire"
  ],

  typeKeywords: [
    "number", "boolean", "text"
  ],

  operators: [
    "<=", "<", "==", "!=", ">=", ">", "+", "-", "*", "/", "-"
  ],

  // we include these common regular expressions
  symbols:  /[=><!~?:&|+\-*\/\^%]+/,

  // C# style strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-z_$][\w$]*/, { cases: { '@typeKeywords': 'keyword',
                                   '@keywords': 'keyword',
                                   '@default': 'identifier' } }],
      [/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely

      // whitespace
      { include: '@whitespace' },

      // delimiters and operators
      [/[{}()]/, '@brackets'],
      [/@symbols/, { cases: { '@operators': 'operator',
                              '@default'  : '' } } ],

      // numbers
      [/\d+/, 'number'],

      // delimiter: after number because of .\d floats
      [/[;]/, 'delimiter'],

      // strings
      [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],

      // characters
      [/'[^\\']'/, 'string'],
      [/(')(@escapes)(')/, ['string','string.escape','string']],
      [/'/, 'string.invalid']
    ],

    string: [
      [/[^\\"]+/,  'string'],
      [/@escapes/, 'string.escape'],
      [/\\./,      'string.escape.invalid'],
      [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\#.*$/,    'comment'],
    ],
  },
})

