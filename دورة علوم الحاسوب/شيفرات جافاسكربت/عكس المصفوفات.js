let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function reverse(arr) {
  let reversed = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
  }
  return reversed;
}
console.log(reverse(numbers));

for (let i of reverse(numbers)) {
  console.log(i);
}

// Output:
// 10
// 9
// 8
// 7
// 6
// 5
// 4
// 3
// 2
// 1
