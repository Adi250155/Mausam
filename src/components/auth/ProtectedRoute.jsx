import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function ProtectedRoute() {
  const {
    session,
    loading,
  } = useAuth();

  const location =
    useLocation();

  if (loading) {
    return (
      <div>
        <p>
          Checking your session...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;