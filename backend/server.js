import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});


try {
  const connection = await db.getConnection();
  console.log(" MySQL connected successfully");
  connection.release();
} catch (err) {
  console.error("❌ MySQL connection error:");
  console.error(err);
}

app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM students ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const {
      name,
      enrollmentNumber,
      email,
      mobileNumber,
      branch
    } = req.body;

    // Validation
    if (
      !name ||
      !enrollmentNumber ||
      !email ||
      !mobileNumber ||
      !branch
    ) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    await db.query(
      `INSERT INTO students
      (name, enrollment_number, email, mobile_number, branch)
      VALUES (?, ?, ?, ?, ?)`,
      [name, enrollmentNumber, email, mobileNumber, branch]
    );

    res.status(201).json({
      message: "Student Registered Successfully "
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM students WHERE id = ?",
      [id]
    );

    res.json({
      message: "🗑 Student Deleted Successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});