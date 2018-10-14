## Functions

Function body is simply a list of statements within a block. Variables defined within function are local to the function and are not accessible outside:

```
myFunction() {
  let a = 2 + 2;
}
```

Each function has a return type. Return type is a type of value that is returned by function. For example, function defined to return `number` will return values of type `number`.

Value is returned from function using `return` statement. `return` also terminates execution of code inside this function. If you want to return a value, simply write:

```
testFunction() : number {
  return 100;
}
```

In case you want to just terminate execution of code:

```
testFunction() {
  return; # after this line code will not be runned
}

```