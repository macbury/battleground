# Variable

A variable is a storage location in memory that has specified identifier and type.
Variable has an associated value of given type that can be changed using assignment operator or prefix.

## Types in Tank language
Declaration of variable requires specifying `let` keyword, a name and type of variable, and optionally initialization value. Examples of valid declarations are shown below:

```
let name : number;
let other = 2;
```

Once you defined a variable, you can use it to put information in it. However, the information that a variable can contain, must always be of the correct type: a variable of type text can not contain a number, etc.

If the name of a type is not highlighted, this means that the name is misspelled. Type names are always written with lower case characters. Here is a list of the different types: 

### Number
This type represents integer numbers. Internally, `number` is a 32-bit signed integer. For this reason variables of this type can hold values in range -9007199254740991 to +9007199254740991


```
let variableName : number;
let variableName : number = 10;
```

### Boolean
This is a logical type which is used in conditions and comparison expressions. There are only two valid values for this type: `false` and `true`.


```
let variableName : boolean;
let variableName : boolean = true;
```

### Text
String type represents a sequence of characters.

```
let variableName : text;
let variableName : text = "Hello world";
```


