import React from "react";
import {
  BACKEND_URL,
  firebaseAuth,
  onAuthStateChanged,
  reload,
  signOut,
} from "./lib/smartSurroundShared.jsx";
import { Router, useLocation, useNavigate } from "./router.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AIChat from "./components/AIChat/AIChat.jsx";

import "./index.css";

const DASHBOARD_ROUTES = new Set([
  "/dashboard",
  "/dashboard/overview",
  "/dashboard/air-quality",
  "/dashboard/environment",
  "/dashboard/camera",
  "/dashboard/location",
  "/dashboard/data-log",
  "/dashboard/alerts",
  "/dashboard/safety",
  "/profile",
  "/help",
  "/settings",
]);

const ADMIN_ROUTES = new Set([
  "/admin",
  "/admin/overview",
  "/admin/operations",
  "/admin/users",
  "/admin/monitoring",
  "/admin/problems",
  "/admin/reports",
  "/admin/communications",
  "/admin/system",
]);

function AppRouter() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = React.useState(null);
  const [authInitialized, setAuthInitialized] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!mounted) return;

      try {
        if (!user) {
          setCurrentUser(null);
          return;
        }

        try {
          await reload(user);
        } catch (err) {
          console.error("Firebase session refresh failed:", err);
        }

        if (!mounted) return;

        if (user.emailVerified) {
          setCurrentUser({
            id: user.uid,
            name: user.displayName || user.email?.split("@")[0] || "User",
            email: user.email || "",
            photoURL: user.photoURL || readLocalAvatarFallback(user.uid),
          });
        } else {
          setCurrentUser(null);
        }
      } finally {
        if (mounted) setAuthInitialized(true);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (!authInitialized) return;

    const adminToken = (() => {
      try {
        return sessionStorage.getItem("ss_admin_token") || "";
      } catch (_) {
        return "";
      }
    })();

    if (pathname === "/" && adminToken) {
      navigate("/admin", { replace: true });
      return;
    }

    if (DASHBOARD_ROUTES.has(pathname) && !currentUser) {
      navigate("/login", { replace: true });
    }
  }, [authInitialized, currentUser, navigate, pathname]);

  const handleExploreSmartSurround = async () => {
    if (!authInitialized) {
      await new Promise((resolve) => {
        let unsubscribeOnce = () => {};
        unsubscribeOnce = onAuthStateChanged(firebaseAuth, () => {
          unsubscribeOnce();
          resolve();
        });
      });
    }

    const authUser = firebaseAuth.currentUser;

    if (!authUser) {
      setCurrentUser(null);
      navigate("/login");
      return;
    }

    try {
      await reload(authUser);
    } catch (err) {
      console.error("Firebase session check failed:", err);
    }

    if (!authUser.emailVerified) {
      await signOut(firebaseAuth);
      setCurrentUser(null);
      navigate("/login");
      return;
    }

    setCurrentUser({
      id: authUser.uid,
      name: authUser.displayName || authUser.email?.split("@")[0] || "User",
      email: authUser.email || "",
      photoURL: authUser.photoURL || readLocalAvatarFallback(authUser.uid),
    });
    navigate("/dashboard/overview");
  };

  const handleAuthSuccess = (user) => {
    const authUser = firebaseAuth.currentUser;
    setCurrentUser({
      ...user,
      photoURL: authUser?.photoURL || user?.photoURL || readLocalAvatarFallback(user?.id),
    });
    navigate("/dashboard/overview");
  };

  const handleAdminSuccess = () => {
    navigate("/admin");
  };

  const handleAdminLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/admin/logout`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: (() => {
          try {
            const token = sessionStorage.getItem("ss_admin_token");
            return token ? { "X-Auth-Token": token } : {};
          } catch (_) {
            return {};
          }
        })(),
      });
    } catch (err) {
      console.error("Admin logout failed:", err);
    } finally {
      try { window.localStorage.removeItem("ss_admin_pin"); } catch (_) {}
      try { window.sessionStorage.removeItem("ss_admin_token"); } catch (_) {}
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
    } catch (err) {
      console.error("Firebase logout failed:", err);
    }

    setCurrentUser(null);
    try { localStorage.removeItem("ss_admin_pin"); } catch (_) {}
    navigate("/");
  };

  if (DASHBOARD_ROUTES.has(pathname)) {
    if (!authInitialized) return null;
    if (!currentUser) return null;

    return (
      <div className="app">
        <DashboardPage
          currentUser={currentUser}
          onLogout={handleLogout}
          onUserUpdated={setCurrentUser}
          onBackToSite={() => navigate("/")}
        />
      </div>
    );
  }

  if (ADMIN_ROUTES.has(pathname)) {
    return (
      <div className="app admin-shell">
        <AdminPage
          onBackToSite={() => navigate("/")}
          onBackToLogin={() => navigate("/admin-login")}
          onLogout={handleAdminLogout}
        />
      </div>
    );
  }

  if (pathname === "/login" || pathname === "/register" || pathname === "/admin-login") {
    return (
      <div className="app">
        <AuthPage
          initialMode={
            pathname === "/register"
              ? "signup"
              : pathname === "/admin-login"
                ? "admin"
                : "login"
          }
          onAuthSuccess={handleAuthSuccess}
          onAdminSuccess={handleAdminSuccess}
          onBack={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <LandingPage
      isLoggedIn={!!currentUser}
      currentUser={currentUser}
      onLoginClick={() => navigate("/login")}
      onLogoutClick={handleLogout}
      onDashboardClick={() => navigate("/dashboard/overview")}
      onExplore={handleExploreSmartSurround}
    />
  );
}

// Kept local so App.jsx has no dependency on a page module for account storage helpers.
function readLocalAvatarFallback(uid) {
  try {
    return window.localStorage.getItem(`smartsurround_avatar_${uid || "guest"}`) || "";
  } catch {
    return "";
  }
}

export default function App() {
  return (
    <Router>
      <AppRouter />
      <AIChat />
    </Router>
  );
}
