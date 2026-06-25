import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    email: "",
    mobileNumber: "",
    branch: "",
  });

  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/students", formData);
      setMessage(res.data.message);
      setFormData({
        name: "",
        enrollmentNumber: "",
        email: "",
        mobileNumber: "",
        branch: "",
      });
      fetchStudents();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container">
      <h1>Student Registration System</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="enrollmentNumber"
          placeholder="Enrollment Number"
          value={formData.enrollmentNumber}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={formData.branch}
          onChange={handleChange}
        />
        <button type="submit">Add Student</button>
      </form>

      {message && <p className="message">{message}</p>}

      <h2>All Students</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Enrollment No.</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Branch</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.enrollment_number}</td>
              <td>{student.email}</td>
              <td>{student.mobile_number}</td>
              <td>{student.branch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;