import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";

import Welcome from "./pages/Welcome/Welcome";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Onboarding from "./pages/Onboarding/Onboarding";
import Location from "./pages/Location/Location";
import Home from "./pages/Home/Home";
import Explore from "./pages/Explore/Explore";
import SavedLocations from "./pages/SavedLocations/SavedLocations";
import Alerts from "./pages/Alerts/Alerts";
import Profile from "./pages/Profile/Profile";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Welcome />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            element={<ProtectedRoute />}
          >
            <Route
              path="/onboarding"
              element={<Onboarding />}
            />

            <Route
              path="/location"
              element={<Location />}
            />

            <Route
              path="/home"
              element={<Home />}
            />

            <Route
              path="/explore"
              element={<Explore />}
            />

            <Route
              path="/saved-locations"
              element={<SavedLocations />}
            />

            <Route
              path="/alerts"
              element={<Alerts />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;