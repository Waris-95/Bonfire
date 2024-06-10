import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="signup-page">
      <video autoPlay muted loop className="background-video">
        <source src="https://bonfire-movie.s3.us-east-2.amazonaws.com/Bonfire+Animation.mp4" type="video/mp4" />
      </video>
      <div className="signup-container">
        <h1 className="signup-header">Sign Up to Start the Conversation</h1>
        {errors.server && <p className="error">{errors.server}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <label className="signup-label">
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-input"
            />
          </label>
          {errors.email && <p className="error">{errors.email}</p>}
          <label className="signup-label">
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="signup-input"
            />
          </label>
          {errors.username && <p className="error">{errors.username}</p>}
          <label className="signup-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-input"
            />
          </label>
          {errors.password && <p className="error">{errors.password}</p>}
          <label className="signup-label">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="signup-input"
            />
          </label>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <div className="login-redirect">
          Already have an account? <a href="/login">Click here</a> to login.
        </div>
      </div>
    </div>
  );
}

export default SignupFormPage;
