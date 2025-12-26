const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("Blog.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the Blog database.");
});

// db.run(
//   "CREATE TABLE Articles(ArticleID INTEGER PRIMARY KEY, ArticleName TEXT, Author TEXT, Date TEXT)",
//   (err) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       console.log("Articles table created.");
//     }
//   }
// );

// db.run(
//   "CREATE TABLE Comments(CommentID INTEGER PRIMARY KEY, Name TEXT, Content TEXT, ArticleID INTEGER, Date TEXT, FOREIGN KEY(ArticleID) REFERENCES Articles(ArticleID))",
//   (err) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       console.log("Comments table created.");
//     }
//   }
// );

// db.run(
//   "INSERT INTO Articles(ArticleID,ArticleName, Author, Date)" +
//     "VALUES (1111, 'PHP', 'Ahmed', '2019')," +
//     "(2222, 'DataBase', 'Mohamad', '2020')," +
//     "(3333, 'JavaScript', 'Omar', '2021')," +
//     "(4444, 'HTML', 'Samer', '2022')," +
//     "(5555, 'CSS', 'Lina', '2023')," +
//     "(6666, 'React', 'Nour', '2024')," +
//     "(7777, 'NodeJS', 'Khaled', '2025')," +
//     "(8888, 'Python', 'Rana', '2026')," +
//     "(9999, 'Django', 'Yousef', '2027')",
//   (err) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       console.log("Records inserted into Articles table.");
//     }
//   }
// );

// db.run(
//   "INSERT INTO Comments(CommentID, Name, Content, ArticleID, Date)" +
//     "VALUES (1, 'Ali', 'Great article!', 1111, '2023-01-01')," +
//     "(2, 'Sara', 'Very informative.', 2222, '2023-02-15')," +
//     "(3, 'John', 'Thanks for sharing.', 3333, '2023-03-10')," +
//     "(4, 'Mona', 'Helpful tips.', 4444, '2023-04-05')," +
//     "(5, 'Ziad', 'Well written.', 5555, '2023-05-20')," +
//     "(6, 'Laila', 'I learned a lot.', 6666, '2023-06-30')," +
//     "(7, 'Omar', 'Excellent read.', 7777, '2023-07-25')," +
//     "(8, 'Nadia', 'Very useful.', 8888, '2023-08-15')," +
//     "(9, 'Tariq', 'Great insights.', 9999, '2023-09-10')," +
//     "(10, 'Hana', 'Loved it!', 1111, '2023-10-05')," +
//     "(11, 'Kareem', 'Fantastic article.', 2222, '2023-11-20')," +
//     "(12, 'Rania', 'Very well explained.', 3333, '2023-12-15')," +
//     "(13, 'Fadi', 'Superb content.', 4444, '2024-01-10')," +
//     "(14, 'Dina', 'Highly recommend.', 5555, '2024-02-25')," +
//     "(15, 'Sami', 'Great job!', 6666, '2024-03-30')," +
//     "(16, 'Yara', 'Informative read.', 7777, '2024-04-20')," +
//     "(17, 'Bassam', 'Well structured.', 8888, '2024-05-15')," +
//     "(18, 'Lina', 'Very engaging.', 9999, '2024-06-10')," +
//     "(19, 'Adel', 'Loved the examples.', 1111, '2024-07-05')," +
//     "(20, 'Rima', 'Clear and concise.', 2222, '2024-08-20')," +
//     "(21, 'Nabil', 'Great explanations.', 3333, '2024-09-15')," +
//     "(22, 'Maya', 'Very helpful.', 4444, '2024-10-10')," +
//     "(23, 'Tamer', 'Excellent content.', 5555, '2024-11-05')," +
//     "(24, 'Sahar', 'Well done!', 6666, '2024-12-20')," +
//     "(25, 'Jad', 'Informative article.', 7777, '2025-01-15')",
//   (err) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       console.log("Records inserted into Comments table.");
//     }
//   }
// );

// db.all('SELECT * FROM Articles WHERE Date = "2019"', function (err, rows) {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log(rows);
// });

// db.all(
//   "SELECT Articles.ArticleName, Articles.Date, count(Comments.CommentID) AS CommentCount FROM Articles LEFT JOIN Comments ON Comments.ArticleID = Articles.ArticleID GROUP BY Articles.ArticleName, Articles.Date",
//   function (err, rows) {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log(rows);
//   }
// );

// db.run(
//   'UPDATE Comments SET Content = "Great article! Really enjoyed it." WHERE CommentID = "1" ',
//   function (err) {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log("Row(s) updated");
//   }
// );

// db.run("DELETE FROM Comments WHERE CommentID = 25", function (err) {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Row(s) deleted");
// });

// db.run("DELETE FROM Comments WHERE ArticleID = 2222", function (err) {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Row(s) deleted");
// });

// db.run("DELETE FROM Articles WHERE ArticleID = 2222", function (err) {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Row(s) deleted");
// });

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Closed the database connection.");
});
