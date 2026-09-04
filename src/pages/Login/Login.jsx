import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signIn } from "../../services/auth/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError(
        "Please enter email and password."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signIn(
        email,
        password
      );

      navigate("/home");
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>
        Welcome Back
      </h1>

      <form
        onSubmit={handleLogin}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>

      {error && (
        <p>{error}</p>
      )}

      <button
        type="button"
        onClick={() =>
          navigate("/signup")
        }
      >
        Create Account
      </button>

      <button
        type="button"
        onClick={() =>
          navigate("/")
        }
      >
        Back
      </button>
    </div>
  );
}

export default Login;