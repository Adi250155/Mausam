import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signUp } from "../../services/auth/authService";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill all fields."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await signUp(
        email,
        password
      );

      console.log(
        "Signup successful:",
        data
      );

      if (!data.session) {
        setError(
          "Account created, but no active session was returned. Please check your Supabase email confirmation settings."
        );

        return;
      }

      navigate("/onboarding");
    } catch (error) {
      console.error(
        "Signup error:",
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
        Create Your Mausam Account
      </h1>

      <form
        onSubmit={handleSignup}
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

        <input
          type="password"
          placeholder="Confirm Password"
          value={
            confirmPassword
          }
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating account..."
            : "Create Account"}
        </button>
      </form>

      {error && (
        <p>{error}</p>
      )}

      <button
        type="button"
        onClick={() =>
          navigate("/login")
        }
      >
        Already have an account? Login
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

export default Signup;