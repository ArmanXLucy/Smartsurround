/* Shared SmartSurround dependencies and helpers.
   This file contains only dependencies/constants/helpers moved out of App.jsx.
   Runtime behavior is intentionally unchanged. */

import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, X, Sparkles, ShieldCheck, MapPin, Camera, Activity, CloudRain, Flame, Mic, Wind, BrainCircuit, User, Lock, Mail, LogOut, Eye, EyeOff, Thermometer, Droplets, Gauge, Satellite, Video, Table, Bell, Download, Play, Pause, Trash2, RotateCcw, Compass, Navigation, Save, Radio, FileText, Maximize2, Minimize2, AlertTriangle, Settings, HelpCircle, Upload, Paperclip, MessageSquare, Moon, Sun, Monitor, CheckCircle2, Clock3, Send, UserRound,
} from "lucide-react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signOut,
  updateProfile,
  reload,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateEmail,
} from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseApp, db } from "../firebaseClient";

export const firebaseAuth = getAuth(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

function pm25Status(v) {
  if (v <= 12) return "Good";
  if (v <= 35) return "Moderate";
  if (v <= 55) return "Poor";
  return "Unhealthy";
}


function statusClass(status) {
  if (status === "Good") return "good";
  if (status === "Unhealthy" || status === "Poor" || status === "Danger") return "danger";
  return "moderate";
}


function getIaqColor(iaq) {
  if (iaq <= 50) return "#16a34a";
  if (iaq <= 100) return "#84cc16";
  if (iaq <= 150) return "#eab308";
  if (iaq <= 200) return "#f97316";
  if (iaq <= 300) return "#ef4444";
  return "#991b1b";
}


function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// No simulated/demo data — every value the dashboard shows comes only
// from the connected ESP32. Until it responds, fields stay null and
// render as "--".


const EMPTY_READING = {
  pm1: null,
  pm25: null,
  pm10: null,
  temperature: null,
  humidity: null,
  iaq: null,
  co2: null,
  voc: null,
  calibrating: false,
  iaqAccuracyText: null,
  ip: null,
  uptime: null,
  status: null,
};

const EMPTY_GPS = {
  lat: null,
  lng: null,
  alt: null,
  speed: null,
  course: null,
  sats: null,
  hdop: null,
  fix: null,
  time: null,
};


function fmt(v, decimals) {
  if (v === null || v === undefined || Number.isNaN(Number(v))) return "--";
  return decimals === undefined ? String(v) : Number(v).toFixed(decimals);
}


function yVal(v, max) {
  return 194 - (v / max) * (194 - 14);
}


function buildPath(points) {
  if (!points.length) return "";

  let d = `M${points[0].x},${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const p = points[i - 1];
    const c = points[i];
    const m = (p.x + c.x) / 2;
    d += ` C${m},${p.y} ${m},${c.y} ${c.x},${c.y}`;
  }

  return d;
}


const ALERT_SENSOR_KEYS = ["pm1", "pm25", "pm10", "iaq", "co2", "voc", "humidity", "temperature"];

function hasSensorReadings(reading) {
  if (!reading || typeof reading !== "object") return false;
  return ALERT_SENSOR_KEYS.some((key) => reading[key] !== null && reading[key] !== undefined && reading[key] !== "" && Number.isFinite(Number(reading[key])));
}

function getThresholdFor(thresholds, sensorName) {
  if (!thresholds) return null;
  if (Array.isArray(thresholds)) {
    return thresholds.find((t) => String(t.sensor).toLowerCase() === sensorName.toLowerCase()) || null;
  }
  if (typeof thresholds === "object") {
    return thresholds[sensorName] || thresholds[sensorName.toLowerCase()] || null;
  }
  return null;
}

function parseNum(val) {
  if (val === null || val === undefined || val === "") return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

function buildAlerts(d, thresholds) {
  const list = [];
  // The backend threshold response is authoritative. Until it is available,
  // do not manufacture alert decisions from a frontend default.
  if (!d || !hasSensorReadings(d) || !Array.isArray(thresholds) || thresholds.length === 0) return list;

  const hasReading = (key) => d[key] !== null && d[key] !== undefined && d[key] !== "" && Number.isFinite(Number(d[key]));

  function add(icon, title, message, level) {
    list.push({ icon, title, message, level });
  }

  // 1. PM2.5
  if (hasReading("pm25")) {
    const v = Number(d.pm25);
    const th = getThresholdFor(thresholds, "PM2.5") || {};
    const crit = parseNum(th.critical);
    const warn = parseNum(th.warning);

    if (crit !== null && v >= crit) {
      add(<AlertTriangle size={16} />, "PM2.5 danger level", `PM2.5 is ${v} µg/m³. Consider filtration and ventilation.`, "Danger");
    } else if (warn !== null && v >= warn) {
      add(<Wind size={16} />, "PM2.5 warning", `PM2.5 is ${v} µg/m³. Air quality is becoming unhealthy.`, "Warning");
    }
  }

  // 2. PM10
  if (hasReading("pm10")) {
    const v = Number(d.pm10);
    const th = getThresholdFor(thresholds, "PM10") || {};
    const crit = parseNum(th.critical);
    const warn = parseNum(th.warning);

    if (crit !== null && v >= crit) {
      add(<AlertTriangle size={16} />, "PM10 danger level", `PM10 is ${v} µg/m³. Dust level is high.`, "Danger");
    } else if (warn !== null && v >= warn) {
      add(<Wind size={16} />, "PM10 warning", `PM10 is ${v} µg/m³. Dust level is above your warning limit.`, "Warning");
    }
  }

  // 3. PM1.0
  if (hasReading("pm1")) {
    const v = Number(d.pm1);
    const th = getThresholdFor(thresholds, "PM1.0") || {};
    const crit = parseNum(th.critical);
    const warn = parseNum(th.warning);

    if (crit !== null && v >= crit) {
      add(<AlertTriangle size={16} />, "PM1.0 danger level", `PM1.0 is ${v} µg/m³. Very high particulate level.`, "Danger");
    } else if (warn !== null && v >= warn) {
      add(<Wind size={16} />, "PM1.0 warning", `PM1.0 is ${v} µg/m³. Elevated particulate level.`, "Warning");
    }
  }

  // 4. CO2
  if (hasReading("co2")) {
    const v = Number(d.co2);
    const th = getThresholdFor(thresholds, "CO2") || {};
    const crit = parseNum(th.critical);
    const warn = parseNum(th.warning);

    if (crit !== null && v >= crit) {
      add(<AlertTriangle size={16} />, "CO2 danger level", `CO2 equivalent is ${v.toFixed(0)} ppm. Improve ventilation immediately.`, "Danger");
    } else if (warn !== null && v >= warn) {
      add(<Gauge size={16} />, "CO2 warning", `CO2 equivalent is ${v.toFixed(0)} ppm. Ventilation may be low.`, "Warning");
    }
  }

  // 5. VOC
  if (hasReading("voc")) {
    const v = Number(d.voc);
    const th = getThresholdFor(thresholds, "VOC") || {};
    const crit = parseNum(th.critical);
    const warn = parseNum(th.warning);

    if (crit !== null && v >= crit) {
      add(<AlertTriangle size={16} />, "VOC danger level", `VOC equivalent is ${v.toFixed(2)} ppm. Possible chemical or odor source nearby.`, "Danger");
    } else if (warn !== null && v >= warn) {
      add(<Activity size={16} />, "VOC warning", `VOC equivalent is ${v.toFixed(2)} ppm. Check for perfumes, smoke, cleaners or solvents.`, "Warning");
    }
  }

  // 6. Temperature (minimum / maximum / critical / warning)
  if (hasReading("temperature")) {
    const v = Number(d.temperature);
    const th = getThresholdFor(thresholds, "Temperature") || {};
    const crit = parseNum(th.critical);
    const warn = parseNum(th.warning);
    const min = parseNum(th.minimum);
    const max = parseNum(th.maximum);

    if (crit !== null && v >= crit) {
      add(<AlertTriangle size={16} />, "High temperature danger", `Temperature is ${v.toFixed(1)} °C. Room exceeds critical thermal threshold.`, "Danger");
    } else if (max !== null && v > max) {
      add(<Thermometer size={16} />, "High temperature", `Temperature is ${v.toFixed(1)} °C. Room is above comfort limit.`, "Warning");
    } else if (min !== null && v < min) {
      add(<Thermometer size={16} />, "Low temperature", `Temperature is ${v.toFixed(1)} °C. Room is below comfort limit.`, "Warning");
    } else if (warn !== null && v >= warn) {
      add(<Thermometer size={16} />, "Temperature warning", `Temperature is ${v.toFixed(1)} °C. Temperature is elevated.`, "Warning");
    }
  }

  // 7. Humidity (minimum / maximum / critical / warning)
  if (hasReading("humidity")) {
    const v = Number(d.humidity);
    const th = getThresholdFor(thresholds, "Humidity") || {};
    const crit = parseNum(th.critical);
    const warn = parseNum(th.warning);
    const min = parseNum(th.minimum);
    const max = parseNum(th.maximum);

    if (crit !== null && v >= crit) {
      add(<AlertTriangle size={16} />, "High humidity danger", `Humidity is ${v.toFixed(0)}%. Dangerously high moisture level.`, "Danger");
    } else if (max !== null && v > max) {
      add(<Droplets size={16} />, "High humidity", `Humidity is ${v.toFixed(0)}%. Risk of discomfort or moisture buildup.`, "Warning");
    } else if (min !== null && v < min) {
      add(<Droplets size={16} />, "Low humidity", `Humidity is ${v.toFixed(0)}%. Air may feel dry.`, "Warning");
    } else if (warn !== null && v >= warn) {
      add(<Droplets size={16} />, "Humidity warning", `Humidity is ${v.toFixed(0)}%. Moisture level is elevated.`, "Warning");
    }
  }

  // 8. IAQ, when supplied by the sensor, follows its saved warning/critical limits.
  if (hasReading("iaq")) {
    const v = Number(d.iaq);
    const th = getThresholdFor(thresholds, "IAQ") || {};
    const crit = parseNum(th.critical);
    const warn = parseNum(th.warning);

    if (crit !== null && v >= crit) {
      add(<AlertTriangle size={16} />, "IAQ danger level", `IAQ is ${v.toFixed(0)}. Indoor air quality is unhealthy.`, "Danger");
    } else if (warn !== null && v >= warn) {
      add(<Activity size={16} />, "IAQ warning", `IAQ is ${v.toFixed(0)}. Air quality needs attention.`, "Warning");
    }
  }

  if (list.length === 0) {
    const allReadingsPresent = ALERT_SENSOR_KEYS.every(hasReading);
    add(<CheckCircle2 size={16} />, "All readings normal", allReadingsPresent
      ? "All readings are within the configured limits."
      : "Available readings are within the configured limits.", "Good");
  }

  add(<Activity size={16} />, "Device status", "SmartSurround is serving live readings from the connected sensors.", "Info");

  return list;
}

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: <Activity size={15} /> },
  { id: "airquality", label: "Air Quality", icon: <Wind size={15} /> },
  { id: "environment", label: "Environment", icon: <Thermometer size={15} /> },
  { id: "camera", label: "Camera", icon: <Video size={15} /> },
  { id: "location", label: "Location", icon: <MapPin size={15} /> },
  { id: "account-help", label: "Help Desk", icon: <HelpCircle size={15} /> },
  { id: "alerts", label: "Alerts", icon: <Bell size={15} /> },
];

const DEFAULT_ALERT_SETTINGS = [];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? "" : "http://127.0.0.1:5000");
const BACKEND_DISPLAY_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";


function accountStorageKey(prefix, uid) {
  return `${prefix}_${uid || "guest"}`;
}


function readAccountSettings(uid) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(accountStorageKey("smartsurround_account_settings", uid)) || "{}");
    return {
      appearance: "system",
      notifications: true,
      emailNotifications: true,
      language: "English",
      compactMode: false,
      ...saved,
    };
  } catch {
    return {
      appearance: "system",
      notifications: true,
      emailNotifications: true,
      language: "English",
      compactMode: false,
    };
  }
}


function readLocalAvatar(uid) {
  try {
    return window.localStorage.getItem(accountStorageKey("smartsurround_avatar", uid)) || "";
  } catch {
    return "";
  }
}


function saveLocalAvatar(uid, value) {
  try {
    window.localStorage.setItem(accountStorageKey("smartsurround_avatar", uid), value);
  } catch {
    // Storage may be unavailable/private mode; Firebase photoURL still works.
  }
}


function formatAdminTime(value) {
  if (!value) return "No data";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString(undefined,{dateStyle:"medium",timeStyle:"short"});
}



export {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, X, Sparkles, ShieldCheck, MapPin, Camera, Activity, CloudRain, Flame, Mic, Wind, BrainCircuit, User, Lock, Mail, LogOut, Eye, EyeOff, Thermometer, Droplets, Gauge, Satellite, Video, Table, Bell, Download, Play, Pause, Trash2, RotateCcw, Compass, Navigation, Save, Radio, FileText, Maximize2, Minimize2, AlertTriangle, Settings, HelpCircle, Upload, Paperclip, MessageSquare, Moon, Sun, Monitor, CheckCircle2, Clock3, Send, UserRound,
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signOut,
  updateProfile,
  reload,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateEmail,
  onValue,
  ref,
  getStorage,
  storageRef,
  uploadBytes,
  getDownloadURL,
  firebaseApp,
  db,
  BACKEND_URL,
  BACKEND_DISPLAY_URL,
  EMPTY_READING,
  EMPTY_GPS,
  NAV_ITEMS,
  DEFAULT_ALERT_SETTINGS,
  pm25Status,
  statusClass,
  getIaqColor,
  clamp,
  fmt,
  yVal,
  buildPath,
  buildAlerts,
  hasSensorReadings,
  accountStorageKey,
  readAccountSettings,
  readLocalAvatar,
  saveLocalAvatar,
  formatAdminTime,
};
