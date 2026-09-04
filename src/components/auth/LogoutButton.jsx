import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  signOut,
} from "../../services/auth/authService";

function LogoutButton() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await signOut();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      alert(
        "Unable to logout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading
        ? "Logging out..."
        : "Logout"}
    </button>
  );
}

export default LogoutButton;