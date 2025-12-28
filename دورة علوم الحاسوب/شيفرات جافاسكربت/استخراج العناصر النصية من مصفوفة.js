let data = ["Anas", 21, 23, true, "Omar", 19, false];
for (let item of data) {
  if (typeof item === "string") {
    console.log(item);
  }
}
// Output:
// Anas
// Omar
