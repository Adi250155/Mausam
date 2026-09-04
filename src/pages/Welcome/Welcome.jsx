import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>
        Welcome to Mausam
      </h1>

      <p>
        Weather that understands you.
      </p>

      <button
        type="button"
        onClick={() =>
          navigate("/signup")
        }
      >
        Get Started
      </button>

      <button
        type="button"
        onClick={() =>
          navigate("/login")
        }
      >
        Login
      </button>
    </div>
  );
}

export default Welcome;