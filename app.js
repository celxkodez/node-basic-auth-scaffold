const input = prompt('enter some numbers')
const style = prompt('ascend or descend or reverse')

//ascend
if ((input != '') & (style == 'ascend')) {
  var array = input.split('')
  array.sort((a, b) => a - b)
  alert(array.join(''))
}
//descend
if ((input != '') & (style == 'descend')) {
  var array = input.split('')
  array.sort((a, b) => b - a)
  alert(array.join(''))
}
//reverse
if ((input != '') & (style == 'reverse')) {
  var array = input.split('').reverse().join('')
  alert(array)
}
//default
else if (input == '' || style == '') alert('field cannot be left empty')
