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


const ALERT_SENSOR_KEYS = ["pm25", "pm10", "iaq", "co2", "voc", "humidity", "temperature"];

function hasSensorReadings(reading) {
  return ALERT_SENSOR_KEYS.some((key) => reading?.[key] !== null && reading?.[key] !== undefined && reading?.[key] !== "" && Number.isFinite(Number(reading[key])));
}

function buildAlerts(d, s) {
  const list = [];
  const hasReading = (key) => d[key] !== null && d[key] !== undefined && d[key] !== "" && Number.isFinite(Number(d[key]));
  if (!hasSensorReadings(d)) return list;

  function add(icon, title, message, level) {
    list.push({ icon, title, message, level });
  }

  if (hasReading("pm25") && Number(d.pm25) >= s.pm25Danger) {
    add(<AlertTriangle size={16} />, "PM2.5 danger level", `PM2.5 is ${d.pm25} µg/m³. Consider filtration and ventilation.`, "Danger");
  } else if (hasReading("pm25") && Number(d.pm25) >= s.pm25Warn) {
    add(<Wind size={16} />, "PM2.5 warning", `PM2.5 is ${d.pm25} µg/m³. Air quality is becoming unhealthy.`, "Warning");
  }

  if (hasReading("pm10") && Number(d.pm10) >= s.pm10Danger) {
    add(<AlertTriangle size={16} />, "PM10 danger level", `PM10 is ${d.pm10} µg/m³. Dust level is high.`, "Danger");
  } else if (hasReading("pm10") && Number(d.pm10) >= s.pm10Warn) {
    add(<Wind size={16} />, "PM10 warning", `PM10 is ${d.pm10} µg/m³. Dust level is above your warning limit.`, "Warning");
  }

  if (hasReading("iaq") && Number(d.iaq) >= s.iaqDanger) {
    add(<AlertTriangle size={16} />, "IAQ danger level", `IAQ is ${Number(d.iaq).toFixed(0)}. Indoor air quality is unhealthy.`, "Danger");
  } else if (hasReading("iaq") && Number(d.iaq) >= s.iaqWarn) {
    add(<Activity size={16} />, "IAQ warning", `IAQ is ${Number(d.iaq).toFixed(0)}. Air quality needs attention.`, "Warning");
  }

  if (hasReading("co2") && Number(d.co2) >= s.co2Danger) {
    add(<AlertTriangle size={16} />, "CO2 danger level", `CO2 equivalent is ${Number(d.co2).toFixed(0)} ppm. Improve ventilation immediately.`, "Danger");
  } else if (hasReading("co2") && Number(d.co2) >= s.co2Warn) {
    add(<Gauge size={16} />, "CO2 warning", `CO2 equivalent is ${Number(d.co2).toFixed(0)} ppm. Ventilation may be low.`, "Warning");
  }

  if (hasReading("voc") && Number(d.voc) >= s.vocDanger) {
    add(<AlertTriangle size={16} />, "VOC danger level", `VOC equivalent is ${Number(d.voc).toFixed(2)} ppm. Possible chemical or odor source nearby.`, "Danger");
  } else if (hasReading("voc") && Number(d.voc) >= s.vocWarn) {
    add(<Activity size={16} />, "VOC warning", `VOC equivalent is ${Number(d.voc).toFixed(2)} ppm. Check for perfumes, smoke, cleaners or solvents.`, "Warning");
  }

  if (hasReading("humidity") && Number(d.humidity) < s.humMin) {
    add(<Droplets size={16} />, "Low humidity", `Humidity is ${Number(d.humidity).toFixed(0)}%. Air may feel dry.`, "Warning");
  } else if (hasReading("humidity") && Number(d.humidity) > s.humMax) {
    add(<Droplets size={16} />, "High humidity", `Humidity is ${Number(d.humidity).toFixed(0)}%. Risk of discomfort or moisture buildup.`, "Warning");
  }

  if (hasReading("temperature") && Number(d.temperature) < s.tempMin) {
    add(<Thermometer size={16} />, "Low temperature", `Temperature is ${Number(d.temperature).toFixed(1)} °C. Room is below comfort limit.`, "Warning");
  } else if (hasReading("temperature") && Number(d.temperature) > s.tempMax) {
    add(<Thermometer size={16} />, "High temperature", `Temperature is ${Number(d.temperature).toFixed(1)} °C. Room is above comfort limit.`, "Warning");
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

const DEFAULT_ALERT_SETTINGS = {
  pm25Warn: 35,
  pm25Danger: 55,
  pm10Warn: 80,
  pm10Danger: 150,
  iaqWarn: 100,
  iaqDanger: 200,
  co2Warn: 1000,
  co2Danger: 2000,
  vocWarn: 1.0,
  vocDanger: 2.0,
  humMin: 30,
  humMax: 70,
  tempMin: 18,
  tempMax: 32,
};

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
