import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, Link } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <video autoPlay muted loop className="background-video">
        <source src="https://bonfire-movie.s3.us-east-2.amazonaws.com/Bonfire+Animation.mp4" type="video/mp4" />
      </video>
      <div className="content-overlay">
        <h1 className="login-header">Log In</h1>
        {errors.length > 0 &&
          errors.map((message) => <p key={message} className="error">{message}</p>)}
        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </label>
          {errors.email && <p className="error">{errors.email}</p>}
          <label className="login-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </label>
          {errors.password && <p className="error">{errors.password}</p>}
          <button type="submit" className="login-button">Log In</button>
        </form>
        <div className="signup-redirect">
          Need an account? <Link to="/signup">Signup</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;