let starsRow = 5;
for (let star = 1; star <= starsRow; star++) {
  let stars = "";
  for (let j = 1; j <= star; j++) {
    stars += "*";
  }
  console.log(stars);
}

// Output:
// *
// **
// ***
// ****
// *****
