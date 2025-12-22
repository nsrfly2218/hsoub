let number = prompt("Enter a number to check if it's prime:");
for (number > 0; number--; )
  if (isPrime(number)) {
    console.log(number + " is a prime number.");
  }

function isPrime(num) {
  for (let i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}

// Output:
// 7 is a prime number.
// 5 is a prime number.
// 3 is a prime number.
// 2 is a prime number.
