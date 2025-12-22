let myName = "Anas";
console.log("Hi, my name is " + myName + ".");
console.log(typeof myName);
let myAge = 21;
console.log("I am " + myAge + " years old.");
console.log(typeof myAge);
const birthYear = 2004;
console.log("I was born in " + birthYear + ".");
console.log(typeof birthYear);
let isStudent = true;
console.log("Am I a student? " + isStudent + ".");
console.log(typeof isStudent);
let myCourses = ["HTML", "CSS", "JavaScript"];
console.log(myCourses);
console.log(typeof myCourses);

let names = ["Anas", "Omar", "Lina"];
for (let i = names.length - 1; i >= 0; i--) {
  console.log(names[i]);
}

let x = names.length - 1;
while (x >= 0) {
  console.log(names[x]);
  x--;
}

for (let name in names) {
  console.log(names[name]);
}

for (let y = 0; y <= 10; y++) {
  if (y % 2 === 1) continue;
  console.log(y);
}
