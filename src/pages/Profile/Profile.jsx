import {
  useNavigate,
} from "react-router-dom";

import LogoutButton from "../../components/auth/LogoutButton";

function Profile() {
  const navigate =
    useNavigate();

  return (
    <div>
      <h1>Profile</h1>

      <button
        onClick={() =>
          navigate("/onboarding")
        }
      >
        Edit Interests
      </button>

      <button
        onClick={() =>
          navigate(
            "/saved-locations"
          )
        }
      >
        Manage Locations
      </button>

      <LogoutButton />
    </div>
  );
}

export default Profile;