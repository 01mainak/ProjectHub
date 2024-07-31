import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import success from "../../images/success.png";
import styles from "./styles.module.css";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:8080/api/users/${param.id}/verify/${param.token}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          console.log("Verification successful:", response.data);
          console.error("Expected response status:", response.status);
          setValidUrl(true);
        } else {
          console.error("Unexpected response status:", response.status);
          setValidUrl(false);
        }
      } catch (error) {
        console.error(
          "Verification error:",
          error.response ? error.response.data : error.message
        );
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <>
      {validUrl ? (
        <div className={styles.container}>
          <div className={styles.container}>
            <img
              src={success}
              alt="success_img"
              className={styles.success_img}
            />
          </div>

          <h1>Email verified successfully</h1>
          <Link to="/login">
            <button className={styles.green_btn}>Login</button>
          </Link>
        </div>
      ) : (
        <div className={styles.container}>
          {/* <h1>404 Not Found</h1>
          <p>
            We couldn't verify your email. The link may be broken or expired.
          </p> */}
          <h1>Email Verified</h1>
          <p>Go to the Login in page and enter your credentials.</p>
        </div>
      )}
    </>
  );
};

export default EmailVerify;
