import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Mausam</h1>
      <p>Weather that understands you.</p>

      <button onClick={() => navigate("/onboarding")}>
        Get Started
      </button>
    </div>
  );
}

export default Welcome;