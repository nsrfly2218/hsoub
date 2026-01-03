const sqlite3 = require("sqlite3").verbose();
const readline = require("readline");

const db = new sqlite3.Database("school.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to SQLite database.");
    initializeDatabase(() => {
      mainMenu();
    });
  }
});

function initializeDatabase(callback) {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS students (
            student_id INTEGER PRIMARY KEY,
            student_number TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            age INTEGER NOT NULL,
            student_class TEXT NOT NULL,
            register_date TEXT NOT NULL,
            lessons TEXT
        )`);

    db.run(
      `CREATE TABLE IF NOT EXISTS lessons (
            lesson_id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_name TEXT NOT NULL UNIQUE
        )`,
      () => {
        const lessons = [
          "Math",
          "Arabic",
          "English",
          "Science",
          "Physics",
          "Chemistry",
          "Biology",
          "History",
          "Geography",
          "Computer Science",
          "Art",
          "Music",
        ];
        const stmt = db.prepare(
          `INSERT OR IGNORE INTO lessons (lesson_name) VALUES (?)`
        );
        lessons.forEach((lesson) => stmt.run(lesson));
        stmt.finalize(callback);
      }
    );
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function mainMenu() {
  console.log("\nPlease choose an operation:");
  console.log("* To add a student, press 'a'");
  console.log("* To delete a student, press 'd'");
  console.log("* To update student information, press 'u'");
  console.log("* To view student information, press 's'");

  rl.question("Your choice: ", (choice) => {
    switch (choice) {
      case "a":
        addStudent();
        break;
      case "d":
        deleteStudent();
        break;
      case "u":
        updateStudent();
        break;
      case "s":
        showStudent();
        break;
      default:
        console.log("Invalid choice.");
        mainMenu();
    }
  });
}

function addStudent() {
  rl.question("Enter student number: ", (studentNumber) => {
    rl.question("Enter first name: ", (firstName) => {
      rl.question("Enter last name: ", (lastName) => {
        rl.question("Enter age: ", (age) => {
          rl.question("Enter class: ", (studentClass) => {
            rl.question("Enter registration date: ", (registerDate) => {
              db.all(
                `SELECT lesson_id, lesson_name FROM lessons`,
                (err, lessons) => {
                  if (err) {
                    console.error("Error fetching lessons:", err.message);
                    mainMenu();
                    return;
                  }
                  console.log("Available lessons:");
                  lessons.forEach((lesson) => {
                    console.log(`${lesson.lesson_id}. ${lesson.lesson_name}`);
                  });
                  rl.question(
                    "Enter lesson numbers (comma-separated): ",
                    (lessonNumbers) => {
                      const selectedIds = lessonNumbers
                        .split(",")
                        .map((id) => parseInt(id.trim()))
                        .filter((id) => !isNaN(id));
                      const selectedLessons = lessons
                        .filter((lesson) =>
                          selectedIds.includes(lesson.lesson_id)
                        )
                        .map((lesson) => lesson.lesson_name);
                      const lessonsString = selectedLessons.join(", ");
                      db.run(
                        `INSERT INTO students (student_number, first_name, last_name, age, student_class, register_date, lessons) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                          studentNumber,
                          firstName,
                          lastName,
                          age,
                          studentClass,
                          registerDate,
                          lessonsString,
                        ],
                        function (err) {
                          if (err) {
                            console.error("Error adding student:", err.message);
                          } else {
                            console.log("Student added successfully.");
                            mainMenu();
                          }
                        }
                      );
                    }
                  );
                }
              );
            });
          });
        });
      });
    });
  });
}

function deleteStudent() {
  rl.question("Enter the student number to delete: ", (studentNumber) => {
    db.run(
      `DELETE FROM students WHERE student_number = ?`,
      [studentNumber],
      (err) => {
        if (err) {
          console.error("Error deleting student:", err.message);
        } else {
          console.log("Student deleted successfully.");
          mainMenu();
        }
      }
    );
  });
}

function updateStudent() {
  rl.question("Enter the student number to update: ", (studentNumber) => {
    db.get(
      `SELECT * FROM students WHERE student_number = ?`,
      [studentNumber],
      (err, row) => {
        if (err) {
          console.error("Error finding student:", err.message);
        } else if (!row) {
          console.log("Student not found.");
          mainMenu();
        } else {
          rl.question("Enter new first name: ", (firstName) => {
            rl.question("Enter new last name: ", (lastName) => {
              rl.question("Enter new age: ", (age) => {
                rl.question("Enter new class: ", (studentClass) => {
                  rl.question(
                    "Enter new registration date: ",
                    (registerDate) => {
                      db.all(
                        `SELECT lesson_id, lesson_name FROM lessons`,
                        (err, lessons) => {
                          if (err) {
                            console.error(
                              "Error fetching lessons:",
                              err.message
                            );
                            mainMenu();
                            return;
                          }
                          console.log("Available lessons:");
                          lessons.forEach((lesson) => {
                            console.log(
                              `${lesson.lesson_id}. ${lesson.lesson_name}`
                            );
                          });
                          rl.question(
                            "Enter new lesson numbers (comma-separated): ",
                            (lessonNumbers) => {
                              const selectedIds = lessonNumbers
                                .split(",")
                                .map((id) => parseInt(id.trim()))
                                .filter((id) => !isNaN(id));
                              const selectedLessons = lessons
                                .filter((lesson) =>
                                  selectedIds.includes(lesson.lesson_id)
                                )
                                .map((lesson) => lesson.lesson_name);
                              const lessonsString = selectedLessons.join(", ");
                              db.run(
                                `UPDATE students SET first_name = ?, last_name = ?, age = ?, student_class = ?, register_date = ?, lessons = ? WHERE student_number = ?`,
                                [
                                  firstName,
                                  lastName,
                                  age,
                                  studentClass,
                                  registerDate,
                                  lessonsString,
                                  studentNumber,
                                ],
                                (err) => {
                                  if (err) {
                                    console.error(
                                      "Error updating student:",
                                      err.message
                                    );
                                  } else {
                                    console.log(
                                      "Student updated successfully."
                                    );
                                    mainMenu();
                                  }
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                });
              });
            });
          });
        }
      }
    );
  });
}

function showStudent() {
  rl.question("Enter the student number to view: ", (studentNumber) => {
    db.get(
      `SELECT * FROM students WHERE student_number = ?`,
      [studentNumber],
      (err, row) => {
        if (err) {
          console.error("Error finding student:", err.message);
        } else if (!row) {
          console.log("Student not found.");
          mainMenu();
        } else {
          console.log(
            `Student Information:\nNumber: ${row.student_number}\nFirst Name: ${
              row.first_name
            }\nLast Name: ${row.last_name}\nAge: ${row.age}\nClass: ${
              row.student_class
            }\nRegistration Date: ${row.register_date}\nEnrolled Lessons: ${
              row.lessons || "None"
            }`
          );
          mainMenu();
        }
      }
    );
  });
}
