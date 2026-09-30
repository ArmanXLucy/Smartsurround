import React from "react";
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, X, Sparkles, ShieldCheck, MapPin, Camera, Activity, CloudRain, Flame, Mic, Wind, BrainCircuit, User, Lock, Mail, LogOut, Eye, EyeOff, Thermometer, Droplets, Gauge, Satellite, Video, Table, Bell, Download, Play, Pause, Trash2, RotateCcw, Compass, Navigation, Save, Radio, FileText, Maximize2, Minimize2, AlertTriangle, Settings, HelpCircle, Upload, Paperclip, MessageSquare, Moon, Sun, Monitor, CheckCircle2, Clock3, Send, UserRound, motion, useAnimation, useInView, AnimatePresence, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, fetchSignInMethodsForEmail, onAuthStateChanged, signOut, updateProfile, reload, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateEmail, onValue, ref, getStorage, storageRef, uploadBytes, getDownloadURL, firebaseApp, db, firebaseAuth, firebaseStorage, BACKEND_URL, BACKEND_DISPLAY_URL, EMPTY_READING, EMPTY_GPS, NAV_ITEMS, DEFAULT_ALERT_SETTINGS, pm25Status, statusClass, getIaqColor, clamp, fmt, yVal, buildPath, buildAlerts, hasSensorReadings, accountStorageKey, readAccountSettings, readLocalAvatar, saveLocalAvatar, formatAdminTime
} from "../lib/smartSurroundShared.jsx";

import StatTile from "../components/StatTile.jsx";

export default function OverviewPage({ latest, alerts, connectionStatus }) {

  const hasIaq = latest.iaq !== null && latest.iaq !== undefined;
  const iaq = hasIaq ? Number(latest.iaq) : 0;
  const gaugeDeg = hasIaq ? (clamp(iaq, 0, 500) / 500) * 360 : 0;
  const gaugeColor = hasIaq ? getIaqColor(iaq) : "#c9beb7";
  const pms = latest.pm25 !== null && latest.pm25 !== undefined ? pm25Status(Number(latest.pm25)) : null;
  const currentAlerts = alerts.filter((alert) => ["warning", "danger"].includes(String(alert.level).toLowerCase()));
  const highestAlertLevel = currentAlerts.some((alert) => String(alert.level).toLowerCase() === "danger")
    ? "Danger"
    : currentAlerts.length ? "Warning" : "Normal";

  const statusText =
    connectionStatus === "connected"
      ? "Connected"
      : connectionStatus === "connecting"
        ? "Connecting..."
        : connectionStatus === "error"
          ? "ESP32 unreachable"
          : "Not connected";

  return (
    <div className="page-block">

      <div className="page-heading">
        <div>
          <div className="small-label">SMART ENVIRONMENT</div>
          <h1>Overview</h1>
          <p>Live readings from your connected sensors.</p>
        </div>

        <div className="dashboard-live">
          <span></span>
          {connectionStatus === "connected" ? "LIVE SYSTEM" : "AWAITING DEVICE"}
        </div>
      </div>

      <div className="gauge-row">

        <div className="gauge-card">

          <div
            className="iaq-gauge"
            style={{
              background: `conic-gradient(${gaugeColor} 0deg ${gaugeDeg}deg, rgba(33,20,15,0.08) ${gaugeDeg}deg 360deg)`,
            }}
          >
            <div className="iaq-gauge-inner">
              <div className="iaq-number">{hasIaq ? iaq.toFixed(0) : "--"}</div>
              <span>IAQ</span>
            </div>
          </div>

          <div className="gauge-text">
            <h3>{latest.status || pms || "Air quality"}{hasIaq ? "" : " — no data"}</h3>
            <p>
              {connectionStatus === "connected"
                ? "Live IAQ reading from your connected sensors."
                : "Connect your ESP32 below to see live readings here."}
            </p>

            <div
              className="iaq-badge"
              style={{
                color: gaugeColor,
                borderColor: gaugeColor + "55",
                background: gaugeColor + "14",
              }}
            >
              ● {statusText}
            </div>
          </div>

        </div>

        <div className="tile-grid">

          <StatTile label="PM1.0" value={fmt(latest.pm1, 0)} unit="µg/m³" icon={<Wind size={16} />} />

          <StatTile
            label="PM2.5"
            value={fmt(latest.pm25, 0)}
            unit="µg/m³"
            icon={<Wind size={16} />}
            badge={pms}
            badgeClass={pms ? statusClass(pms) : undefined}
          />

          <StatTile label="PM10" value={fmt(latest.pm10, 0)} unit="µg/m³" icon={<Wind size={16} />} />

          <StatTile
            label="Temperature"
            value={fmt(latest.temperature, 1)}
            unit="°C"
            icon={<Thermometer size={16} />}
          />

          <StatTile
            label="Humidity"
            value={fmt(latest.humidity, 0)}
            unit="%"
            icon={<Droplets size={16} />}
          />

          <StatTile
            label="CO2"
            value={fmt(latest.co2, 0)}
            unit="ppm"
            icon={<Gauge size={16} />}
          />

        </div>

      </div>

      <div className="device-status-row">

        <div>
          <span>Device</span>
          <strong>{connectionStatus === "connected" ? "Online" : "Offline"}</strong>
        </div>

        <div>
          <span>Calibration</span>
          <strong>{latest.iaqAccuracyText || "--"}</strong>
        </div>

        <div>
          <span>Last update</span>
          <strong>
            {connectionStatus === "connected"
              ? new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
              : "--"}
          </strong>
        </div>

      </div>

      <section className="overview-alerts" aria-labelledby="overview-alerts-title">
        <div className="overview-alerts-heading">
          <div><div className="small-label">SENSOR STATUS</div><h2 id="overview-alerts-title">Current Alerts</h2></div>
          <div className="overview-alerts-status">
            <Bell size={16} />
            <span className={`overview-alert-priority level-${highestAlertLevel.toLowerCase()}`}>
              {hasSensorReadings(latest) ? highestAlertLevel : "Waiting for data"}
            </span>
          </div>
        </div>
        {currentAlerts.length ? (
          <div className="overview-alert-list">
            {currentAlerts.map((alert, index) => (
              <article className={`overview-alert-item level-${String(alert.level).toLowerCase()}`} key={`${alert.title}-${index}`}>
                <span className="overview-alert-symbol">{alert.icon}</span>
                <div><strong>{alert.title}</strong><p>{alert.message}</p></div>
                <span className="overview-alert-severity">{alert.level}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="overview-alert-healthy">
            <ShieldCheck size={19} />
            <span>{hasSensorReadings(latest)
              ? (alerts.find((alert) => String(alert.level).toLowerCase() === "good")?.message || "Available readings are within configured limits.")
              : "Waiting for sensor readings to confirm alert status."}</span>
          </div>
        )}
      </section>

      {/* <div className="event-row">

        {alerts.length === 0 ? (
          <EventItem
            icon={<span>📡</span>}
            title="Waiting for ESP32"
            text="Connect your board to start seeing live alerts."
          />
        ) : (
          alerts.slice(0, 3).map((a, i) => (
            <EventItem key={i} icon={<span>{a.icon}</span>} title={a.title} text={a.message} />
          ))
        )}

      </div> */}

    </div>
  );
}
