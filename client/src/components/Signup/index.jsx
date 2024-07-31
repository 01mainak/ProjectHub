import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    setError("");
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // full name check
    const full_name = data.name.split(" ");
    if (full_name.length < 2) {
      setError("Full Name required");
      return;
    }
    // email verify
    const emailDomain = data.email.split("@")[1];
    if (emailDomain !== "lnmiit.ac.in") {
      setError("Email must be from the domain 'lnmiit.ac.in'");
      return;
    }
    // verify password
    if (!validatePassword(data.password)) {
      setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    // role validation
    if (!["student", "admin"].includes(data.role.toLowerCase().trim())) {
      setError("Role must be either 'student' or 'admin'");
      return;
    }
    // admin validation
    if (
      "admin" === data.role.toLowerCase().trim() &&
      ![
        "22ucs216",
        "22ucs067",
        "22ucs110",
        "22ucs236",
        "22ucs212",
        "23uec040", // tester
      ].includes(data.email.split("@")[0].toLowerCase().trim())
    ) {
      setError("Unauthorized 'admin'");
      return;
    }

    try {
      const url = "http://localhost:8080/api/users";
      const { data: res } = await axios.post(url, data);
      setMsg(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Sign in
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              onChange={handleChange}
              value={data.name}
              required
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            <select
              name="role"
              onChange={handleChange}
              value={data.role}
              required
              className={styles.input}>
              <option value="" disabled>
                Select role
              </option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            {error && <div className={styles.error_msg}>{error}</div>}
            {msg && <div className={styles.success_msg}>{msg}</div>}
            <button type="submit" className={styles.green_btn}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
