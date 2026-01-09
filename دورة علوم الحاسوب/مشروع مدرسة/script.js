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
    if (!["a", "d", "u", "s"].includes((choice || "").toLowerCase())) {
      console.log(
        "❌ Invalid choice! Please enter only 'a', 'd', 'u', or 's'."
      );
      mainMenu();
      return;
    }

    switch ((choice || "").toLowerCase()) {
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
    }
  });
}

function addStudent() {
  rl.question("Enter student number (11 digits): ", (studentNumber) => {
    if (!/^\d{11}$/.test(studentNumber)) {
      console.log("❌ Invalid student number! Must be exactly 11 digits.");
      addStudent();
      return;
    }

    rl.question(
      "Enter first name (English OR Arabic letters only): ",
      (firstName) => {
        if (
          !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(firstName) ||
          firstName.trim().length === 0
        ) {
          console.log("❌ Invalid first name! Must contain letters only.");
          addStudent();
          return;
        }

        rl.question(
          "Enter last name (English OR Arabic letters only): ",
          (lastName) => {
            if (
              !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(lastName) ||
              lastName.trim().length === 0
            ) {
              console.log("❌ Invalid last name! Must contain letters only.");
              addStudent();
              return;
            }

            rl.question("Enter age (numbers only): ", (age) => {
              if (!/^\d+$/.test(age)) {
                console.log("❌ Invalid age! Must contain numbers only.");
                addStudent();
                return;
              }

              rl.question("Enter class (numbers only): ", (studentClass) => {
                if (!/^\d+$/.test(studentClass)) {
                  console.log("❌ Invalid class! Must contain numbers only.");
                  addStudent();
                  return;
                }

                rl.question(
                  "Enter registration date (DD/MM/YYYY): ",
                  (registerDate) => {
                    if (
                      !/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/.test(
                        registerDate
                      )
                    ) {
                      console.log(
                        "❌ Invalid date format! Use DD/MM/YYYY format."
                      );
                      addStudent();
                      return;
                    }

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
                          console.log(
                            `${lesson.lesson_id}. ${lesson.lesson_name}`
                          );
                        });
                        rl.question(
                          "Enter lesson numbers (comma-separated): ",
                          (lessonNumbers) => {
                            if (
                              !(
                                lessonNumbers.trim().length === 0 ||
                                (/^[\d\s,]+$/.test(lessonNumbers) &&
                                  !lessonNumbers.startsWith(",") &&
                                  !lessonNumbers.endsWith(","))
                              )
                            ) {
                              console.log(
                                "❌ Invalid lesson numbers! Use numbers separated by commas only."
                              );
                              addStudent();
                              return;
                            }

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
                                  console.error(
                                    "❌ Error adding student:",
                                    err.message
                                  );
                                } else {
                                  console.log("✅ Student added successfully.");
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
          }
        );
      }
    );
  });
}

function deleteStudent() {
  rl.question(
    "Enter the student number to delete (11 digits): ",
    (studentNumber) => {
      if (!/^\d{11}$/.test(studentNumber)) {
        console.log("❌ Invalid student number! Must be exactly 11 digits.");
        deleteStudent();
        return;
      }

      db.run(
        `DELETE FROM students WHERE student_number = ?`,
        [studentNumber],
        (err) => {
          if (err) {
            console.error("❌ Error deleting student:", err.message);
          } else {
            console.log("✅ Student deleted successfully.");
            mainMenu();
          }
        }
      );
    }
  );
}

function updateStudent() {
  rl.question(
    "Enter the student number to update (11 digits): ",
    (studentNumber) => {
      if (!/^\d{11}$/.test(studentNumber)) {
        console.log("❌ Invalid student number! Must be exactly 11 digits.");
        updateStudent();
        return;
      }

      db.get(
        `SELECT * FROM students WHERE student_number = ?`,
        [studentNumber],
        (err, row) => {
          if (err) {
            console.error("Error finding student:", err.message);
          } else if (!row) {
            console.log("❌ Student not found.");
            mainMenu();
          } else {
            rl.question(
              "Enter new first name (letters only): ",
              (firstName) => {
                if (
                  !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(firstName) ||
                  firstName.trim().length === 0
                ) {
                  console.log(
                    "❌ Invalid first name! Must contain letters only."
                  );
                  updateStudent();
                  return;
                }

                rl.question(
                  "Enter new last name (letters only): ",
                  (lastName) => {
                    if (
                      !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(lastName) ||
                      lastName.trim().length === 0
                    ) {
                      console.log(
                        "❌ Invalid last name! Must contain letters only."
                      );
                      updateStudent();
                      return;
                    }

                    rl.question("Enter new age (numbers only): ", (age) => {
                      if (!/^\d+$/.test(age)) {
                        console.log(
                          "❌ Invalid age! Must contain numbers only."
                        );
                        updateStudent();
                        return;
                      }

                      rl.question(
                        "Enter new class (numbers only): ",
                        (studentClass) => {
                          if (!/^\d+$/.test(studentClass)) {
                            console.log(
                              "❌ Invalid class! Must contain numbers only."
                            );
                            updateStudent();
                            return;
                          }

                          rl.question(
                            "Enter new registration date (DD/MM/YYYY, example: 01/01/2026): ",
                            (registerDate) => {
                              if (
                                !/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/.test(
                                  registerDate
                                )
                              ) {
                                console.log(
                                  "❌ Invalid date format! Use DD/MM/YYYY format."
                                );
                                updateStudent();
                                return;
                              }

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
                                    "Enter new lesson numbers (comma-separated, example: 1,3,5): ",
                                    (lessonNumbers) => {
                                      if (
                                        !(
                                          lessonNumbers.trim().length === 0 ||
                                          (/^[\d\s,]+$/.test(lessonNumbers) &&
                                            !lessonNumbers.startsWith(",") &&
                                            !lessonNumbers.endsWith(","))
                                        )
                                      ) {
                                        console.log(
                                          "❌ Invalid lesson numbers! Use numbers separated by commas only."
                                        );
                                        updateStudent();
                                        return;
                                      }

                                      const selectedIds = lessonNumbers
                                        .split(",")
                                        .map((id) => parseInt(id.trim()))
                                        .filter((id) => !isNaN(id));
                                      const selectedLessons = lessons
                                        .filter((lesson) =>
                                          selectedIds.includes(lesson.lesson_id)
                                        )
                                        .map((lesson) => lesson.lesson_name);
                                      const lessonsString =
                                        selectedLessons.join(", ");
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
                                              "❌ Error updating student:",
                                              err.message
                                            );
                                          } else {
                                            console.log(
                                              "✅ Student updated successfully."
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
                        }
                      );
                    });
                  }
                );
              }
            );
          }
        }
      );
    }
  );
}

function showStudent() {
  rl.question(
    "Enter the student number to view (11 digits): ",
    (studentNumber) => {
      if (!/^\d{11}$/.test(studentNumber)) {
        console.log("❌ Invalid student number! Must be exactly 11 digits.");
        showStudent();
        return;
      }

      db.get(
        `SELECT * FROM students WHERE student_number = ?`,
        [studentNumber],
        (err, row) => {
          if (err) {
            console.error("Error finding student:", err.message);
          } else if (!row) {
            console.log("❌ Student not found.");
            mainMenu();
          } else {
            console.log(
              `\n✅ Student Information:\nNumber: ${
                row.student_number
              }\nFirst Name: ${row.first_name}\nLast Name: ${
                row.last_name
              }\nAge: ${row.age}\nClass: ${
                row.student_class
              }\nRegistration Date: ${row.register_date}\nEnrolled Lessons: ${
                row.lessons || "None"
              }\n`
            );
            mainMenu();
          }
        }
      );
    }
  );
}
