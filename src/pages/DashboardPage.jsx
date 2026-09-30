import React from "react";
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, X, Sparkles, ShieldCheck, MapPin, Camera, Activity, CloudRain, Flame, Mic, Wind, BrainCircuit, User, Lock, Mail, LogOut, Eye, EyeOff, Thermometer, Droplets, Gauge, Satellite, Video, Table, Bell, Download, Play, Pause, Trash2, RotateCcw, Compass, Navigation, Save, Radio, FileText, Maximize2, Minimize2, AlertTriangle, Settings, HelpCircle, Upload, Paperclip, MessageSquare, Moon, Sun, Monitor, CheckCircle2, Clock3, Send, UserRound, motion, useAnimation, useInView, AnimatePresence, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, fetchSignInMethodsForEmail, onAuthStateChanged, signOut, updateProfile, reload, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateEmail, onValue, ref, getStorage, storageRef, uploadBytes, getDownloadURL, firebaseApp, db, firebaseAuth, firebaseStorage, BACKEND_URL, BACKEND_DISPLAY_URL, EMPTY_READING, EMPTY_GPS, NAV_ITEMS, DEFAULT_ALERT_SETTINGS, pm25Status, statusClass, getIaqColor, clamp, fmt, yVal, buildPath, buildAlerts, accountStorageKey, readAccountSettings, readLocalAvatar, saveLocalAvatar, formatAdminTime
} from "../lib/smartSurroundShared.jsx";

import { useLocation, useNavigate } from "../router.jsx";
import { ProfileAvatar, AccountMenu, LogoutConfirmDialog, AccountPanel } from "../components/AccountComponents.jsx";
import StatTile from "../components/StatTile.jsx";
import OverviewPage from "./OverviewPage.jsx";
import AirQualityPage from "./AirQualityPage.jsx";
import EnvironmentPage from "./EnvironmentPage.jsx";
import CameraPage from "./CameraPage.jsx";
import LocationPage from "./LocationPage.jsx";
import DataLogPage from "./DataLogPage.jsx";
import AlertsPage from "./AlertsPage.jsx";

export default function LiveReadingPage({ currentUser, onLogout, onBackToSite, onUserUpdated }) {

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dashboardPageByPath = {
    "/dashboard": "overview",
    "/dashboard/overview": "overview",
    "/dashboard/air-quality": "airquality",
    "/dashboard/environment": "environment",
    "/dashboard/camera": "camera",
    "/dashboard/location": "location",
    "/dashboard/alerts": "alerts",
    "/profile": "account-profile",
    "/help": "account-help",
    "/settings": "account-settings",
  };
  const activePage = dashboardPageByPath[pathname] || "overview";

  React.useEffect(() => {
    if (pathname === "/dashboard/data-log") navigate("/help", { replace: true });
    if (pathname === "/dashboard/safety") navigate("/dashboard/overview", { replace: true });
  }, [navigate, pathname]);

  const dashboardPathFor = (page) => {
    if (page === "overview") return "/dashboard/overview";
    if (page === "airquality") return "/dashboard/air-quality";
    if (page === "environment") return "/dashboard/environment";
    if (page === "camera") return "/dashboard/camera";
    if (page === "location") return "/dashboard/location";
    if (page === "alerts") return "/dashboard/alerts";
    if (page === "account-profile") return "/profile";
    if (page === "account-help") return "/help";
    if (page === "account-settings") return "/settings";
    return "/dashboard/overview";
  };

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);
  const [accountPanelSection, setAccountPanelSection] = React.useState("profile");
  const [accountPanelOpen, setAccountPanelOpen] = React.useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [appearance, setAppearance] = React.useState(() => readAccountSettings(currentUser?.id).appearance);
  const [systemDark, setSystemDark] = React.useState(() => (
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  ));
  const accountAreaRef = React.useRef(null);

  React.useEffect(() => {
    setAppearance(readAccountSettings(currentUser?.id).appearance);
  }, [currentUser?.id]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (event) => setSystemDark(event.matches);
    setSystemDark(mediaQuery.matches);
    mediaQuery.addEventListener?.("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener?.("change", handleSystemThemeChange);
  }, []);

  React.useEffect(() => {
    const handleOutside = (event) => {
      if (accountAreaRef.current && !accountAreaRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const isDarkTheme = appearance === "dark" || (appearance === "system" && systemDark);
  const isAccountPage = activePage.startsWith("account-");
  const accountSectionFromRoute = isAccountPage ? activePage.replace("account-", "") : accountPanelSection;

  const openAccountSection = (section) => {
    setAccountMenuOpen(false);
    setAccountPanelSection(section);
    setAccountPanelOpen(true);
    navigate(dashboardPathFor(`account-${section}`));
    setMenuOpen(false);
  };

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
      setLogoutConfirmOpen(false);
    }
  };

  // ESP32 connection: enter the board's local IP (e.g. 192.168.1.42) to pull
  // real sensor data instead of the simulated demo values.
  const [esp32Ip, setEsp32Ip] = React.useState(
    () => (typeof window !== "undefined" && window.localStorage.getItem("esp32Ip")) || ""
  );
  const [esp32Input, setEsp32Input] = React.useState(esp32Ip);
  const [connectionStatus, setConnectionStatus] = React.useState(
    esp32Ip ? "connecting" : "disconnected"
  ); // "disconnected" | "connecting" | "connected" | "error"
  const lastFirebaseUpdate = React.useRef(0);
  const [latest, setLatest] = React.useState(EMPTY_READING);
  const [gps, setGps] = React.useState(EMPTY_GPS);
  const [cameraOnline, setCameraOnline] = React.useState(false);
  const [camIp, setCamIp] = React.useState(null);
  const [pmHistory, setPmHistory] = React.useState([]);

  const [logRows, setLogRows] = React.useState([]);
  const [loggerRunning, setLoggerRunning] = React.useState(false);
  const [loggerInterval, setLoggerInterval] = React.useState(5000);
  const [exportName, setExportName] = React.useState("air_quality_log");

  const [alertSettings, setAlertSettings] = React.useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("smartsurround_alert_settings"));
      return saved ? { ...DEFAULT_ALERT_SETTINGS, ...saved } : DEFAULT_ALERT_SETTINGS;
    } catch (e) {
      return DEFAULT_ALERT_SETTINGS;
    }
  });

  const latestRef = React.useRef(latest);
  React.useEffect(() => {
    latestRef.current = latest;
  }, [latest]);

  // Share the real device GPS with the admin control center. This uses the
  // existing Firebase Auth identity and never asks the user to type a location.
  React.useEffect(() => {
    if (!currentUser?.id || typeof navigator === "undefined" || !navigator.geolocation) return;

    let stopped = false;

    const api = (path) => `${BACKEND_URL}${path}`;

    const getUserToken = async () => {
      const authUser = firebaseAuth.currentUser;
      if (!authUser) return null;
      try {
        return await authUser.getIdToken();
      } catch (err) {
        console.error("Unable to obtain Firebase ID token for location sync:", err);
        return null;
      }
    };

    const syncUser = async () => {
      const token = await getUserToken();
      if (!token || stopped) return;
      try {
        await fetch(api("/api/user/sync"), {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: currentUser.name || "",
            email: currentUser.email || "",
            status: "Working",
          }),
          cache: "no-store",
        });
      } catch (err) {
        console.debug("User sync unavailable:", err);
      }
    };

    const sendLocation = async (position) => {
      if (stopped) return;
      const token = await getUserToken();
      if (!token || stopped) return;
      try {
        const response = await fetch(api("/api/user/location"), {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp || Date.now()).toISOString(),
            status: "working",
          }),
          cache: "no-store",
        });
        if (!response.ok) {
          console.debug("GPS sync rejected:", response.status);
        }
      } catch (err) {
        console.debug("GPS sync unavailable:", err);
      }
    };

    syncUser();

    const watchId = navigator.geolocation.watchPosition(
      sendLocation,
      (error) => {
        if (error?.code === 1) {
          console.info("Location permission denied; SmartSurround will not track browser GPS.");
        } else {
          console.debug("Location update unavailable:", error?.message);
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );

    const heartbeat = window.setInterval(() => {
      syncUser();
    }, 60000);

    return () => {
      stopped = true;
      navigator.geolocation.clearWatch(watchId);
      window.clearInterval(heartbeat);
    };
  }, [currentUser?.id, currentUser?.name, currentUser?.email]);

  // Persist real sensor readings for the admin reports workspace. No reading
  // is written until the Firebase dashboard has actually received a value.
  React.useEffect(() => {
    if (!currentUser?.id || typeof window === "undefined") return;
    const interval = window.setInterval(async () => {
      const reading = latestRef.current;
      if (!reading || Object.values(reading).every((v) => v === null || v === undefined || v === false || v === "")) return;
      const authUser = firebaseAuth.currentUser;
      if (!authUser) return;
      try {
        const token = await authUser.getIdToken();
        await fetch(`${BACKEND_URL}/api/user/environment`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...reading,
            device_id: reading.ip || "firebase-sensors",
            timestamp: new Date().toISOString(),
          }),
          cache: "no-store",
        });
      } catch (err) {
        console.debug("Environment sync unavailable:", err);
      }
    }, 15000);
    return () => window.clearInterval(interval);
  }, [currentUser?.id]);

  function handleConnect(e) {
    e.preventDefault();

    const trimmed = esp32Input.trim();

    setEsp32Ip(trimmed);

    if (typeof window !== "undefined") {
      if (trimmed) {
        window.localStorage.setItem("esp32Ip", trimmed);
      } else {
        window.localStorage.removeItem("esp32Ip");
      }
    }
  }

  function handleDisconnect() {
    setEsp32Ip("");
    setEsp32Input("");

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("esp32Ip");
    }
  }

  // =========================================================
  // FIREBASE REALTIME SENSOR DATA
  // ESP32 → Firebase Realtime Database → React dashboard
  //
  // Supports either of these Firebase layouts:
  //   /sensors/{...}
  //   /{temperature, humidity, pm25, ...}
  // GPS may be stored as /gps or /sensors/gps.
  // =========================================================
  React.useEffect(() => {
    const databaseRef = ref(db);

    const unsubscribe = onValue(
      databaseRef,
      (snapshot) => {
        const root = snapshot.val();

        lastFirebaseUpdate.current = Date.now();

        if (!root || typeof root !== "object") {
          setLatest(EMPTY_READING);
          setGps(EMPTY_GPS);
          setCameraOnline(false);
          setCamIp(null);
          setConnectionStatus("disconnected");
          return;
        }

        // If your ESP32 stores readings under /sensors, use that.
        // Otherwise use the database root directly.
        const source =
          root.sensors && typeof root.sensors === "object"
            ? root.sensors
            : root;

        const toNumberOrNull = (value) => {
          if (value === null || value === undefined || value === "") return null;
          const number = Number(value);
          return Number.isFinite(number) ? number : null;
        };

        const nextReading = {
          ...EMPTY_READING,

          pm1: toNumberOrNull(source.pm1),
          pm25: toNumberOrNull(source.pm25),
          pm10: toNumberOrNull(source.pm10),

          temperature: toNumberOrNull(source.temperature),
          humidity: toNumberOrNull(source.humidity),

          iaq: toNumberOrNull(source.iaq ?? source.iaqScore),
          co2: toNumberOrNull(source.co2 ?? source.co2Equivalent),
          voc: toNumberOrNull(source.voc ?? source.vocEquivalent),

          calibrating:
            source.calibrating !== undefined
              ? Boolean(source.calibrating)
              : false,

          iaqAccuracyText:
            source.iaqAccuracyText ?? source.iaqAccuracy ?? null,

          ip: source.ip ?? root.ip ?? null,
          uptime: toNumberOrNull(source.uptime),
          status: source.status ?? null,
        };

        setLatest(nextReading);

        // ---------------------------------------------------
        // GPS
        // ---------------------------------------------------
        const gpsSource =
          (source.gps && typeof source.gps === "object" && source.gps) ||
          (root.gps && typeof root.gps === "object" && root.gps) ||
          null;

        if (gpsSource) {
          setGps({
            lat: toNumberOrNull(
              gpsSource.latitude ?? gpsSource.lat
            ),
            lng: toNumberOrNull(
              gpsSource.longitude ?? gpsSource.lng ?? gpsSource.lon
            ),
            alt: toNumberOrNull(
              gpsSource.altitude ?? gpsSource.alt
            ),
            speed: toNumberOrNull(gpsSource.speed),
            course: toNumberOrNull(gpsSource.course),
            sats: toNumberOrNull(
              gpsSource.satellites ?? gpsSource.sats
            ),
            hdop: toNumberOrNull(gpsSource.hdop),
            fix: gpsSource.fix ?? null,
            time: gpsSource.time ?? null,
          });
        } else {
          // Also support flat GPS fields.
          const hasFlatGps =
            source.latitude !== undefined ||
            source.longitude !== undefined ||
            source.gpsValid !== undefined;

          if (hasFlatGps) {
            setGps({
              lat: toNumberOrNull(source.latitude),
              lng: toNumberOrNull(source.longitude),
              alt: toNumberOrNull(source.altitude),
              speed: toNumberOrNull(source.speed),
              course: toNumberOrNull(source.course),
              sats: toNumberOrNull(source.satellites),
              hdop: toNumberOrNull(source.hdop),
              fix:
                source.gpsValid === true
                  ? "Valid"
                  : source.gpsValid === false
                    ? "No Fix"
                    : null,
              time: source.gpsTime ?? null,
            });
          } else {
            setGps(EMPTY_GPS);
          }
        }

        // ---------------------------------------------------
        // Camera status
        // ---------------------------------------------------
        const cameraSource =
          source.camera && typeof source.camera === "object"
            ? source.camera
            : root.camera && typeof root.camera === "object"
              ? root.camera
              : null;

        const firebaseCamIp =
          source.camIp ??
          source.cameraIp ??
          cameraSource?.ip ??
          cameraSource?.camIp ??
          root.camIp ??
          null;

        const firebaseCameraOnline =
          source.cameraOnline ??
          cameraSource?.online ??
          root.cameraOnline;

        if (firebaseCamIp) setCamIp(String(firebaseCamIp));
        if (firebaseCameraOnline !== undefined) {
          setCameraOnline(Boolean(firebaseCameraOnline));
        }

        setConnectionStatus("connected");
      },
      (error) => {
        console.error("Firebase Realtime Database error:", error);
        setConnectionStatus("error");
      }
    );

    return () => unsubscribe();
  }, []);
  // =========================================================
  // ESP32 CONNECTION TIMEOUT
  // If Firebase stops receiving ESP32 updates for 15 seconds,
  // consider the ESP32 disconnected and clear old readings.
  // =========================================================
  React.useEffect(() => {
    const checkConnection = setInterval(() => {
      const lastUpdate = lastFirebaseUpdate.current;

      // No Firebase data has arrived yet
      if (lastUpdate === 0) {
        return;
      }

      const timeSinceLastUpdate = Date.now() - lastUpdate;

      // ESP32 normally updates every few seconds.
      // 15 seconds without an update = disconnected.
      if (timeSinceLastUpdate > 15000) {
        setConnectionStatus("disconnected");

        // Clear stale sensor values
        setLatest(EMPTY_READING);
        setGps(EMPTY_GPS);

        // Clear camera status
        setCameraOnline(false);
        setCamIp(null);
      }
    }, 3000);

    return () => clearInterval(checkConnection);
  }, []);
  // Roll a PM history buffer for the Air Quality chart — only once real
  // readings start arriving.
  React.useEffect(() => {
    if (latest.pm1 === null && latest.pm25 === null && latest.pm10 === null) return;

    setPmHistory((prev) => {
      const next = [
        ...prev,
        {
          label: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          pm1: Number(latest.pm1) || 0,
          pm25: Number(latest.pm25) || 0,
          pm10: Number(latest.pm10) || 0,
        },
      ];

      return next.slice(-30);
    });
  }, [latest]);

  // Data logger — only logs real readings, and only while connected.
  React.useEffect(() => {

    if (!loggerRunning || connectionStatus !== "connected") return;

    const interval = setInterval(() => {
      setLogRows((prev) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          ...latest,
        },
        ...prev,
      ]);
    }, loggerInterval);

    return () => clearInterval(interval);

  }, [loggerRunning, loggerInterval, latest, connectionStatus]);

  const alerts = React.useMemo(() => buildAlerts(latest, alertSettings), [latest, alertSettings]);

  function exportLogExcel() {

    let html =
      "<html><head><meta charset='UTF-8'></head><body><table border='1'><tr><th colspan='9'>SmartSurround Air Quality Log</th></tr>";

    html +=
      "<tr><th>Time</th><th>PM1</th><th>PM2.5</th><th>PM10</th><th>Temp</th><th>Humidity</th><th>IAQ</th><th>CO2</th><th>VOC</th></tr>";

    logRows.forEach((r) => {
      html += `<tr><td>${r.time}</td><td>${r.pm1}</td><td>${r.pm25}</td><td>${r.pm10}</td><td>${Number(r.temperature).toFixed(1)}</td><td>${Number(r.humidity).toFixed(1)}</td><td>${Number(r.iaq).toFixed(0)}</td><td>${Number(r.co2).toFixed(0)}</td><td>${Number(r.voc).toFixed(2)}</td></tr>`;
    });

    html += "</table></body></html>";

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const name = (exportName || "air_quality_log").replace(/[^a-z0-9_-]/gi, "_");

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name + ".xls";
    a.click();
  }

  const statusLabel =
    connectionStatus === "connected"
      ? "ESP32 LIVE"
      : connectionStatus === "connecting"
        ? "CONNECTING..."
        : connectionStatus === "error"
          ? "ESP32 UNREACHABLE"
          : "NOT CONNECTED";

  return (
    <div className={`live-shell${isDarkTheme ? " theme-dark" : ""}`}>

      <aside className={"live-sidebar" + (menuOpen ? " open" : "")}>

        {menuOpen && (
          <button
            type="button"
            className="live-sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        )}

        <div className="side-logo">
          <div className="mini-logo">
            <Activity size={14} />
          </div>
          <span>SmartSurround</span>
        </div>

        <div className="sidebar-title">MONITORING</div>

        {NAV_ITEMS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={"side-link" + (activePage === item.id ? " active" : "")}
            onClick={() => {
              setAccountPanelOpen(false);
              navigate(dashboardPathFor(item.id));
              setMenuOpen(false);
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        {/* <div className="sidebar-title second-title">SYSTEM</div> */}

        <div className="sidebar-footer-card">
          <div className="sidebar-footer-icon">
            <Sparkles size={16} />
          </div>
          <div>
            <span>AI Intelligence</span>
            <strong>Enabled</strong>
          </div>
        </div>

      </aside>

      <div className="live-main-area">

        <div className="live-topbar">

          <button
            type="button"
            className="live-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={18} />
          </button>

          <div className="dashboard-url">
            smartsurround / {activePage}
          </div>

          <div className="live-topbar-right">

            <div className={`dashboard-status live-status-${connectionStatus}`}>
              <span></span>
              {statusLabel}
            </div>

            <div className="live-account-wrap" ref={accountAreaRef}>
              <button
                type="button"
                className="live-user profile-trigger"
                onClick={() => setAccountMenuOpen((open) => !open)}
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
              >
                <ProfileAvatar user={currentUser} size={30} className="live-profile-avatar" />
                <span>{currentUser?.name || "Account"}</span>
                <ChevronDown size={14} className={accountMenuOpen ? "account-trigger-chevron open" : "account-trigger-chevron"} />
              </button>

              <AnimatePresence>
                {accountMenuOpen && (
                  <AccountMenu
                    onSelect={openAccountSection}
                    onLogout={() => { setAccountMenuOpen(false); setLogoutConfirmOpen(true); }}
                  />
                )}
              </AnimatePresence>
            </div>

            <button type="button" className="secondary-button" onClick={onBackToSite}>
              Back to Site
            </button>

            <button
              type="button"
              className="nav-logout-button"
              onClick={() => setLogoutConfirmOpen(true)}
              aria-label="Log out"
            >
              <LogOut size={15} />
            </button>

          </div>

        </div>

        <div className={`live-page-content${isAccountPage ? " live-page-content-account" : ""}`}>

          {isAccountPage && (
            <AccountPanel
              currentUser={currentUser}
              section={accountSectionFromRoute}
              embedded
              onAppearanceChange={(nextAppearance) => {
                setAppearance(nextAppearance);
                try {
                  const existing = readAccountSettings(currentUser?.id);
                  window.localStorage.setItem(accountStorageKey("smartsurround_account_settings", currentUser?.id), JSON.stringify({ ...existing, appearance: nextAppearance }));
                } catch {}
              }}
              onUserUpdated={onUserUpdated}
              onLogout={() => setLogoutConfirmOpen(true)}
              onClose={() => {
                setAccountPanelOpen(false);
                navigate(dashboardPathFor("overview"));
              }}
            />
          )}

          {!isAccountPage && activePage === "overview" && (
            <OverviewPage latest={latest} alerts={alerts} connectionStatus={connectionStatus} />
          )}

          {!isAccountPage && activePage === "airquality" && (
            <AirQualityPage latest={latest} pmHistory={pmHistory} />
          )}

          {!isAccountPage && activePage === "environment" && <EnvironmentPage latest={latest} />}

          {!isAccountPage && activePage === "camera" && <CameraPage gps={gps} />}

          {!isAccountPage && activePage === "location" && <LocationPage gps={gps} />}

          {!isAccountPage && activePage === "datalog" && (
            <DataLogPage
              logRows={logRows}
              loggerRunning={loggerRunning}
              loggerInterval={loggerInterval}
              setLoggerInterval={setLoggerInterval}
              exportName={exportName}
              setExportName={setExportName}
              isConnected={connectionStatus === "connected"}
              onStart={() => setLoggerRunning(true)}
              onStop={() => setLoggerRunning(false)}
              onClear={() => setLogRows([])}
              onExport={exportLogExcel}
              onAddNow={() =>
                setLogRows((prev) => [
                  {
                    id: Date.now(),
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }),
                    ...latest,
                  },
                  ...prev,
                ])
              }
            />
          )}

          {!isAccountPage && activePage === "alerts" && (
            <AlertsPage
              alerts={alerts}
            />
          )}

        </div>

      </div>

      <AnimatePresence>
        {logoutConfirmOpen && (
          <LogoutConfirmDialog
            loading={loggingOut}
            onCancel={() => setLogoutConfirmOpen(false)}
            onConfirm={confirmLogout}
          />
        )}
      </AnimatePresence>

    </div>
  );
}


/* =========================================================
   LIVE DASHBOARD — PAGE COMPONENTS
========================================================= */
