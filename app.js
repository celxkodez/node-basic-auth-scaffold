const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
//ascend
rl.question('enter some numbers: ', (input) => {
  rl.question('enter a style: ', (style) => {
    if ((input != '') & (style == 'ascend')) {
      var array = input.split('')
      array.sort((a, b) => a - b)
      console.log(array.join(''))
      rl.close()
    }
  })
})

//descend
rl.question('enter some numbers: ', (input) => {
  rl.question('enter a style: ', (style) => {
    if ((input != '') & (style == 'descend')) {
      var array = input.split('')
      array.sort((a, b) => b - a)
      console.log(array.join(''))
      rl.close()
    }
  })
})

//reverse
rl.question('enter some numbers: ', (input) => {
  rl.question('enter a style: ', (style) => {
    if ((input != '') & (style == 'reverse')) {
      var array = input.split('').reverse().join('')
      console.log(array)
      rl.close()
    }
  })
})
