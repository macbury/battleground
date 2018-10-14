export class IO {
  print(data) {
    
  }
}

export class ConsoleIO extends IO {
  print(data) {
    super.print(data)
    console.log(data)
  }
}

export class ArrayIO extends IO {
  content = []

  print(line) {
    super.print(line)
    this.content.push(line)
  }
}
