import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Student from "../Student";
import Admin from "../Admin";
import styles from "./styles.module.css";

const Main = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        setUserName(decodedToken.name);
        setEmail(decodedToken.email);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  if (!role) {
    return null;
  }
  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>ProjectHub</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      {role === "student" ? (
        <Student userName={userName} email={email} />
      ) : (
        <Admin userName={userName} email={email} />
      )}
    </div>
  );
};

export default Main;
