import React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  MapPin,
  Camera,
  Activity,
  CloudRain,
  Flame,
  Mic,
  Wind,
  BrainCircuit,
  User,
  Lock,
  Mail,
  LogOut,
  Eye,
  EyeOff,
  Thermometer,
  Droplets,
  Gauge,
  Satellite,
  Video,
  Table,
  Bell,
  Download,
  Play,
  Pause,
  Trash2,
  RotateCcw,
  Compass,
  Navigation,
  Save,
  Radio,
  FileText,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Settings,
  HelpCircle,
  Upload,
  Paperclip,
  MessageSquare,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
  Clock3,
  Send,
  UserRound,
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
import { firebaseApp, db } from "./firebaseClient";

import "./index.css";

const firebaseAuth = getAuth(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

/* =========================================================
   NAVBAR
========================================================= */

function Navbar({ isLoggedIn, currentUser, onLoginClick, onLogoutClick, onDashboardClick, onPdfClick }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const links = [
    ["Home", "#home"],
    ["About", "#about"],
    ["Features", "#features"],
    ["How It Works", "#how"],
    ["Contact", "#contact"],
  ];

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">

        {/* Logo */}

        <a href="#home" className="brand">
          <div className="brand-icon">
            <Activity size={19} strokeWidth={2.5} />
          </div>

          <div>
            <span className="brand-name">Smart</span>
            <span className="brand-name-light">Surround</span>
          </div>
        </a>

        {/* Desktop navigation */}

        <div className="desktop-nav">
          {links.map(([name, href]) => (
            <a href={href} key={name}>
              {name}
            </a>
          ))}

          <button type="button" className="nav-pdf-link" onClick={onPdfClick}>
            <FileText size={14} />
            PPT
          </button>
        </div>

        <a href="#contact" className="nav-button">
          Explore System
          <ArrowUpRight size={16} />
        </a>

        {isLoggedIn ? (
          <div className="nav-user">
            <button
              type="button"
              className="nav-user-pill"
              onClick={onDashboardClick}
            >
              <span className="nav-user-avatar">
                <User size={13} />
              </span>
              {currentUser?.name || "Account"}
            </button>

            <button
              type="button"
              className="nav-logout-button"
              onClick={onLogoutClick}
              aria-label="Log out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="nav-login-button"
            onClick={onLoginClick}
          >
            <User size={15} />
            Login
          </button>
        )}

        {/* Mobile */}

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">

          {links.map(([name, href]) => (
            <a
              key={name}
              href={href}
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </a>
          ))}

          <button
            type="button"
            className="mobile-menu-cta secondary"
            onClick={() => {
              setMenuOpen(false);
              onPdfClick();
            }}
          >
            <FileText size={15} />
            PPT
          </button>

          <a
            href="#contact"
            className="mobile-menu-cta"
            onClick={() => setMenuOpen(false)}
          >
            Explore System
          </a>

          {isLoggedIn ? (
            <>
              <button
                type="button"
                className="mobile-menu-cta mobile-menu-login"
                onClick={() => {
                  setMenuOpen(false);
                  onDashboardClick();
                }}
              >
                <User size={15} />
                {currentUser?.name || "Account"}
              </button>

              <button
                type="button"
                className="mobile-menu-cta mobile-menu-login secondary"
                onClick={() => {
                  setMenuOpen(false);
                  onLogoutClick();
                }}
              >
                <LogOut size={15} />
                Log Out
              </button>
            </>
          ) : (
            <button
              type="button"
              className="mobile-menu-cta mobile-menu-login"
              onClick={() => {
                setMenuOpen(false);
                onLoginClick();
              }}
            >
              <User size={15} />
              Login
            </button>
          )}

        </div>
      )}
    </header>
  );
}


/* =========================================================
   HERO
========================================================= */

function Hero() {
  return (
    <section id="home" className="hero">

      {/* Background */}

      <div className="hero-glow glow-one"></div>
      <div className="hero-glow glow-two"></div>

      <div className="hero-grid"></div>

      <div className="hero-content">

        {/* Badge */}

        <motion.div
          className="announcement"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="announcement-dot"></span>

          <span>AI Powered Environmental Intelligence</span>

          <ArrowRight size={14} />
        </motion.div>


        {/* Heading */}

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Monitor your
          <br />

          <span className="hero-highlight">
            surroundings smarter.
          </span>
        </motion.h1>


        {/* Description */}

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          SmartSurround is an AI-powered environmental and safety
          monitoring system designed to understand the world around you.
        </motion.p>


        <motion.p
          className="hero-description second"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          It combines connected sensors, intelligent vision,
          sound monitoring and GPS-based location awareness into
          one unified platform.
        </motion.p>


        {/* CTA */}

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >

          <a href="#about" className="primary-button">
            Discover SmartSurround
            <ArrowRight size={17} />
          </a>

          <a href="#features" className="secondary-button">
            Explore Features
          </a>

        </motion.div>


        {/* Trust / info */}

        <motion.div
          className="hero-trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >

          <div className="trust-icons">

            <div className="trust-circle">
              <Wind size={15} />
            </div>

            <div className="trust-circle">
              <Camera size={15} />
            </div>

            <div className="trust-circle">
              <MapPin size={15} />
            </div>

          </div>

          <span>Environmental</span>
          <span className="trust-divider">|</span>
          <span>AI Vision</span>
          <span className="trust-divider">|</span>
          <span>Location Intelligence</span>

        </motion.div>

      </div>


      {/* Dashboard preview */}

      <DashboardPreview />

    </section>
  );
}


/* =========================================================
   DASHBOARD PREVIEW
   NO SENSOR READINGS
========================================================= */

function DashboardPreview() {

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.9,
        delay: 0.45,
      }}
    >

      <div className="dashboard-glow"></div>

      <div className="dashboard">

        {/* Dashboard top bar */}

        <div className="dashboard-topbar">

          <div className="browser-dots">

            <span></span>
            <span></span>
            <span></span>

          </div>

          <div className="dashboard-url">
            smartsurround / monitoring
          </div>

          <div className="dashboard-status">
            <span></span>
            System Online
          </div>

        </div>


        <div className="dashboard-body">

          {/* Sidebar */}

          <aside className="dashboard-sidebar">

            <div className="side-logo">

              <div className="mini-logo">
                <Activity size={14} />
              </div>

              <span>SmartSurround</span>

            </div>

            <div className="sidebar-title">
              MONITORING
            </div>

            <div className="side-link active">
              <Activity size={15} />
              Overview
            </div>

            <div className="side-link">
              <Wind size={15} />
              Environment
            </div>

            <div className="side-link">
              <Camera size={15} />
              AI Vision
            </div>

            <div className="side-link">
              <Mic size={15} />
              Sound
            </div>

            <div className="side-link">
              <MapPin size={15} />
              Location
            </div>

            <div className="sidebar-title second-title">
              SYSTEM
            </div>

            <div className="side-link">
              <ShieldCheck size={15} />
              Safety
            </div>

          </aside>


          {/* Main dashboard */}

          <main className="dashboard-main">

            <div className="dashboard-heading">

              <div>
                <div className="small-label">
                  SMART ENVIRONMENT
                </div>

                <h3>
                  Surrounding Intelligence
                </h3>

                <p>
                  A unified view of your environment
                </p>
              </div>

              <div className="dashboard-live">
                <span></span>
                LIVE SYSTEM
              </div>

            </div>


            {/* Feature cards */}

            <div className="monitor-cards">

              <MonitorCard
                icon={<Wind />}
                title="Air Quality"
                text="Continuous environmental monitoring"
              />

              <MonitorCard
                icon={<Activity />}
                title="Environment"
                text="Connected atmospheric sensors"
              />

              <MonitorCard
                icon={<Camera />}
                title="AI Vision"
                text="Intelligent visual monitoring"
              />

              <MonitorCard
                icon={<Mic />}
                title="Sound"
                text="Surrounding noise awareness"
              />

            </div>


            {/* Lower dashboard */}

            <div className="dashboard-lower">

              {/* AI card */}

              <div className="ai-card">

                <div className="card-header">

                  <div>
                    <div className="card-label">
                      INTELLIGENT ANALYSIS
                    </div>

                    <h4>
                      AI Monitoring
                    </h4>
                  </div>

                  <div className="ai-icon">
                    <BrainCircuit size={17} />
                  </div>

                </div>

                <div className="ai-visual">

                  <div className="ai-orbit orbit-one"></div>
                  <div className="ai-orbit orbit-two"></div>

                  <div className="ai-center">
                    <Sparkles size={22} />
                  </div>

                </div>

                <div className="ai-footer">
                  <span>
                    Cloud AI Processing
                  </span>

                  <span className="ai-active">
                    Active
                  </span>
                </div>

              </div>


              {/* Location card */}

              <div className="location-card">

                <div className="card-header">

                  <div>
                    <div className="card-label">
                      LOCATION INTELLIGENCE
                    </div>

                    <h4>
                      Live Location
                    </h4>
                  </div>

                  <div className="location-icon">
                    <MapPin size={17} />
                  </div>

                </div>

                <div className="map-placeholder">

                  <div className="map-grid"></div>

                  <div className="map-road road-one"></div>
                  <div className="map-road road-two"></div>
                  <div className="map-road road-three"></div>

                  <div className="map-pin">
                    <MapPin size={20} />
                  </div>

                </div>

              </div>

            </div>


            {/* Event row */}

            <div className="event-row">

              <EventItem
                icon={<Flame />}
                title="Fire Detection"
                text="Safety monitoring enabled"
              />

              <EventItem
                icon={<CloudRain />}
                title="Rain Detection"
                text="Weather awareness enabled"
              />

              <EventItem
                icon={<ShieldCheck />}
                title="Safety Monitoring"
                text="Continuous protection"
              />

            </div>

          </main>

        </div>

      </div>


      {/* Floating cards */}

      <div className="floating-card floating-left">

        <div className="floating-icon">
          <Sparkles size={17} />
        </div>

        <div>
          <span>AI Intelligence</span>
          <strong>Enabled</strong>
        </div>

      </div>


      <div className="floating-card floating-right">

        <div className="floating-icon orange">
          <ShieldCheck size={17} />
        </div>

        <div>
          <span>Safety System</span>
          <strong>Active</strong>
        </div>

      </div>

    </motion.div>
  );
}


/* =========================================================
   MONITOR CARD
========================================================= */

function MonitorCard({ icon, title, text }) {

  return (
    <div className="monitor-card">

      <div className="monitor-icon">
        {icon}
      </div>

      <div>

        <h5>{title}</h5>

        <p>{text}</p>

      </div>

      <div className="card-arrow">
        <ArrowUpRight size={14} />
      </div>

    </div>
  );
}


/* =========================================================
   EVENT ITEM
========================================================= */

function EventItem({ icon, title, text }) {

  return (
    <div className="event-item">

      <div className="event-icon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <div className="event-check">
        <Check size={13} />
      </div>

    </div>
  );
}


/* =========================================================
   ABOUT
========================================================= */

function About() {

  const pings = [
    { top: "16%", left: "60%", delay: 0 },
    { top: "64%", left: "70%", delay: 0.8 },
    { top: "38%", left: "82%", delay: 1.6 },
    { top: "78%", left: "46%", delay: 2.4 },
    { top: "26%", left: "38%", delay: 1.2 },
  ];

  return (
    <section id="about" className="about-section">

      <div className="about-bg">

        <div className="about-bg-grid"></div>

        <motion.div
          className="about-bg-blob about-bg-blob-one"
          animate={{ x: [0, 22, 0], y: [0, 16, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="about-bg-blob about-bg-blob-two"
          animate={{ x: [0, -18, 0], y: [0, -14, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {pings.map((p, i) => (
          <span
            key={i}
            className="about-ping"
            style={{ top: p.top, left: p.left, "--delay": `${p.delay}s` }}
          ></span>
        ))}

      </div>

      <div className="section-container">

        <motion.div
          className="section-tag"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span></span>
          ABOUT SMARTSURROUND
        </motion.div>

        <div className="about-grid">

          <div className="about-left">

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Understanding your
              <br />
              surroundings,
              <span>
                intelligently.
              </span>
            </motion.h2>

            <motion.div
              className="about-visual"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >

              <div className="about-visual-grid"></div>

              <div className="radar-sweep"></div>

              <div className="radar-ring ring-a"></div>
              <div className="radar-ring ring-b"></div>
              <div className="radar-ring ring-c"></div>

              <div className="radar-core">
                <Activity size={22} />
              </div>

              <div className="about-float chip-wind">
                <Wind size={16} />
              </div>

              <div className="about-float chip-camera">
                <Camera size={16} />
              </div>

              <div className="about-float chip-map">
                <MapPin size={16} />
              </div>

              <div className="about-float chip-mic">
                <Mic size={16} />
              </div>

              <svg className="about-visual-lines" viewBox="0 0 400 300">
                <line x1="120" y1="120" x2="60" y2="45" />
                <line x1="120" y1="120" x2="320" y2="65" />
                <line x1="120" y1="120" x2="330" y2="235" />
                <line x1="120" y1="120" x2="85" y2="260" />
              </svg>

            </motion.div>

          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >

            <p className="large-paragraph">
              SmartSurround is a connected environmental monitoring
              platform that brings physical sensors, AI and location
              intelligence together.
            </p>

            <p>
              The system continuously observes environmental conditions,
              surrounding sound and visual information to help identify
              potential risks and changes around a monitored area.
            </p>

            <p>
              Instead of simply collecting data, SmartSurround is designed
              to transform that information into meaningful insights,
              alerts and intelligent decisions.
            </p>

          </motion.div>

        </div>


        {/* Stats without readings */}

        <div className="capability-grid">

          {[
            {
              number: "01",
              title: "Sense",
              text: "Connected sensors observe environmental conditions.",
            },
            {
              number: "02",
              title: "Understand",
              text: "AI analyzes visual and environmental information.",
            },
            {
              number: "03",
              title: "Locate",
              text: "GPS provides location awareness for the system.",
            },
            {
              number: "04",
              title: "Respond",
              text: "Intelligent alerts help identify potential risks.",
            },
          ].map((cap, index, arr) => (
            <React.Fragment key={cap.number}>

              <Capability
                number={cap.number}
                title={cap.title}
                text={cap.text}
                index={index}
              />

              {index < arr.length - 1 && (
                <motion.div
                  className="capability-arrow"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 + 0.35 }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              )}

            </React.Fragment>
          ))}

        </div>

      </div>

    </section>
  );
}


function Capability({ number, title, text, index = 0 }) {

  return (
    <motion.div
      className="capability"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >

      <div className="capability-progress-track">
        <motion.div
          className="capability-progress-fill"
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut", delay: index * 0.15 + 0.1 }}
        />
      </div>

      <span>{number}</span>

      <h3>{title}</h3>

      <p>{text}</p>

    </motion.div>
  );
}


/* =========================================================
   FEATURES
========================================================= */

function Features() {

  const features = [

    {
      icon: Wind,
      title: "Environmental Monitoring",
      text: "Monitor air quality and surrounding environmental conditions through connected sensors.",
    },

    {
      icon: Camera,
      title: "AI Vision",
      text: "Use camera-based intelligence to understand visual events and changes in the surroundings.",
    },

    {
      icon: Mic,
      title: "Sound Awareness",
      text: "Monitor surrounding sound levels and identify when noise conditions move beyond configured limits.",
    },

    {
      icon: Flame,
      title: "Fire Detection",
      text: "Safety-focused sensing helps detect potential fire-related events and trigger alerts.",
    },

    {
      icon: CloudRain,
      title: "Rain Detection",
      text: "Weather-aware monitoring provides information about rainfall conditions around the system.",
    },

    {
      icon: MapPin,
      title: "GPS Intelligence",
      text: "Location information connects environmental events with their physical surroundings.",
    },

  ];

  return (

    <section id="features" className="features-section">

      <div className="section-container">

        <div className="features-heading">

          <div>

            <div className="section-tag">
              <span></span>
              SYSTEM CAPABILITIES
            </div>

            <h2>
              One system.
              <br />
              <span>
                Complete awareness.
              </span>
            </h2>

          </div>

          <p>
            SmartSurround combines multiple sensing technologies
            into a single intelligent monitoring ecosystem.
          </p>

        </div>


        <div className="feature-grid">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.08,
                }}
              >

                <div className="feature-icon">
                  <Icon size={20} />
                </div>

                <div className="feature-number">
                  0{index + 1}
                </div>

                <h3>
                  {feature.title}
                </h3>

                <p>
                  {feature.text}
                </p>

                <div className="feature-arrow">
                  <ArrowUpRight size={16} />
                </div>

              </motion.div>

            );
          })}

        </div>

      </div>

    </section>

  );
}


/* =========================================================
   HOW IT WORKS
========================================================= */

function HowItWorks() {

  const steps = [

    {
      number: "01",
      title: "Sense",
      text: "SmartSurround collects information from connected environmental and safety sensors.",
    },

    {
      number: "02",
      title: "Connect",
      text: "The monitoring device securely sends information to the central platform.",
    },

    {
      number: "03",
      title: "Analyze",
      text: "Cloud-based AI processes visual and environmental information.",
    },

    {
      number: "04",
      title: "Respond",
      text: "The system presents insights and can generate alerts when required.",
    },

  ];

  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-120px" });

  const [activeIndex, setActiveIndex] = React.useState(-1);

  const lineControls = useAnimation();
  const runnerControls = useAnimation();

  React.useEffect(() => {

    if (!isInView) return;

    let cancelled = false;

    async function playSequence() {

      while (!cancelled) {

        setActiveIndex(-1);

        lineControls.set({ width: "0%" });
        runnerControls.set({ left: "0%", opacity: 0 });

        await new Promise((r) => setTimeout(r, 500));

        for (let i = 0; i < steps.length; i++) {

          if (cancelled) return;

          setActiveIndex(i);

          const targetPercent = (i / (steps.length - 1)) * 100;

          await Promise.all([
            lineControls.start({
              width: `${targetPercent}%`,
              transition: { duration: 0.75, ease: "easeInOut" },
            }),
            runnerControls.start({
              left: `${targetPercent}%`,
              opacity: 1,
              transition: { duration: 0.75, ease: "easeInOut" },
            }),
          ]);

          if (cancelled) return;

          await new Promise((r) => setTimeout(r, 550));

        }

        if (cancelled) return;

        await new Promise((r) => setTimeout(r, 1200));

        runnerControls.start({
          opacity: 0,
          transition: { duration: 0.4 },
        });

        await new Promise((r) => setTimeout(r, 500));

      }

    }

    playSequence();

    return () => {
      cancelled = true;
    };

  }, [isInView]);

  return (

    <section id="how" className="how-section" ref={sectionRef}>

      <div className="section-container">

        <div className="how-heading">

          <div className="section-tag">
            <span></span>
            HOW IT WORKS
          </div>

          <h2>
            From sensing
            <br />
            <span>
              to intelligence.
            </span>
          </h2>

        </div>


        <div className="steps">

          <div className="steps-track">

            <motion.div
              className="steps-track-fill"
              initial={{ width: "0%" }}
              animate={lineControls}
            />

            <motion.div
              className="steps-track-runner"
              initial={{ left: "0%", opacity: 0 }}
              animate={runnerControls}
            />

          </div>

          {steps.map((step, index) => (

            <motion.div
              className={
                "step" +
                (activeIndex === index ? " step-active" : "") +
                (activeIndex > index ? " step-done" : "")
              }
              key={step.number}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.1,
              }}
            >

              <motion.div
                className="step-number"
                animate={
                  activeIndex === index
                    ? { scale: [1, 1.18, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.6 }}
              >
                {step.number}
              </motion.div>

              <h3>
                {step.title}
              </h3>

              <p>
                {step.text}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>

  );
}


/* =========================================================
   AI SECTION
========================================================= */

function AISection() {

  return (

    <section className="ai-section">

      <div className="ai-section-glow"></div>

      <div className="section-container">

        <div className="ai-layout">

          <div>

            <div className="section-tag light">
              <span></span>
              CLOUD AI INTELLIGENCE
            </div>

            <h2>
              Sensors collect.
              <br />
              <span>
                AI understands.
              </span>
            </h2>

            <p>
              SmartSurround is designed so that computationally
              intensive AI processing can be performed on a
              server or cloud platform rather than directly on
              the edge device.
            </p>

            <div className="ai-points">

              <div>
                <Check size={15} />
                AI-powered visual analysis
              </div>

              <div>
                <Check size={15} />
                Environmental event detection
              </div>

              <div>
                <Check size={15} />
                Intelligent safety alerts
              </div>

            </div>

          </div>


          <div className="ai-visual-large">

            <div className="ai-ring ring-large"></div>
            <div className="ai-ring ring-medium"></div>
            <div className="ai-ring ring-small"></div>

            <div className="ai-core">
              <BrainCircuit size={35} />
              <span>AI</span>
            </div>

            <div className="ai-node node-one">
              <Camera size={16} />
            </div>

            <div className="ai-node node-two">
              <Wind size={16} />
            </div>

            <div className="ai-node node-three">
              <MapPin size={16} />
            </div>

            <div className="ai-node node-four">
              <Mic size={16} />
            </div>

          </div>

        </div>

      </div>

    </section>

  );
}


/* =========================================================
   CONTACT CTA
========================================================= */

function Contact({ onExplore }) {

  return (

    <section id="contact" className="contact-section">

      <div className="contact-box">

        <div className="contact-glow"></div>

        <div className="contact-content">

          <div className="contact-icon">
            <Activity size={22} />
          </div>

          <div className="section-tag">
            <span></span>
            SMARTER SURROUNDINGS
          </div>

          <h2>
            Make your surroundings
            <br />
            <span>
              more intelligent.
            </span>
          </h2>

          <p>
            SmartSurround connects sensing, AI and location
            intelligence to create a smarter approach to
            environmental and safety monitoring.
          </p>

          <a
            href="#home"
            className="primary-button"
            onClick={(event) => {
              event.preventDefault();
              onExplore();
            }}
          >
            Explore SmartSurround
            <ArrowUpRight size={17} />
          </a>

        </div>

      </div>

    </section>

  );
}


/* =========================================================
   PDF VIEWER MODAL
========================================================= */

function PdfViewerModal({ onClose }) {

  const panelRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !document.fullscreenElement) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  React.useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      panelRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function handleClose() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    onClose();
  }

  return (
    <motion.div
      className="pdf-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={handleClose}
    >

      <motion.div
        ref={panelRef}
        className={"pdf-panel" + (isFullscreen ? " is-fullscreen" : "")}
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="pdf-panel-bar">

          <div className="pdf-panel-title">
            <FileText size={15} />
            Team ABISKAR — PPT
          </div>

          <div className="pdf-panel-actions">

            <button
              type="button"
              className="pdf-close-button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            <button
              type="button"
              className="pdf-close-button"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>

          </div>

        </div>

        <div className="pdf-panel-body">
          <iframe
            src={`${import.meta.env.BASE_URL}SmartSurround.pdf`}
            title="Team ABISKAR PPT"
          ></iframe>
        </div>

      </motion.div>

    </motion.div>
  );
}


/* =========================================================
   FOOTER
========================================================= */

function Footer() {

  return (

    <footer className="footer">

      <div className="footer-glow"></div>

      <div className="footer-container">

        <div className="footer-brand">

          <a href="#home" className="brand">

            <div className="brand-icon">
              <Activity size={19} />
            </div>

            <div>
              <span className="brand-name">Smart</span>
              <span className="brand-name-light">
                Surround
              </span>
            </div>

          </a>

          <p>
            AI-powered environmental and safety
            monitoring for smarter surroundings.
          </p>

        </div>


        <div className="footer-links">

          <div>
            <strong>Platform</strong>

            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
          </div>

          <div>
            <strong>System</strong>

            <a href="#features">AI Vision</a>
            <a href="#features">Environment</a>
            <a href="#features">GPS</a>
          </div>

          <div>
            <strong>Contact</strong>

            <a href="#contact">Get Started</a>
            <a href="mailto:hello@smartsurround.ai">
              Email
            </a>
          </div>

        </div>

      </div>


      <div className="footer-bottom">

        <span>
          © 2026 SmartSurround. All rights reserved.
        </span>

        <span>
          AI × IoT × Environmental Intelligence
        </span>

      </div>

    </footer>

  );
}


/* =========================================================
   AUTH PAGE (LOGIN / CREATE ACCOUNT)
========================================================= */

function AuthPage({ onAuthSuccess, onAdminSuccess, onBack }) {

  const [mode, setMode] = React.useState("login"); // "login" | "signup" | "admin"
  const [showPassword, setShowPassword] = React.useState(false);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [adminPin, setAdminPin] = React.useState("");
  const [error, setError] = React.useState("");

  const [showSuccess, setShowSuccess] = React.useState(false);
  const [pendingUser, setPendingUser] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [passwordResetSent, setPasswordResetSent] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleForgotPassword() {
    setError("");
    setPasswordResetSent(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address first.");
      return;
    }

    try {
      setIsSubmitting(true);

      await sendPasswordResetEmail(firebaseAuth, cleanEmail);

      setPasswordResetSent(true);
    } catch (err) {
      console.error("Password reset error:", err.code, err.message);

      if (err?.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err?.code === "auth/user-not-found") {
        setError("No account was found for this email.");
      } else if (err?.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (err?.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err?.message || "Unable to send password reset email.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  async function handleAdminLogin() {
    const cleanPin = adminPin.trim();

    if (!cleanPin) {
      setError("Please enter the admin PIN.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("pin", cleanPin);

      let response;
      try {
        response = await fetch(`${BACKEND_URL}/login/creds`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
          cache: "no-store",
        });
      } catch (networkError) {
        throw new Error("Unable to connect to the SmartSurround backend. Start Flask on port 5000 and try again.");
      }

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok || !data?.ok) {
        if (response.status === 429) {
          throw new Error(data?.message || "Too many attempts. Please wait and try again later.");
        }
        if (response.status === 403) {
          throw new Error(data?.message || "Invalid admin PIN.");
        }
        throw new Error(data?.message || `Admin login failed (HTTP ${response.status}).`);
      }

      try { window.localStorage.setItem("ss_admin_pin", cleanPin); } catch (_) {}
      try {
        const token = response.headers.get("X-Set-Auth-Token");
        if (token) window.sessionStorage.setItem("ss_admin_token", token);
      } catch (_) {}
      onAdminSuccess?.({ authenticated: true });
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err?.message || "Unable to authenticate as administrator.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (mode === "admin") {
      await handleAdminLogin();
      return;
    }

    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password || (mode === "signup" && !cleanName)) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        // ============================================
        // CREATE FIREBASE ACCOUNT
        // ============================================
        const { user } = await createUserWithEmailAndPassword(
          firebaseAuth,
          cleanEmail,
          password
        );

        // Save the user's name in Firebase Auth profile.
        if (cleanName) {
          await updateProfile(user, {
            displayName: cleanName,
          });
        }

        // Send Firebase email verification.
        await sendEmailVerification(user);

        // Do not allow an unverified account into the dashboard.
        await signOut(firebaseAuth);

        setPendingUser({
          name: cleanName || cleanEmail.split("@")[0],
          email: cleanEmail,
        });

        setSuccessMessage(
          "We sent a verification link to your email. Verify your email, then log in to continue."
        );

        setShowSuccess(true);
      } else {
        // ============================================
        // LOGIN
        // ============================================
        const { user } = await signInWithEmailAndPassword(
          firebaseAuth,
          cleanEmail,
          password
        );

        // Refresh the user so emailVerified is current.
        await reload(user);

        if (!user.emailVerified) {
          await signOut(firebaseAuth);

          setError(
            "Your email is not verified yet. Open the verification email we sent you, verify your email, then log in again."
          );

          return;
        }

        setPendingUser({
          name:
            user.displayName ||
            cleanEmail.split("@")[0],
          email: user.email || cleanEmail,
        });

        setSuccessMessage(
          "Your email is verified. Taking you to your live dashboard..."
        );

        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Firebase authentication error:", err);

      const code = err?.code || "";

      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Please log in.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a while and try again.");
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err?.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  React.useEffect(() => {
    if (!showSuccess || !pendingUser) return;

    // Signup must NOT automatically enter the dashboard because
    // the user still needs to verify their email first.
    if (mode === "signup") return;

    const timer = setTimeout(() => {
      onAuthSuccess(pendingUser);
    }, 1700);

    return () => clearTimeout(timer);
  }, [showSuccess, pendingUser, mode, onAuthSuccess]);

  function closeSuccess() {
    setShowSuccess(false);
    setPendingUser(null);
    setSuccessMessage("");

    if (mode === "signup") {
      setMode("login");
      setPassword("");
      setError("");
    }
  }

  return (
    <section className="auth-section">

      <div className="auth-glow"></div>

      <div className="auth-layout">

        <motion.div
          className="auth-box"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <button type="button" className="auth-back" onClick={onBack}>
            <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />
            Back to site
          </button>

          <div className="auth-brand">
            <div className="brand-icon">
              <Activity size={19} strokeWidth={2.5} />
            </div>

            <div>
              <span className="brand-name">Smart</span>
              <span className="brand-name-light">Surround</span>
            </div>
          </div>

          <div className="auth-heading">
            <h2>
              {mode === "admin" ? "Administrator login" : mode === "login" ? "Welcome back" : "Create your account"}
            </h2>

            <p>
              {mode === "admin"
                ? "Use the secure administrator PIN to open the SmartSurround control panel."
                : mode === "login"
                  ? "Log in to view your live monitoring dashboard."
                  : "Sign up to start monitoring your surroundings."}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setError("");
                setShowSuccess(false);
              }}
            >
              Log In
            </button>

            <button
              type="button"
              className={mode === "admin" ? "active" : ""}
              onClick={() => {
                setMode("admin");
                setError("");
                setShowSuccess(false);
              }}
            >
              Admin Login
            </button>

            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => {
                setMode("signup");
                setError("");
                setShowSuccess(false);
              }}
            >
              Create Account
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>

            {mode === "admin" ? (
              <label className="auth-field">
                <span>Admin PIN</span>
                <div className="auth-input">
                  <ShieldCheck size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter administrator PIN"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    autoComplete="current-password"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide admin PIN" : "Show admin PIN"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
            ) : (
              <>
            {mode === "signup" && (
              <label className="auth-field">
                <span>Full Name</span>

                <div className="auth-input">
                  <User size={16} />
                  <input
                    type="text"
                    placeholder="Jordan Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              </label>
            )}

            <label className="auth-field">
              <span>Email</span>

              <div className="auth-input">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>

              <div className="auth-input">
                <Lock size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            </>
            )}

            {mode === "login" && (
              <div className="forgot-password-row">
                <button
                  type="button"
                  className="forgot-password-button"
                  onClick={handleForgotPassword}
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              </div>
            )}
            {mode === "login" && passwordResetSent && (
              <div className="password-reset-success">
                <div className="password-reset-success-title">
                  Check your email
                </div>

                <div className="password-reset-success-text">
                  We’ve sent a password reset link to your email address.
                  Please check your inbox and spam folder.
                </div>
              </div>
            )}


            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="primary-button auth-submit"
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "admin"
                  ? "Open Admin Panel"
                  : mode === "login"
                    ? "Log In"
                    : "Create Account"}
              <ArrowRight size={16} />
            </button>

          </form>

          <div className="auth-switch">
            {mode === "admin" ? (
              <>
                Need a regular account?
                <button type="button" onClick={() => setMode("login")}>
                  User login
                </button>
              </>
            ) : mode === "login" ? (
              <>
                Don't have an account?
                <button type="button" onClick={() => setMode("signup")}>
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?
                <button type="button" onClick={() => setMode("login")}>
                  Log in
                </button>
              </>
            )}
          </div>

        </motion.div>

        <motion.div
          className="auth-showcase"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >

          <div className="section-tag light">
            <span></span>
            WHAT YOU GET
          </div>

          <h3>
            Your live monitoring
            <br />
            dashboard, ready to go.
          </h3>

          <p>
            Air quality, AI vision, sound and location intelligence —
            all in one unified, real-time view.
          </p>

          <DashboardPreview />

        </motion.div>

      </div>

      {showSuccess && (
        <motion.div
          className="auth-success-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={mode === "signup" ? closeSuccess : undefined}
        >

          <motion.div
            className="auth-success-card"
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >

            <motion.div
              className="auth-success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15, type: "spring" }}
            >
              <Check size={26} strokeWidth={3} />
            </motion.div>

            <h3>
              {mode === "login" ? "Login successful" : "Verify your email"}
            </h3>

            <p>
              {successMessage}
            </p>

            {mode === "signup" && (
              <button
                type="button"
                className="primary-button auth-submit"
                onClick={closeSuccess}
              >
                Continue to Login
                <ArrowRight size={16} />
              </button>
            )}

            {mode === "login" && (
              <div className="auth-success-bar">
                <motion.div
                  className="auth-success-bar-fill"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.6, ease: "linear" }}
                />
              </div>
            )}

          </motion.div>

        </motion.div>
      )}

    </section>
  );
}



/* =========================================================
   LIVE DASHBOARD — SHARED HELPERS
========================================================= */

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

function buildAlerts(d, s) {
  const list = [];

  // No real reading yet — don't fabricate alerts.
  if (d.pm25 === null || d.pm25 === undefined) return list;

  function add(icon, title, message, level) {
    list.push({ icon, title, message, level });
  }

  if (Number(d.pm25) >= s.pm25Danger) {
    add("🚨", "PM2.5 danger level", `PM2.5 is ${d.pm25} µg/m³. Consider filtration and ventilation.`, "Danger");
  } else if (Number(d.pm25) >= s.pm25Warn) {
    add("⚠️", "PM2.5 warning", `PM2.5 is ${d.pm25} µg/m³. Air quality is becoming unhealthy.`, "Warning");
  }

  if (Number(d.pm10) >= s.pm10Danger) {
    add("🌪️", "PM10 danger level", `PM10 is ${d.pm10} µg/m³. Dust level is high.`, "Danger");
  } else if (Number(d.pm10) >= s.pm10Warn) {
    add("🌫️", "PM10 warning", `PM10 is ${d.pm10} µg/m³. Dust level is above your warning limit.`, "Warning");
  }

  if (Number(d.iaq) >= s.iaqDanger) {
    add("🛑", "IAQ danger level", `IAQ is ${Number(d.iaq).toFixed(0)}. Indoor air quality is unhealthy.`, "Danger");
  } else if (Number(d.iaq) >= s.iaqWarn) {
    add("⚠️", "IAQ warning", `IAQ is ${Number(d.iaq).toFixed(0)}. Air quality needs attention.`, "Warning");
  }

  if (Number(d.co2) >= s.co2Danger) {
    add("🫁", "CO2 danger level", `CO2 equivalent is ${Number(d.co2).toFixed(0)} ppm. Improve ventilation immediately.`, "Danger");
  } else if (Number(d.co2) >= s.co2Warn) {
    add("💨", "CO2 warning", `CO2 equivalent is ${Number(d.co2).toFixed(0)} ppm. Ventilation may be low.`, "Warning");
  }

  if (Number(d.voc) >= s.vocDanger) {
    add("🧪", "VOC danger level", `VOC equivalent is ${Number(d.voc).toFixed(2)} ppm. Possible chemical or odor source nearby.`, "Danger");
  } else if (Number(d.voc) >= s.vocWarn) {
    add("🧴", "VOC warning", `VOC equivalent is ${Number(d.voc).toFixed(2)} ppm. Check for perfumes, smoke, cleaners or solvents.`, "Warning");
  }

  if (Number(d.humidity) < s.humMin) {
    add("💧", "Low humidity", `Humidity is ${Number(d.humidity).toFixed(0)}%. Air may feel dry.`, "Warning");
  } else if (Number(d.humidity) > s.humMax) {
    add("💦", "High humidity", `Humidity is ${Number(d.humidity).toFixed(0)}%. Risk of discomfort or moisture buildup.`, "Warning");
  }

  if (Number(d.temperature) < s.tempMin) {
    add("❄️", "Low temperature", `Temperature is ${Number(d.temperature).toFixed(1)} °C. Room is below comfort limit.`, "Warning");
  } else if (Number(d.temperature) > s.tempMax) {
    add("🔥", "High temperature", `Temperature is ${Number(d.temperature).toFixed(1)} °C. Room is above comfort limit.`, "Warning");
  }

  if (list.length === 0) {
    add("✅", "All readings normal", "PM, IAQ, CO2, VOC, temperature and humidity are within the configured limits.", "Good");
  }

  add("📡", "Device status", "SmartSurround is serving live readings from the connected sensors.", "Info");

  return list;
}

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: <Activity size={15} /> },
  { id: "airquality", label: "Air Quality", icon: <Wind size={15} /> },
  { id: "environment", label: "Environment", icon: <Thermometer size={15} /> },
  { id: "camera", label: "Camera", icon: <Video size={15} /> },
  { id: "location", label: "Location", icon: <MapPin size={15} /> },
  { id: "datalog", label: "Data Log", icon: <Table size={15} /> },
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

function ProfileAvatar({ user, size = 44, className = "" }) {
  const [localAvatar, setLocalAvatar] = React.useState(() => readLocalAvatar(user?.id));
  React.useEffect(() => {
    setLocalAvatar(readLocalAvatar(user?.id));
  }, [user?.id, user?.photoURL]);

  const src = user?.photoURL || localAvatar;
  return (
    <span
      className={`account-avatar-button ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {src ? (
        <img src={src} alt="Profile" />
      ) : (
        <User size={Math.max(15, Math.round(size * 0.42))} />
      )}
    </span>
  );
}

function AccountMenu({ onSelect, onLogout }) {
  return (
    <motion.div
      className="account-dropdown"
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.16 }}
    >
      <div className="account-dropdown-head">
        <div className="account-dropdown-icon"><UserRound size={16} /></div>
        <div>
          <strong>Account</strong>
          <span>Manage your SmartSurround account</span>
        </div>
      </div>
      <div className="account-menu-list">
        <button type="button" onClick={() => onSelect("profile")}>
          <span className="account-menu-icon"><UserRound size={16} /></span>
          <span><strong>Update Profile</strong><small>Personal information & avatar</small></span>
          <ChevronDown size={14} className="account-menu-chevron" />
        </button>
        <button type="button" onClick={() => onSelect("help")}>
          <span className="account-menu-icon"><HelpCircle size={16} /></span>
          <span><strong>Help Desk</strong><small>Complaints & ticket status</small></span>
          <ChevronDown size={14} className="account-menu-chevron" />
        </button>
        <button type="button" onClick={() => onSelect("settings")}>
          <span className="account-menu-icon"><Settings size={16} /></span>
          <span><strong>Settings</strong><small>Appearance & preferences</small></span>
          <ChevronDown size={14} className="account-menu-chevron" />
        </button>
        <div className="account-menu-divider" />
        <button type="button" className="account-menu-danger" onClick={onLogout}>
          <span className="account-menu-icon"><LogOut size={16} /></span>
          <span><strong>Logout</strong><small>Sign out of this dashboard</small></span>
          <ChevronDown size={14} className="account-menu-chevron" />
        </button>
      </div>
    </motion.div>
  );
}

function LogoutConfirmDialog({ onCancel, onConfirm, loading = false }) {
  return (
    <div className="account-confirm-backdrop" role="presentation">
      <motion.div
        className="account-confirm-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
      >
        <div className="account-confirm-icon"><LogOut size={20} /></div>
        <h3 id="logout-confirm-title">Are you sure you want to log out?</h3>
        <p>Your active SmartSurround session will be cleared.</p>
        <div className="account-confirm-actions">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={loading}>Cancel</button>
          <button type="button" className="primary-button account-danger-button" onClick={onConfirm} disabled={loading}>
            <LogOut size={15} /> {loading ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AccountPanel({ currentUser, section, onClose, onUserUpdated, onAppearanceChange, onLogout, embedded = false }) {
  const [activeSection, setActiveSection] = React.useState(section || "profile");
  const [settings, setSettings] = React.useState(() => readAccountSettings(currentUser?.id));
  const [form, setForm] = React.useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: (() => {
      try { return window.localStorage.getItem(accountStorageKey("smartsurround_phone", currentUser?.id)) || ""; } catch { return ""; }
    })(),
    currentPassword: "",
    newPassword: "",
  });
  const [avatarPreview, setAvatarPreview] = React.useState(currentUser?.photoURL || readLocalAvatar(currentUser?.id));
  const [avatarFile, setAvatarFile] = React.useState(null);
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [profileMessage, setProfileMessage] = React.useState({ type: "", text: "" });
  const [complaints, setComplaints] = React.useState([]);
  const [complaintForm, setComplaintForm] = React.useState({ subject: "", description: "", priority: "Normal" });
  const [attachment, setAttachment] = React.useState(null);
  const [loadingComplaints, setLoadingComplaints] = React.useState(false);
  const [submittingComplaint, setSubmittingComplaint] = React.useState(false);
  const [helpMessage, setHelpMessage] = React.useState({ type: "", text: "" });
  const [lastTicket, setLastTicket] = React.useState("");
  const [savingSettings, setSavingSettings] = React.useState(false);

  React.useEffect(() => {
    setActiveSection(section || "profile");
  }, [section]);

  React.useEffect(() => {
    if (!currentUser?.id) return;
    setSettings(readAccountSettings(currentUser.id));
    setForm((prev) => ({ ...prev, name: currentUser.name || prev.name, email: currentUser.email || prev.email }));
    setAvatarPreview(currentUser.photoURL || readLocalAvatar(currentUser.id));
  }, [currentUser?.id, currentUser?.name, currentUser?.email, currentUser?.photoURL]);

  const loadComplaints = React.useCallback(async () => {
    if (!currentUser?.id) return;
    setLoadingComplaints(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/complaints?user_id=${encodeURIComponent(currentUser.id)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to load your complaints.");
      setComplaints(Array.isArray(data.complaints) ? data.complaints : []);
    } catch (err) {
      const networkError = err?.name === "TypeError" && /fetch/i.test(err?.message || "");
      setHelpMessage({
        type: "error",
        text: networkError
          ? `Help Desk server is unavailable. Start the SmartSurround backend at ${BACKEND_DISPLAY_URL} and try Refresh again.`
          : (err.message || "Unable to load Help Desk history."),
      });
    } finally {
      setLoadingComplaints(false);
    }
  }, [currentUser?.id]);

  React.useEffect(() => {
    if (activeSection === "help") loadComplaints();
  }, [activeSection, loadComplaints]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileMessage({ type: "error", text: "Please select an image file." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProfileMessage({ type: "error", text: "Profile pictures must be 2 MB or smaller." });
      return;
    }
    setAvatarFile(file);
    setProfileMessage({ type: "", text: "" });
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    const authUser = firebaseAuth.currentUser;
    if (!authUser) {
      setProfileMessage({ type: "error", text: "Your session has expired. Please sign in again." });
      return;
    }
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name) {
      setProfileMessage({ type: "error", text: "Full Name is required." });
      return;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setProfileMessage({ type: "error", text: "Enter a valid email address." });
      return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      setProfileMessage({ type: "error", text: "New password must contain at least 6 characters." });
      return;
    }
    if ((email !== authUser.email || form.newPassword) && !form.currentPassword) {
      setProfileMessage({ type: "error", text: "Enter your current password to change email or password." });
      return;
    }

    setSavingProfile(true);
    setProfileMessage({ type: "", text: "" });
    try {
      if ((email !== authUser.email || form.newPassword) && form.currentPassword) {
        const credential = EmailAuthProvider.credential(authUser.email || form.email, form.currentPassword);
        await reauthenticateWithCredential(authUser, credential);
      }

      if (email !== authUser.email) await updateEmail(authUser, email);
      if (form.newPassword) await updatePassword(authUser, form.newPassword);

      let photoURL = authUser.photoURL || "";
      let localAvatarValue = "";
      let avatarStorageFallback = false;
      if (avatarFile) {
        try {
          const ext = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
          const avatarRef = storageRef(firebaseStorage, `profile-avatars/${authUser.uid}/${Date.now()}.${ext}`);
          const uploaded = await uploadBytes(avatarRef, avatarFile, { contentType: avatarFile.type });
          photoURL = await getDownloadURL(uploaded.ref);
        } catch {
          // Keep the profile usable even if Firebase Storage rules are not enabled yet.
          const fallbackReader = new FileReader();
          localAvatarValue = String(await new Promise((resolve, reject) => {
            fallbackReader.onload = () => resolve(String(fallbackReader.result || ""));
            fallbackReader.onerror = reject;
            fallbackReader.readAsDataURL(avatarFile);
          }) || "");
          avatarStorageFallback = true;
        }
      }

      await updateProfile(authUser, { displayName: name, photoURL: photoURL || null });
      if (photoURL) saveLocalAvatar(authUser.uid, photoURL);
      if (localAvatarValue) saveLocalAvatar(authUser.uid, localAvatarValue);
      try { window.localStorage.setItem(accountStorageKey("smartsurround_phone", authUser.uid), form.phone.trim()); } catch {}
      await reload(authUser);

      const updatedUser = {
        id: authUser.uid,
        name: authUser.displayName || name,
        email: authUser.email || email,
        photoURL: authUser.photoURL || photoURL || localAvatarValue || readLocalAvatar(authUser.uid),
      };
      onUserUpdated(updatedUser);
      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", email: updatedUser.email, name: updatedUser.name }));
      setAvatarFile(null);
      setProfileMessage({
        type: "success",
        text: avatarStorageFallback
          ? "Profile saved. Avatar is stored locally because Firebase Storage is not currently available."
          : "Profile updated successfully.",
      });
    } catch (err) {
      console.error("Profile update error:", err);
      const code = err?.code || "";
      const text = code === "auth/email-already-in-use"
        ? "That email address is already in use."
        : code === "auth/invalid-credential" || code === "auth/wrong-password"
          ? "Current password is incorrect."
          : code === "auth/requires-recent-login"
            ? "Please sign in again before changing sensitive account details."
            : err?.message || "Unable to update your profile.";
      setProfileMessage({ type: "error", text });
    } finally {
      setSavingProfile(false);
    }
  };

  const submitComplaint = async (event) => {
    event.preventDefault();
    const subject = complaintForm.subject.trim();
    const description = complaintForm.description.trim();
    if (!subject || !description) {
      setHelpMessage({ type: "error", text: "Subject and detailed description are required." });
      return;
    }
    if (description.length < 10) {
      setHelpMessage({ type: "error", text: "Please provide at least 10 characters of detail." });
      return;
    }
    setSubmittingComplaint(true);
    setHelpMessage({ type: "", text: "" });
    try {
      const data = new FormData();
      data.append("user_id", currentUser.id);
      data.append("user_name", currentUser.name || "User");
      data.append("email", currentUser.email || "");
      data.append("subject", subject);
      data.append("description", description);
      data.append("priority", complaintForm.priority);
      if (attachment) data.append("attachment", attachment);

      const response = await fetch(`${BACKEND_URL}/api/complaints`, { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || "Unable to submit complaint.");
      const ticket = result.complaint?.ticket_id || "";
      setLastTicket(ticket);
      setComplaintForm({ subject: "", description: "", priority: "Normal" });
      setAttachment(null);
      const fileInput = document.getElementById("account-help-attachment");
      if (fileInput) fileInput.value = "";
      setHelpMessage({ type: "success", text: ticket ? `Complaint submitted successfully. Ticket ${ticket} has been created.` : "Complaint submitted successfully." });
      await loadComplaints();
    } catch (err) {
      const networkError = err?.name === "TypeError" && /fetch/i.test(err?.message || "");
      setHelpMessage({
        type: "error",
        text: networkError
          ? `Unable to reach the Help Desk server at ${BACKEND_DISPLAY_URL}. Start the backend and try again.`
          : (err.message || "Unable to submit complaint."),
      });
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      window.localStorage.setItem(accountStorageKey("smartsurround_account_settings", currentUser.id), JSON.stringify(settings));
      onAppearanceChange(settings.appearance);
      setHelpMessage({ type: "success", text: "Preferences saved successfully." });
      window.setTimeout(() => setHelpMessage((m) => m.text === "Preferences saved successfully." ? { type: "", text: "" } : m), 2200);
    } catch {
      setHelpMessage({ type: "error", text: "Unable to save preferences in this browser." });
    } finally {
      setSavingSettings(false);
    }
  };

  const sectionTitle = {
    profile: "Update Profile",
    help: "Help Desk",
    settings: "Settings",
  }[activeSection];

  const sectionDescription = {
    profile: "Manage your SmartSurround account information and profile picture.",
    help: "Submit a complaint, track its status, and read administrator replies.",
    settings: "Control the appearance and general dashboard preferences.",
  }[activeSection];

  const statusTone = (status) => {
    const value = String(status || "Open").toLowerCase();
    if (value === "resolved" || value === "closed") return "success";
    if (value === "in progress") return "warning";
    return "neutral";
  };

  return (
    <div className={embedded ? "account-page" : "account-panel-backdrop"} onMouseDown={(e) => { if (!embedded && e.target === e.currentTarget) onClose(); }}>
      <motion.div
        className={embedded ? "account-panel account-panel-embedded" : "account-panel"}
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-panel-title"
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="account-panel-header">
          <div>
            <div className="small-label">ACCOUNT MANAGEMENT</div>
            <h2 id="account-panel-title">{sectionTitle}</h2>
            <p>{sectionDescription}</p>
          </div>
          <button type="button" className="account-close-button" onClick={onClose} aria-label="Close account management">
            <X size={18} />
          </button>
        </div>

        <div className="account-panel-body">
          <aside className="account-panel-nav account-panel-nav-settings-only">
            <button className={activeSection === "settings" ? "active" : ""} onClick={() => setActiveSection("settings")} type="button">
              <Settings size={17} /> Settings
            </button>
            <div className="account-panel-nav-divider" />
            <button className="account-panel-logout-link" onClick={onLogout} type="button">
              <LogOut size={17} /> Logout
            </button>
            <div className="account-panel-nav-note">Your profile, support tickets and preferences stay connected to this account.</div>
          </aside>

          <section className="account-panel-content">
            {activeSection === "profile" && (
              <form onSubmit={saveProfile} className="account-form">
                <div className="account-profile-hero">
                  <div className="account-profile-avatar-wrap">
                    {avatarPreview ? <img src={avatarPreview} alt="Profile preview" /> : <UserRound size={34} />}
                    <label className="account-avatar-upload" htmlFor="account-avatar-input" title="Change profile picture">
                      <Upload size={14} />
                    </label>
                    <input id="account-avatar-input" type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                  </div>
                  <div>
                    <strong>{form.name || "Your Name"}</strong>
                    <span>{form.email || "your@email.com"}</span>
                    <small>JPG, PNG, WEBP • Max 2 MB</small>
                  </div>
                </div>

                {profileMessage.text && <div className={`account-message ${profileMessage.type}`}>{profileMessage.text}</div>}

                <div className="account-form-grid">
                  <label><span>Full Name</span><input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Full Name" autoComplete="name" /></label>
                  <label><span>Email</span><input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="name@example.com" autoComplete="email" /></label>
                  <label><span>Phone Number</span><input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Phone number" autoComplete="tel" /></label>
                  <div className="account-field-spacer" />
                  <label><span>Current Password <em>required for password/email changes</em></span><input type="password" value={form.currentPassword} onChange={(e) => updateField("currentPassword", e.target.value)} placeholder="Current password" autoComplete="current-password" /></label>
                  <label><span>New Password</span><input type="password" value={form.newPassword} onChange={(e) => updateField("newPassword", e.target.value)} placeholder="Leave blank to keep current" autoComplete="new-password" /></label>
                </div>

                <div className="account-form-footer">
                  <span>Password changes use Firebase Authentication security checks.</span>
                  <div>
                    <button type="button" className="secondary-button" onClick={onClose} disabled={savingProfile}>Cancel</button>
                    <button type="submit" className="primary-button" disabled={savingProfile}>{savingProfile ? "Saving..." : "Save Changes"}</button>
                  </div>
                </div>
              </form>
            )}

            {activeSection === "help" && (
              <div className="account-help-layout">
                <form className="account-help-form" onSubmit={submitComplaint}>
                  <div className="account-section-heading"><MessageSquare size={18} /><div><strong>Submit a complaint</strong><span>Tell the administrator what needs attention.</span></div></div>
                  {helpMessage.text && <div className={`account-message ${helpMessage.type}`}>{helpMessage.text}</div>}
                  {lastTicket && <div className="account-ticket-callout"><CheckCircle2 size={17} /><div><strong>Ticket created</strong><span>{lastTicket}</span></div></div>}
                  <label><span>Subject / Complaint Title</span><input maxLength={160} value={complaintForm.subject} onChange={(e) => setComplaintForm((f) => ({ ...f, subject: e.target.value }))} placeholder="What do you need help with?" /></label>
                  <label><span>Detailed Description</span><textarea maxLength={8000} rows={6} value={complaintForm.description} onChange={(e) => setComplaintForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe the issue clearly..." /></label>
                  <div className="account-form-grid compact">
                    <label><span>Priority</span><select value={complaintForm.priority} onChange={(e) => setComplaintForm((f) => ({ ...f, priority: e.target.value }))}><option>Normal</option><option>Intermediate</option><option>Urgent</option></select></label>
                    <label><span>Attachment <em>optional</em></span><div className="account-file-input"><Paperclip size={15} /><input id="account-help-attachment" type="file" accept="image/*,.pdf,.txt" onChange={(e) => setAttachment(e.target.files?.[0] || null)} /><span>{attachment?.name || "Choose file"}</span></div></label>
                  </div>
                  <button type="submit" className="primary-button" disabled={submittingComplaint}><Send size={15} /> {submittingComplaint ? "Submitting..." : "Submit Complaint"}</button>
                </form>

                <div className="account-complaints-list">
                  <div className="account-section-heading"><Clock3 size={18} /><div><strong>My complaints</strong><span>Track tickets submitted from this account.</span></div><button type="button" className="icon-text-button" onClick={loadComplaints} disabled={loadingComplaints}>{loadingComplaints ? "Loading..." : "Refresh"}</button></div>
                  {loadingComplaints && complaints.length === 0 ? <div className="account-empty-state">Loading your tickets...</div> : complaints.length === 0 ? <div className="account-empty-state"><HelpCircle size={28} /><strong>No complaints yet</strong><span>Your submitted tickets will appear here.</span></div> : complaints.map((ticket) => (
                    <article key={ticket.id} className={`complaint-card priority-${String(ticket.priority || "Normal").toLowerCase()}`}>
                      <div className="complaint-card-top"><div><strong>{ticket.subject}</strong><span>{ticket.ticket_id}</span></div><span className={`complaint-priority ${String(ticket.priority || "Normal").toLowerCase()}`}>{ticket.priority}</span></div>
                      <p>{ticket.description}</p>
                      <div className="complaint-card-meta"><span className={`complaint-status ${statusTone(ticket.status)}`}>{ticket.status}</span><span>{new Date(ticket.created_at).toLocaleString()}</span></div>
                      {ticket.admin_reply && <div className="complaint-reply"><strong>Admin reply</strong><p>{ticket.admin_reply}</p></div>}
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="account-settings">
                {helpMessage.text && <div className={`account-message ${helpMessage.type}`}>{helpMessage.text}</div>}
                <div className="account-setting-group">
                  <div className="account-setting-heading"><strong>Appearance</strong><span>Choose how the SmartSurround dashboard looks on this device.</span></div>
                  <div className="appearance-options">
                    {[
                      ["light", "Light Mode", Sun],
                      ["dark", "Dark Mode", Moon],
                      ["system", "System Default", Monitor],
                    ].map(([value, label, Icon]) => (
                      <button
                        type="button"
                        key={value}
                        className={settings.appearance === value ? "selected" : ""}
                        onClick={() => {
                          setSettings((s) => ({ ...s, appearance: value }));
                          try {
                            const existing = readAccountSettings(currentUser.id);
                            window.localStorage.setItem(
                              accountStorageKey("smartsurround_account_settings", currentUser.id),
                              JSON.stringify({ ...existing, appearance: value })
                            );
                          } catch {}
                          onAppearanceChange(value);
                        }}
                      >
                        <Icon size={18} /><strong>{label}</strong><span>{value === "system" ? "Follow your device" : value === "dark" ? "Use a dark interface" : "Use the current light interface"}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="account-setting-group">
                  <div className="account-setting-heading"><strong>Notifications</strong><span>Control how account and support updates are handled.</span></div>
                  <label className="setting-toggle-row"><div><strong>Dashboard notifications</strong><span>Show important SmartSurround alerts and account notices.</span></div><button type="button" className={`toggle-switch ${settings.notifications ? "on" : ""}`} onClick={() => setSettings((s) => ({ ...s, notifications: !s.notifications }))}><span /></button></label>
                  <label className="setting-toggle-row"><div><strong>Email notifications</strong><span>Allow email notifications for Help Desk updates when supported.</span></div><button type="button" className={`toggle-switch ${settings.emailNotifications ? "on" : ""}`} onClick={() => setSettings((s) => ({ ...s, emailNotifications: !s.emailNotifications }))}><span /></button></label>
                </div>
                <div className="account-setting-group">
                  <div className="account-setting-heading"><strong>Language</strong><span>Choose the dashboard language when translations are available.</span></div>
                  <select className="account-language-select" value={settings.language} onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}><option>English</option><option>Hindi</option><option>Bengali</option></select>
                </div>
                <div className="account-form-footer"><span>Preferences are stored for this account on this browser.</span><button type="button" className="primary-button" onClick={saveSettings} disabled={savingSettings}><Save size={15} /> {savingSettings ? "Saving..." : "Save Settings"}</button></div>
              </div>
            )}
          </section>
        </div>
      </motion.div>
    </div>
  );
}


/* =========================================================
   LIVE READING PAGE (INTERNAL, POST-LOGIN)
========================================================= */

function LiveReadingPage({ currentUser, onLogout, onBackToSite, onUserUpdated }) {

  const [activePage, setActivePage] = React.useState("overview");
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
  const isAccountPage = accountPanelOpen && activePage.startsWith("account-");

  const openAccountSection = (section) => {
    setAccountMenuOpen(false);
    setAccountPanelSection(section);
    setAccountPanelOpen(true);
    setActivePage(`account-${section}`);
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

  function saveAlertSettings(next) {
    setAlertSettings(next);
    window.localStorage.setItem("smartsurround_alert_settings", JSON.stringify(next));
  }

  function resetAlertSettings() {
    setAlertSettings(DEFAULT_ALERT_SETTINGS);
    window.localStorage.removeItem("smartsurround_alert_settings");
  }

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
              setActivePage(item.id);
              setMenuOpen(false);
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <div className="sidebar-title second-title">SYSTEM</div>

        <button
          type="button"
          className={"side-link" + (activePage === "safety" ? " active" : "")}
          onClick={() => {
            setAccountPanelOpen(false);
            setActivePage("safety");
            setMenuOpen(false);
          }}
        >
          <ShieldCheck size={15} />
          Safety
        </button>

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
              section={accountPanelSection}
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
                setActivePage("overview");
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

          {!isAccountPage && activePage === "camera" && <CameraPage camIp={camIp} cameraOnline={cameraOnline} />}

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
              alertSettings={alertSettings}
              onSave={saveAlertSettings}
              onReset={resetAlertSettings}
            />
          )}

          {!isAccountPage && activePage === "safety" && <SafetyPage />}

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

function StatTile({ label, value, unit, icon, badge, badgeClass }) {
  return (
    <div className="stat-tile">

      <div className="monitor-icon">{icon}</div>

      <div className="tile-value">
        {value}
        <span>{unit}</span>
      </div>

      <div className="tile-label">{label}</div>

      {badge && <div className={"tile-badge " + (badgeClass || "moderate")}>{badge}</div>}

    </div>
  );
}


function OverviewPage({ latest, alerts, connectionStatus }) {

  const hasIaq = latest.iaq !== null && latest.iaq !== undefined;
  const iaq = hasIaq ? Number(latest.iaq) : 0;
  const gaugeDeg = hasIaq ? (clamp(iaq, 0, 500) / 500) * 360 : 0;
  const gaugeColor = hasIaq ? getIaqColor(iaq) : "#c9beb7";
  const pms = latest.pm25 !== null && latest.pm25 !== undefined ? pm25Status(Number(latest.pm25)) : null;

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


function AirQualityPage({ latest, pmHistory }) {

  const [range, setRange] = React.useState("Live");
  const [hover, setHover] = React.useState(null);

  const data =
    pmHistory.length < 2
      ? Array.from({ length: 20 }, () => ({ label: "--", pm1: 0, pm25: 0, pm10: 0 }))
      : pmHistory;

  const max = Math.max(1, ...data.flatMap((d) => [d.pm1, d.pm25, d.pm10])) * 1.15;

  const pts = data.map((d, i) => ({
    ...d,
    x: 14 + (i / Math.max(1, data.length - 1)) * 872,
    y1: yVal(d.pm1, max),
    y25: yVal(d.pm25, max),
    y10: yVal(d.pm10, max),
  }));

  function handleMove(e) {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 900;

    let nearest = pts[0];
    let bestDist = Infinity;

    pts.forEach((p) => {
      const dist = Math.abs(p.x - x);
      if (dist < bestDist) {
        bestDist = dist;
        nearest = p;
      }
    });

    setHover(nearest);
  }

  return (
    <div className="page-block">

      <div className="page-heading">
        <div>
          <div className="small-label">TRENDS</div>
          <h1>Air Quality</h1>
          <p>Particulate matter readings over time.</p>
        </div>

        <div className="range-buttons">
          {["Live", "1H", "6H"].map((r) => (
            <button
              key={r}
              type="button"
              className={"range-btn" + (range === r ? " active" : "")}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="tile-grid three">
        <StatTile label="PM1.0" value={fmt(latest.pm1, 0)} unit="µg/m³" icon={<Wind size={16} />} />
        <StatTile label="PM2.5" value={fmt(latest.pm25, 0)} unit="µg/m³" icon={<Wind size={16} />} />
        <StatTile label="PM10" value={fmt(latest.pm10, 0)} unit="µg/m³" icon={<Wind size={16} />} />
      </div>

      <div className="chart-card">

        <div className="chart-legend">
          <span><i style={{ background: "#22c55e" }}></i>PM1.0</span>
          <span><i style={{ background: "#f97316" }}></i>PM2.5</span>
          <span><i style={{ background: "#ef4444" }}></i>PM10</span>
        </div>

        <svg
          viewBox="0 0 900 210"
          preserveAspectRatio="none"
          className="pm-chart-svg"
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        >

          <path
            d={`${buildPath(pts.map((p) => ({ x: p.x, y: p.y25 })))} L886,194 L14,194 Z`}
            fill="rgba(255,116,23,0.12)"
          />

          <path d={buildPath(pts.map((p) => ({ x: p.x, y: p.y1 })))} fill="none" stroke="#22c55e" strokeWidth="2.5" />
          <path d={buildPath(pts.map((p) => ({ x: p.x, y: p.y25 })))} fill="none" stroke="#f97316" strokeWidth="2.5" />
          <path d={buildPath(pts.map((p) => ({ x: p.x, y: p.y10 })))} fill="none" stroke="#ef4444" strokeWidth="2.5" />

          {hover && (
            <>
              <line x1={hover.x} x2={hover.x} y1="14" y2="194" stroke="rgba(33,20,15,0.2)" />
              <circle cx={hover.x} cy={hover.y1} r="4" fill="#22c55e" />
              <circle cx={hover.x} cy={hover.y25} r="4" fill="#f97316" />
              <circle cx={hover.x} cy={hover.y10} r="4" fill="#ef4444" />
            </>
          )}

        </svg>

        {hover && (
          <div className="chart-tooltip-box">
            <strong>{hover.label}</strong>
            <span>PM1.0: {hover.pm1}</span>
            <span>PM2.5: {hover.pm25}</span>
            <span>PM10: {hover.pm10}</span>
          </div>
        )}

      </div>

    </div>
  );
}


function EnvironmentPage({ latest }) {

  const hasData = latest.temperature !== null && latest.humidity !== null;

  const comfort = hasData
    ? clamp(
      100 - Math.abs(latest.temperature - 25) * 5 - Math.abs(latest.humidity - 50) * 0.6,
      45,
      96
    )
    : null;

  const comfortLabel = !hasData
    ? "No data yet"
    : comfort > 75
      ? "Very Comfortable"
      : comfort > 60
        ? "Comfortable"
        : "Needs Improvement";

  return (
    <div className="page-block">

      <div className="page-heading">
        <div>
          <div className="small-label">ENVIRONMENT</div>
          <h1>Atmospheric Conditions</h1>
          <p>Temperature, humidity and indoor air quality.</p>
        </div>
      </div>

      <div className="wide-card-row">

        <div className="wide-card">
          <Thermometer size={18} />
          <h3>
            {fmt(latest.temperature, 1)}
            <span className="unit">°C</span>
          </h3>
          <span>Temperature</span>
        </div>

        <div className="wide-card">
          <Droplets size={18} />
          <h3>
            {fmt(latest.humidity, 1)}
            <span className="unit">%</span>
          </h3>
          <span>Humidity</span>
        </div>

        <div className="wide-card">
          <Gauge size={18} />
          <h3>{fmt(latest.iaq, 0)}</h3>
          <span>IAQ Index</span>
        </div>

      </div>

      <div className="comfort-card">

        <div className="comfort-score">
          <strong>{hasData ? Math.round(comfort) + "%" : "--"}</strong>
        </div>

        <div>
          <h4>{comfortLabel}</h4>
          <p>
            {hasData
              ? "Temperature and humidity are within measured range."
              : "Connect your ESP32 to see comfort readings here."}
          </p>

          <div className="comfort-mini-grid">
            <div className="mini"><span>CO2 EQUIVALENT</span><strong>{fmt(latest.co2, 0)} ppm</strong></div>
            <div className="mini"><span>VOC EQUIVALENT</span><strong>{fmt(latest.voc, 2)} ppm</strong></div>
            <div className="mini"><span>CALIBRATION</span><strong>{latest.iaqAccuracyText || "--"}</strong></div>
            <div className="mini"><span>UPTIME</span><strong>{latest.uptime !== null ? latest.uptime + "s" : "--"}</strong></div>
          </div>
        </div>

      </div>

    </div>
  );
}



function CameraPage() {
  const CAMERA_IP = "192.168.1.103";

  const [frameUrl, setFrameUrl] = React.useState(
    `http://${CAMERA_IP}/capture?t=${Date.now()}`
  );

  const [cameraRunning, setCameraRunning] =
    React.useState(true);

  const [analysis, setAnalysis] =
    React.useState(null);

  const [analyzing, setAnalyzing] =
    React.useState(false);

  const [error, setError] =
    React.useState("");

  const frameTimer =
    React.useRef(null);


  // =========================================================
  // LIVE CAMERA
  // =========================================================

  React.useEffect(() => {

    if (!cameraRunning || analyzing) {
      return;
    }

    const updateFrame = () => {

      setFrameUrl(
        `http://${CAMERA_IP}/capture?t=${Date.now()}`
      );

    };

    frameTimer.current =
      setInterval(updateFrame, 250);

    return () => {

      if (frameTimer.current) {

        clearInterval(
          frameTimer.current
        );

        frameTimer.current = null;
      }

    };

  }, [cameraRunning, analyzing]);


  // =========================================================
  // CAPTURE + AI ANALYSIS
  // =========================================================

  const analyzeRoad = async () => {

    if (analyzing) {
      return;
    }

    console.log(
      "Stopping live camera frames..."
    );

    setAnalyzing(true);
    setError("");
    setAnalysis(null);

    setCameraRunning(false);

    if (frameTimer.current) {

      clearInterval(
        frameTimer.current
      );

      frameTimer.current = null;
    }


    try {

      /*
       * Wait for the last /capture request
       * to finish before calling /analyze.
       */
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 700)
      );


      console.log(
        "Requesting AI analysis..."
      );


      const controller =
        new AbortController();


      const timeoutId =
        setTimeout(() => {

          controller.abort();

        }, 60000);


      const response =
        await fetch(
          `http://${CAMERA_IP}/analyze`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );


      clearTimeout(timeoutId);


      console.log(
        "AI HTTP status:",
        response.status
      );


      const data =
        await response.json();


      console.log(
        "AI RESULT:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          `AI server returned HTTP ${response.status}`
        );

      }


      if (!data.ok) {

        throw new Error(
          data.message ||
          "AI analysis failed."
        );

      }


      /*
       * IMPORTANT:
       * The AI result is now stored in React state.
       */
      setAnalysis(data);


    } catch (err) {

      console.error(
        "AI analysis error:",
        err
      );


      if (
        err.name ===
        "AbortError"
      ) {

        setError(
          "AI analysis timed out. Check ESP32-CAM and Flask server."
        );

      } else {

        setError(
          err.message ||
          "Unable to analyze the road."
        );

      }

    } finally {

      /*
       * Wait a little before restarting
       * the camera.
       */
      await new Promise(
        (resolve) =>
          setTimeout(resolve, 500)
      );


      setFrameUrl(
        `http://${CAMERA_IP}/capture?t=${Date.now()}`
      );


      setCameraRunning(true);
      setAnalyzing(false);


      console.log(
        "Live camera restarted."
      );

    }

  };


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="page-block">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-heading">

        <div>

          <div className="small-label">
            AI VISION
          </div>

          <h1>
            Live Camera Feed
          </h1>

          <p>
            Real-time road monitoring and
            AI analysis using ESP32-CAM.
          </p>

        </div>


        <div className="dashboard-live">

          <span></span>

          {analyzing
            ? "AI ANALYZING"
            : cameraRunning
              ? "ESP32 LIVE"
              : "CAMERA"}

        </div>

      </div>



      {/* =====================================================
          CAMERA
      ===================================================== */}

      <div className="camera-card">

        {cameraRunning ? (

          <img
            src={frameUrl}
            alt="ESP32-CAM live feed"
            className="camera-stream"
            style={{
              width: "100%",
              height: "auto",
              minHeight: "400px",
              objectFit: "contain",
              background: "#080808",
              borderRadius: "16px",
              display: "block",
            }}
          />

        ) : (

          <div
            className="camera-placeholder"
            style={{
              minHeight: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <Camera size={35} />

            <h4>

              {analyzing
                ? "Analyzing road..."
                : "Camera paused"}

            </h4>

            <p>

              {analyzing
                ? "The ESP32-CAM image is being processed by the AI model."
                : "Camera is preparing..."}

            </p>

          </div>

        )}


        <div className="camera-overlay-top">

          <span className="rec-dot"></span>

          {analyzing
            ? "ANALYZING"
            : cameraRunning
              ? "LIVE"
              : "PAUSED"}

        </div>

      </div>



      {/* =====================================================
          CAMERA INFORMATION
      ===================================================== */}

      <div className="tile-grid three">

        <StatTile
          label="Camera Status"
          value={
            analyzing
              ? "Analyzing"
              : cameraRunning
                ? "Online"
                : "Paused"
          }
          unit=""
          icon={
            <Video size={16} />
          }
        />


        <StatTile
          label="Camera IP"
          value={CAMERA_IP}
          unit=""
          icon={
            <Camera size={16} />
          }
        />


        <StatTile
          label="AI Model"
          value="Ready"
          unit=""
          icon={
            <BrainCircuit size={16} />
          }
        />

      </div>



      {/* =====================================================
          CAPTURE & ANALYZE BUTTON
      ===================================================== */}

      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >

        <button
          type="button"
          className="primary-button"
          onClick={analyzeRoad}
          disabled={analyzing}
          style={{
            opacity:
              analyzing ? 0.65 : 1,
            cursor:
              analyzing
                ? "not-allowed"
                : "pointer",
          }}
        >

          <Camera size={17} />

          {analyzing
            ? "Capturing & Analyzing..."
            : "Capture & Analyze"}

        </button>

      </div>



      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div
          style={{
            padding:
              "15px 18px",
            marginBottom:
              "20px",
            borderRadius:
              "12px",
            background:
              "rgba(239,68,68,0.08)",
            border:
              "1px solid rgba(239,68,68,0.25)",
            color:
              "#dc2626",
          }}
        >

          <strong>
            Analysis Error
          </strong>

          <div
            style={{
              marginTop: "5px",
            }}
          >
            {error}
          </div>

        </div>

      )}



      {/* =====================================================
          AI RESULT
      ===================================================== */}

      {analysis && (

        <div
          className="wide-card"
          style={{
            width: "100%",
            padding: "24px",
            marginTop: "20px",
          }}
        >


          {/* =================================================
              RESULT HEADER
          ================================================= */}

          <div className="card-header">

            <div>

              <div className="card-label">
                AI ROAD ANALYSIS
              </div>

              <h3>
                Detection Result
              </h3>

            </div>

            <BrainCircuit
              size={20}
            />

          </div>



          {/* =================================================
              ROW 1
          ================================================= */}

          <div
            className="tile-grid three"
            style={{
              marginTop: "20px",
            }}
          >

            <StatTile
              label="Road Condition"
              value={
                analysis.road_condition ||
                "--"
              }
              unit=""
              icon={
                <Activity
                  size={16}
                />
              }
            />


            <StatTile
              label="Damage Type"
              value={
                analysis.damage_type ||
                "--"
              }
              unit=""
              icon={
                <ShieldCheck
                  size={16}
                />
              }
            />


            <StatTile
              label="Confidence"
              value={
                typeof analysis.confidence ===
                  "number"
                  ? (
                    analysis.confidence *
                    100
                  ).toFixed(1) + "%"
                  : "--"
              }
              unit=""
              icon={
                <Gauge
                  size={16}
                />
              }
            />

          </div>



          {/* =================================================
              ROW 2
          ================================================= */}

          <div
            className="tile-grid three"
            style={{
              marginTop: "15px",
            }}
          >

            <StatTile
              label="Severity"
              value={
                analysis.severity ||
                "--"
              }
              unit=""
              icon={
                <AlertTriangle
                  size={16}
                />
              }
            />


            <StatTile
              label="Admin Queue"
              value={
                analysis.queued_for_admin
                  ? "Queued"
                  : "Not Queued"
              }
              unit=""
              icon={
                <ShieldCheck
                  size={16}
                />
              }
            />


            <StatTile
              label="Detection ID"
              value={
                analysis.detection_id ??
                "--"
              }
              unit=""
              icon={
                <FileText
                  size={16}
                />
              }
            />

          </div>



          {/* =================================================
              ANALYZED IMAGE
          ================================================= */}

          {analysis.image && (

            <div
              style={{
                marginTop: "25px",
              }}
            >

              <div className="card-label">
                ANALYZED IMAGE
              </div>


              <img
                src={
                  `http://192.168.1.108:5000${analysis.image}`
                }
                alt="AI analyzed road"
                style={{
                  width: "100%",
                  maxWidth: "800px",
                  marginTop: "10px",
                  borderRadius: "14px",
                  display: "block",
                }}
              />

            </div>

          )}



          {/* =================================================
              RESULT MESSAGE
          ================================================= */}

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              borderRadius: "12px",
              background:
                analysis.road_condition ===
                  "damaged"
                  ? "rgba(249,115,22,0.10)"
                  : "rgba(34,197,94,0.10)",
            }}
          >

            <strong>

              {analysis.road_condition ===
                "damaged"
                ? "Road damage detected"
                : "Road classified as normal"}

            </strong>


            <p
              style={{
                marginBottom: 0,
                marginTop: "5px",
              }}
            >

              {analysis.queued_for_admin

                ? "This detection has been sent to the administrator verification queue."

                : "The image was successfully processed by the AI model."}

            </p>

          </div>

        </div>

      )}

    </div>

  );
}


function LocationPage({ gps }) {

  return (
    <div className="page-block">

      <div className="page-heading">
        <div>
          <div className="small-label">LOCATION INTELLIGENCE</div>
          <h1>GPS · NEO-8M</h1>
          <p>Live position data from the connected GPS module.</p>
        </div>

        <div className="dashboard-live">
          <span></span>
          {gps.fix || "No Fix"}
        </div>
      </div>

      <div className="map-placeholder large">
        <div className="map-grid"></div>
        <div className="map-road road-one"></div>
        <div className="map-road road-two"></div>
        <div className="map-road road-three"></div>
        <div className="map-pin">
          <MapPin size={22} />
        </div>
      </div>

      <div className="tile-grid three">
        <StatTile label="Latitude" value={fmt(gps.lat, 5)} unit="°" icon={<Compass size={16} />} />
        <StatTile label="Longitude" value={fmt(gps.lng, 5)} unit="°" icon={<Compass size={16} />} />
        <StatTile label="Altitude" value={fmt(gps.alt, 1)} unit="m" icon={<Navigation size={16} />} />
        <StatTile label="Speed" value={fmt(gps.speed, 1)} unit="km/h" icon={<Activity size={16} />} />
        <StatTile label="Course" value={fmt(gps.course, 0)} unit="°" icon={<Compass size={16} />} />
        <StatTile label="Satellites" value={gps.sats ?? "--"} unit="in view" icon={<Satellite size={16} />} />
        <StatTile label="HDOP" value={fmt(gps.hdop, 2)} unit="" icon={<Gauge size={16} />} />
        <StatTile label="Fix Type" value={gps.fix || "--"} unit="" icon={<MapPin size={16} />} />
        <StatTile label="UTC Time" value={gps.time || "--"} unit="" icon={<Satellite size={16} />} />
      </div>

    </div>
  );
}


function DataLogPage({
  logRows,
  loggerRunning,
  loggerInterval,
  setLoggerInterval,
  exportName,
  setExportName,
  isConnected,
  onStart,
  onStop,
  onClear,
  onExport,
  onAddNow,
}) {

  return (
    <div className="page-block">

      <div className="page-heading">
        <div>
          <div className="small-label">DATA LOGGER</div>
          <h1>History &amp; Export</h1>
          <p>Record sensor readings over time and export them as a spreadsheet.</p>
        </div>
      </div>

      {!isConnected && (
        <div className="logger-warning">
          Connect your ESP32 above to start logging real readings — logging is disabled while offline.
        </div>
      )}

      <div className="logger-controls">

        <div className={"logger-status" + (loggerRunning ? " running" : "")}>
          <span className="logger-dot"></span>
          {loggerRunning ? "Logger Running" : "Logger Stopped"}
        </div>

        <label className="logger-field">
          <span>Interval</span>
          <select value={loggerInterval} onChange={(e) => setLoggerInterval(Number(e.target.value))}>
            <option value={2000}>2 seconds</option>
            <option value={5000}>5 seconds</option>
            <option value={10000}>10 seconds</option>
            <option value={30000}>30 seconds</option>
          </select>
        </label>

        <div className="logger-buttons">

          <button type="button" className="primary-button small" onClick={onStart} disabled={loggerRunning || !isConnected}>
            <Play size={14} /> Start
          </button>

          <button type="button" className="secondary-button small" onClick={onStop} disabled={!loggerRunning}>
            <Pause size={14} /> Stop
          </button>

          <button type="button" className="secondary-button small" onClick={onAddNow} disabled={!isConnected}>
            Log Now
          </button>

        </div>

        <div className="logger-record-count">
          <span>Records</span>
          <strong>{logRows.length}</strong>
        </div>

      </div>

      <div className="export-row">

        <label className="logger-field">
          <span>File name</span>
          <input type="text" value={exportName} onChange={(e) => setExportName(e.target.value)} />
        </label>

        <button type="button" className="primary-button small" onClick={onExport}>
          <Download size={14} /> Export .xls
        </button>

        <button type="button" className="secondary-button small" onClick={onClear}>
          <Trash2 size={14} /> Clear
        </button>

      </div>

      <div className="log-table-wrap">
        <table className="log-table">

          <thead>
            <tr>
              <th>Time</th><th>PM1</th><th>PM2.5</th><th>PM10</th><th>Temp</th>
              <th>Humidity</th><th>IAQ</th><th>CO2</th><th>VOC</th>
            </tr>
          </thead>

          <tbody>

            {logRows.length === 0 && (
              <tr>
                <td colSpan={9} className="log-empty">
                  No records yet — start the logger or click "Log Now".
                </td>
              </tr>
            )}

            {logRows.map((r) => (
              <tr key={r.id}>
                <td>{r.time}</td>
                <td>{fmt(r.pm1, 0)}</td>
                <td>{fmt(r.pm25, 0)}</td>
                <td>{fmt(r.pm10, 0)}</td>
                <td>{fmt(r.temperature, 1)}°C</td>
                <td>{fmt(r.humidity, 1)}%</td>
                <td>{fmt(r.iaq, 1)}</td>
                <td>{fmt(r.co2, 0)}</td>
                <td>{fmt(r.voc, 2)}</td>
              </tr>
            ))}

          </tbody>

        </table>
      </div>

    </div>
  );
}


function AlertsPage({ alerts, alertSettings, onSave, onReset }) {

  const [form, setForm] = React.useState(alertSettings);

  React.useEffect(() => {
    setForm(alertSettings);
  }, [alertSettings]);

  const activeCount = alerts.filter((a) => a.level === "Warning" || a.level === "Danger").length;

  const highest = alerts.some((a) => a.level === "Danger")
    ? "Danger"
    : alerts.some((a) => a.level === "Warning")
      ? "Warning"
      : "Normal";

  function field(key, label, step) {
    return (
      <label className="threshold-field" key={key}>
        <span>{label}</span>
        <input
          type="number"
          step={step || 1}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
        />
      </label>
    );
  }

  return (
    <div className="page-block">

      <div className="page-heading">
        <div>
          <div className="small-label">SAFETY</div>
          <h1>Alerts &amp; Thresholds</h1>
          <p>Configure warning and danger levels for each sensor.</p>
        </div>
      </div>

      <div className="tile-grid three">
        <StatTile label="Active Alerts" value={activeCount} unit="" icon={<Bell size={16} />} />
        <StatTile label="Highest Level" value={highest} unit="" icon={<ShieldCheck size={16} />} />
        <StatTile
          label="Last Check"
          value={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          unit=""
          icon={<Activity size={16} />}
        />
      </div>

      <div className="alerts-list">

        {alerts.map((a, i) => (
          <div className="alert-row" key={i}>
            <div className="alert-icon">{a.icon}</div>
            <div>
              <strong>{a.title}</strong>
              <span>{a.message}</span>
            </div>
            <div className={"alert-level level-" + a.level.toLowerCase()}>{a.level}</div>
          </div>
        ))}

      </div>

      <div className="threshold-card">

        <h4>Threshold Settings</h4>

        <div className="threshold-grid">
          {field("pm25Warn", "PM2.5 Warning")}
          {field("pm25Danger", "PM2.5 Danger")}
          {field("pm10Warn", "PM10 Warning")}
          {field("pm10Danger", "PM10 Danger")}
          {field("iaqWarn", "IAQ Warning")}
          {field("iaqDanger", "IAQ Danger")}
          {field("co2Warn", "CO2 Warning")}
          {field("co2Danger", "CO2 Danger")}
          {field("vocWarn", "VOC Warning", 0.01)}
          {field("vocDanger", "VOC Danger", 0.01)}
          {field("humMin", "Humidity Min")}
          {field("humMax", "Humidity Max")}
          {field("tempMin", "Temp Min")}
          {field("tempMax", "Temp Max")}
        </div>

        <div className="threshold-actions">

          <button type="button" className="primary-button small" onClick={() => onSave(form)}>
            <Save size={14} /> Save Settings
          </button>

          <button type="button" className="secondary-button small" onClick={onReset}>
            <RotateCcw size={14} /> Reset to Default
          </button>

        </div>

      </div>

    </div>
  );
}

function AdminPage({ onBackToSite, onBackToLogin, onLogout }) {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? "" : "http://127.0.0.1:5000");

  const [pin, setPin] = React.useState(() => {
    try { return localStorage.getItem("ss_admin_pin") || ""; } catch (_) { return ""; }
  });
  const [authenticated, setAuthenticated] = React.useState(false);
  const [backendStatus, setBackendStatus] = React.useState("checking");

  const [pending, setPending] = React.useState([]);
  const [approved, setApproved] = React.useState([]);
  const [rejected, setRejected] = React.useState([]);
  const [complaints, setComplaints] = React.useState([]);

  const [activeTab, setActiveTab] = React.useState("pending");

  const [loading, setLoading] = React.useState(false);
  const [actionId, setActionId] = React.useState(null);

  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    const filename = String(imagePath).split(/[\\/]/).pop();

    return `${BACKEND_URL}/uploads/${encodeURIComponent(filename)}`;
  };

  const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    const text = await response.text();
    throw new Error(text || `Backend returned HTTP ${response.status}.`);
  };

  const loginWithPin = async (adminPin) => {
    const formData = new URLSearchParams();
    formData.append("pin", adminPin.trim());

    let response;
    try {
      response = await fetch(`${BACKEND_URL}/login/creds`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
        cache: "no-store",
      });
    } catch (err) {
      setBackendStatus("offline");
      throw new Error(`Unable to connect to the SmartSurround backend at ${BACKEND_URL || "/api"}. Start the Flask backend on port 5000 and try again.`);
    }

    const data = await parseResponse(response);

    if (!response.ok || !data.ok) {
      const message = data?.message || "Admin authentication failed.";
      if (response.status === 403) {
        throw new Error(`Admin PIN rejected by the backend. ${message}`);
      }
      throw new Error(message);
    }

    try { localStorage.setItem("ss_admin_pin", adminPin.trim()); } catch (_) {}
    try {
      const token = response.headers.get("X-Set-Auth-Token");
      if (token) sessionStorage.setItem("ss_admin_token", token);
    } catch (_) {}
    setBackendStatus("online");
    return data;
  };

  const adminFetch = async (url, options = {}, adminPin = pin, retry = true) => {
    if (!adminPin?.trim()) {
      throw new Error("Please enter the admin PIN.");
    }

    const requestOptions = {
      credentials: "include",
      cache: "no-store",
      ...options,
      headers: {
        ...(options.headers || {}),
        "X-Admin-Pin": adminPin.trim(),
        ...(typeof window !== "undefined" && sessionStorage.getItem("ss_admin_token")
          ? { "X-Auth-Token": sessionStorage.getItem("ss_admin_token") }
          : {}),
      },
    };

    let response;
    try {
      response = await fetch(url, requestOptions);
      setBackendStatus("online");
    } catch (err) {
      setBackendStatus("offline");
      throw new Error(`Unable to connect to the SmartSurround backend at ${BACKEND_URL || "/api"}. Start the Flask backend on port 5000 and try again.`);
    }

    const data = await parseResponse(response);

    if (response.status === 401 && retry) {
      await loginWithPin(adminPin);
      return adminFetch(url, options, adminPin, false);
    }

    if (!response.ok || !data.ok) {
      if (response.status === 403) {
        throw new Error(`Admin PIN rejected by the backend. ${data?.message || "Wrong PIN."}`);
      }
      throw new Error(data?.message || `Admin request failed (HTTP ${response.status}).`);
    }

    return data;
  };

  const checkBackend = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await parseResponse(response);
      if (!response.ok || !data.ok) throw new Error(data?.message || "Backend unavailable.");
      setBackendStatus("online");
      return data;
    } catch (err) {
      console.error("SmartSurround backend health check failed:", err);
      setBackendStatus("offline");
      return null;
    }
  };

  const loadDetections = async (adminPin = pin) => {
    if (!adminPin?.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = await adminFetch(`${BACKEND_URL}/admin/api/detections`, {
        method: "GET",
      }, adminPin);

      setPending(Array.isArray(data.pending) ? data.pending : []);
      setApproved(Array.isArray(data.approved) ? data.approved : []);
      setRejected(Array.isArray(data.rejected) ? data.rejected : []);
      setAuthenticated(true);
    } catch (err) {
      console.error("Admin load error:", err);
      setAuthenticated(false);
      setError(err.message || "Unable to load admin detections.");
    } finally {
      setLoading(false);
    }
  };

  const loadComplaints = async (adminPin = pin) => {
    if (!adminPin?.trim()) return;
    try {
      const data = await adminFetch(`${BACKEND_URL}/admin/api/complaints`, {
        method: "GET",
      }, adminPin);
      setComplaints(Array.isArray(data.complaints) ? data.complaints : []);
    } catch (err) {
      console.error("Admin complaints load error:", err);
      setError(err.message || "Unable to load Help Desk tickets.");
    }
  };

  const updateComplaint = async (id, status, reply) => {
    if (!pin?.trim()) {
      setAuthenticated(false);
      setError("Admin authentication is required.");
      return;
    }
    setActionId(`complaint-${id}`);
    setError("");
    setMessage("");
    try {
      const data = await adminFetch(`${BACKEND_URL}/admin/complaints/${id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_reply: reply }),
      }, pin);
      setMessage(data.message || "Help Desk ticket updated.");
      await loadComplaints(pin);
    } catch (err) {
      setError(err.message || "Unable to update complaint.");
    } finally {
      setActionId(null);
    }
  };

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      await checkBackend();
      if (cancelled || !pin?.trim()) return;
      try {
        await loginWithPin(pin.trim());
        if (cancelled) return;
        setAuthenticated(true);
        await Promise.all([loadDetections(pin.trim()), loadComplaints(pin.trim())]);
      } catch (err) {
        try { localStorage.removeItem("ss_admin_pin"); } catch (_) {}
        if (!cancelled) {
          setAuthenticated(false);
          setError(err.message || "Saved admin PIN is not valid.");
        }
      }
    })();

    return () => { cancelled = true; };
    // bootstrap once on mount; the polling effect below handles refreshes
  }, []);

  React.useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      loadDetections(pin);
      loadComplaints(pin);
    }, 10000);
    return () => clearInterval(interval);
  }, [authenticated, pin]);

  const performAction = async (id, action) => {
    if (!pin?.trim()) {
      setError("Admin authentication is required.");
      setAuthenticated(false);
      return;
    }

    setActionId(id);
    setError("");
    setMessage("");

    try {
      const data = await adminFetch(`${BACKEND_URL}/admin/${action}/${id}`, {
        method: "POST",
      }, pin);
      setMessage(data.message || `Detection #${id} updated.`);
      await loadDetections(pin);
      if (action === "approve") setActiveTab("approved");
    } catch (err) {
      console.error(`Admin ${action} error:`, err);
      if (String(err.message || "").toLowerCase().includes("pin")) {
        setAuthenticated(false);
      }
      setError(err.message || `Unable to ${action} detection.`);
    } finally {
      setActionId(null);
    }
  };

  const currentRows =
    activeTab === "pending"
      ? pending
      : activeTab === "approved"
        ? approved
        : rejected;

  const severityClass = (severity) => {
    const value = String(severity || "").toLowerCase();

    if (value.includes("critical")) {
      return {
        background: "rgba(239, 68, 68, 0.10)",
        color: "#dc2626",
      };
    }

    if (value.includes("high")) {
      return {
        background: "rgba(249, 115, 22, 0.10)",
        color: "#ea580c",
      };
    }

    if (value.includes("medium")) {
      return {
        background: "rgba(234, 179, 8, 0.12)",
        color: "#ca8a04",
      };
    }

    return {
      background: "rgba(34, 197, 94, 0.10)",
      color: "#16a34a",
    };
  };

  if (!authenticated) {
    return (
      <div className="page-block">
        <div className="page-heading">
          <div>
            <div className="small-label">ADMINISTRATION</div>
            <h1>Admin access required</h1>
            <p>
              Your administrator session is not active. Return to the SmartSurround Login page and choose Admin Login.
            </p>
            <p style={{ marginTop: "8px", fontSize: "12px", opacity: 0.65 }}>
              Backend: {backendStatus === "online" ? "Connected" : backendStatus === "offline" ? "Offline — start Flask on port 5000" : "Checking connection..."}
            </p>
          </div>
        </div>

        <div className="wide-card" style={{ maxWidth: "520px", width: "100%", padding: "30px" }}>
          <div style={{ width: "54px", height: "54px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255, 116, 23, 0.10)", marginBottom: "20px" }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ margin: "0 0 8px" }}>Administrator session</h3>
          <p style={{ margin: "0 0 22px", opacity: 0.7 }}>
            Use the separate Admin Login on the Login page. The normal user account session is not required for administrator access.
          </p>
          <button type="button" className="primary-button" style={{ width: "100%", justifyContent: "center" }} onClick={onBackToLogin || onBackToSite}>
            Back to Login
            <ArrowRight size={16} />
          </button>
          {error && <div className="auth-error" style={{ marginTop: "16px" }}>{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="page-block">

      {/* HEADER */}

      <div className="page-heading">

        <div>
          <div className="small-label">
            ADMINISTRATION
          </div>

          <h1>Road Damage Verification</h1>

          <p>
            Review AI detections and verify reports
            before generating official letters.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <div
            className="dashboard-live"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            <span></span>
            ADMIN ONLINE
          </div>
          <button type="button" className="secondary-button small" onClick={onBackToSite}>
            Back to Site
          </button>
          <button type="button" className="secondary-button small" onClick={onLogout}>
            <LogOut size={14} />
            Admin Logout
          </button>
        </div>

      </div>

      {/* MESSAGE */}

      {message && (
        <div
          style={{
            padding: "14px 17px",
            marginBottom: "18px",
            borderRadius: "12px",
            background: "rgba(34,197,94,0.08)",
            border:
              "1px solid rgba(34,197,94,0.20)",
            color: "#15803d",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "14px 17px",
            marginBottom: "18px",
            borderRadius: "12px",
            background: "rgba(239,68,68,0.08)",
            border:
              "1px solid rgba(239,68,68,0.20)",
            color: "#dc2626",
          }}
        >
          {error}
        </div>
      )}

      {/* STAT CARDS */}

      <div className="tile-grid three">

        <StatTile
          label="Pending Review"
          value={pending.length}
          unit=""
          icon={<AlertTriangle size={16} />}
        />

        <StatTile
          label="Approved"
          value={approved.length}
          unit=""
          icon={<Check size={16} />}
        />

        <StatTile
          label="Rejected"
          value={rejected.length}
          unit=""
          icon={<X size={16} />}
        />

      </div>

      {/* TABS */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "24px",
          marginBottom: "18px",
        }}
      >

        {[
          ["pending", `Pending (${pending.length})`],
          ["approved", `Approved (${approved.length})`],
          ["rejected", `Rejected (${rejected.length})`],
          ["complaints", `Help Desk (${complaints.length})`],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={
              activeTab === id
                ? "primary-button small"
                : "secondary-button small"
            }
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}

        <button
          type="button"
          className="secondary-button small"
          onClick={() => { loadDetections(pin); loadComplaints(pin); }}
          disabled={loading}
        >
          <RotateCcw size={14} />

          {loading ? "Refreshing..." : "Refresh"}
        </button>

      </div>

      {activeTab === "complaints" ? (
        <div className="admin-complaints-list">
          {complaints.length === 0 ? (
            <div className="wide-card admin-complaints-empty">
              <HelpCircle size={38} />
              <h3>No Help Desk tickets</h3>
              <p>User complaints will appear here as soon as they are submitted.</p>
            </div>
          ) : complaints.map((ticket) => (
            <AdminComplaintCard
              key={ticket.id}
              ticket={ticket}
              busy={actionId === `complaint-${ticket.id}`}
              onUpdate={updateComplaint}
              backendUrl={BACKEND_URL}
            />
          ))}
        </div>
      ) : (
        <>
          {/* EMPTY STATE */}
          {!loading && currentRows.length === 0 && (
            <div
              className="wide-card"
              style={{
                width: "100%",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <ShieldCheck
                size={38}
                style={{
                  opacity: 0.45,
                  marginBottom: "12px",
                }}
              />

              <h3>
                No {activeTab} detections
              </h3>

              <p
                style={{
                  opacity: 0.65,
                }}
              >
                There are currently no detections in
                this section.
              </p>
            </div>
          )}

          {/* DETECTION CARDS */}
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >

            {currentRows.map((detection) => {

              const imageUrl =
                getImageUrl(detection.image_path);

              const severityStyle =
                severityClass(detection.severity);

              const confidence =
                Number(detection.confidence || 0);

              const isPending =
                detection.status === "pending" ||
                activeTab === "pending";

              return (
                <div
                  key={detection.id}
                  className="wide-card"
                  style={{
                    width: "100%",
                    padding: "22px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "15px",
                      flexWrap: "wrap",
                      marginBottom: "18px",
                    }}
                  >
                    <div>
                      <div className="small-label" style={{ marginBottom: "5px" }}>
                        DETECTION #{detection.id}
                      </div>
                      <h3 style={{ margin: 0 }}>
                        {detection.damage_class || "Unclassified damage"}
                      </h3>
                    </div>
                    <span style={{ padding: "7px 11px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", ...severityStyle }}>
                      {detection.severity || "Unknown"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 360px) 1fr", gap: "24px", alignItems: "start" }}>
                    <div>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`Detection ${detection.id}`}
                          style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.08)", display: "block" }}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <div style={{ height: "210px", borderRadius: "14px", background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          No image
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px" }}>
                        <AdminInfo label="Confidence" value={`${(confidence * 100).toFixed(1)}%`} />
                        <AdminInfo label="Source" value={detection.source || "Unknown"} />
                        <AdminInfo label="Road Condition" value={detection.hazard_type || "Road damage"} />
                        <AdminInfo label="Status" value={detection.status || activeTab} />
                        <AdminInfo label="Latitude" value={detection.lat ?? "--"} />
                        <AdminInfo label="Longitude" value={detection.lon ?? "--"} />
                      </div>

                      {detection.description && (
                        <div style={{ marginTop: "15px", padding: "13px 15px", borderRadius: "12px", background: "rgba(0,0,0,0.035)" }}>
                          <strong style={{ display: "block", fontSize: "12px", marginBottom: "5px", opacity: 0.65 }}>DESCRIPTION</strong>
                          <span>{detection.description}</span>
                        </div>
                      )}

                      {detection.created_at && (
                        <div style={{ marginTop: "12px", fontSize: "12px", opacity: 0.55 }}>
                          Created: {String(detection.created_at)}
                        </div>
                      )}

                      {isPending && (
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                          <button type="button" className="primary-button small" disabled={actionId === detection.id} onClick={() => performAction(detection.id, "approve")} style={{ opacity: actionId === detection.id ? 0.6 : 1 }}>
                            <Check size={14} />
                            {actionId === detection.id ? "Processing..." : "Approve & Generate Letter"}
                          </button>
                          <button type="button" className="secondary-button small" disabled={actionId === detection.id} onClick={() => performAction(detection.id, "reject")}>
                            <X size={14} /> Reject
                          </button>
                        </div>
                      )}

                      {detection.status === "approved" && detection.letter_path && (
                        <div style={{ marginTop: "18px" }}>
                          <a href={`${BACKEND_URL}/letters/${detection.id}`} target="_blank" rel="noopener noreferrer" className="primary-button small" style={{ display: "inline-flex", textDecoration: "none" }}>
                            <FileText size={14} /> Download Official Letter
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}


function AdminComplaintCard({ ticket, busy, onUpdate, backendUrl }) {
  const [status, setStatus] = React.useState(ticket.status || "Open");
  const [reply, setReply] = React.useState(ticket.admin_reply || "");
  const priority = String(ticket.priority || "Normal").toLowerCase();

  React.useEffect(() => {
    setStatus(ticket.status || "Open");
    setReply(ticket.admin_reply || "");
  }, [ticket.id, ticket.status, ticket.admin_reply]);

  return (
    <article className={`admin-complaint-card priority-${priority}`}>
      <div className="admin-complaint-head">
        <div>
          <div className="small-label">HELP DESK • {ticket.ticket_id}</div>
          <h3>{ticket.subject}</h3>
          <span className="admin-complaint-user">{ticket.user_name || "User"} · {ticket.email || "No email"}</span>
        </div>
        <span className={`complaint-priority ${priority}`}>{ticket.priority}</span>
      </div>
      <div className="admin-complaint-description">{ticket.description}</div>
      <div className="admin-complaint-meta">
        <span className={`complaint-status ${String(ticket.status || "Open").toLowerCase().replace(/\s+/g, "-")}`}>{ticket.status}</span>
        <span>{ticket.created_at ? new Date(ticket.created_at).toLocaleString() : ""}</span>
        {ticket.attachment_path && (
          <a className="icon-text-button" href={`${backendUrl}/admin/complaints/${ticket.id}/attachment`} target="_blank" rel="noreferrer">
            <Paperclip size={14} /> Attachment
          </a>
        )}
      </div>
      <div className="admin-complaint-actions">
        <label><span>Status</span><select value={status} onChange={(e) => setStatus(e.target.value)}><option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option></select></label>
        <label className="admin-reply-field"><span>Admin reply</span><textarea rows={3} maxLength={8000} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply for the student..." /></label>
        <button type="button" className="primary-button small" disabled={busy} onClick={() => onUpdate(ticket.id, status, reply)}>
          <Send size={14} /> {busy ? "Saving..." : "Save Reply & Status"}
        </button>
      </div>
      {ticket.admin_reply && <div className="admin-existing-reply"><strong>Current reply</strong><p>{ticket.admin_reply}</p></div>}
    </article>
  );
}


function AdminInfo({ label, value }) {
  return (
    <div
      style={{
        padding: "13px 14px",
        borderRadius: "12px",
        background: "rgba(0,0,0,0.035)",
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.05em",
          opacity: 0.55,
          marginBottom: "5px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          fontSize: "14px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function SafetyPage() {

  const [toggles, setToggles] = React.useState({
    fire: true,
    rain: true,
    safety: true,
  });

  return (
    <div className="page-block">

      <div className="page-heading">
        <div>
          <div className="small-label">SYSTEM</div>
          <h1>Safety Monitoring</h1>
          <p>Enable or disable each protection system.</p>
        </div>
      </div>

      <div className="safety-toggle-list">

        <SafetyToggle
          icon={<Flame />}
          title="Fire Detection"
          text="Safety monitoring enabled"
          checked={toggles.fire}
          onChange={() => setToggles({ ...toggles, fire: !toggles.fire })}
        />

        <SafetyToggle
          icon={<CloudRain />}
          title="Rain Detection"
          text="Weather awareness enabled"
          checked={toggles.rain}
          onChange={() => setToggles({ ...toggles, rain: !toggles.rain })}
        />

        <SafetyToggle
          icon={<ShieldCheck />}
          title="Safety Monitoring"
          text="Continuous protection"
          checked={toggles.safety}
          onChange={() => setToggles({ ...toggles, safety: !toggles.safety })}
        />

      </div>

    </div>
  );
}


function SafetyToggle({ icon, title, text, checked, onChange }) {

  return (
    <div className="safety-toggle-row">

      <div className="event-icon">{icon}</div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <button
        type="button"
        className={"toggle-switch" + (checked ? " on" : "")}
        onClick={onChange}
        aria-label={title}
      >
        <span></span>
      </button>

    </div>
  );
}




/* =========================================================
   APP
========================================================= */

export default function App() {

  const [view, setView] = React.useState("site"); // "site" | "auth" | "live" | "admin"
  const [currentUser, setCurrentUser] = React.useState(null);
  const [pdfOpen, setPdfOpen] = React.useState(false);
  const [authInitialized, setAuthInitialized] = React.useState(false);

  // Restore Firebase login after refresh and react to auth changes.
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
            photoURL: user.photoURL || readLocalAvatar(user.uid),
          });
        } else {
          // Never keep an unverified account inside the dashboard.
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

  async function handleExploreSmartSurround() {
    // Wait until Firebase has finished restoring the persisted session.
    // This avoids incorrectly sending an already-authenticated visitor to Login
    // during the short window before onAuthStateChanged fires after page load.
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
      setView("auth");
      return;
    }

    try {
      await reload(authUser);
    } catch (err) {
      console.error("Firebase session check failed:", err);
    }

    if (!authUser.emailVerified) {
      // The project already requires verified email before dashboard access.
      await signOut(firebaseAuth);
      setCurrentUser(null);
      setView("auth");
      return;
    }

    setCurrentUser({
      id: authUser.uid,
      name: authUser.displayName || authUser.email?.split("@")[0] || "User",
      email: authUser.email || "",
      photoURL: authUser.photoURL || readLocalAvatar(authUser.uid),
    });
    setView("live");
  }

  function handleAuthSuccess(user) {
    const authUser = firebaseAuth.currentUser;
    setCurrentUser({
      ...user,
      photoURL: authUser?.photoURL || user?.photoURL || readLocalAvatar(user?.id),
    });
    setView("live");
  }

  function handleAdminSuccess() {
    setView("admin");
  }

  async function handleAdminLogout() {
    try {
      await fetch(`${BACKEND_URL}/admin/logout`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: typeof window !== "undefined" && sessionStorage.getItem("ss_admin_token")
          ? { "X-Auth-Token": sessionStorage.getItem("ss_admin_token") }
          : {},
      });
    } catch (err) {
      console.error("Admin logout failed:", err);
    } finally {
      try { window.localStorage.removeItem("ss_admin_pin"); } catch (_) {}
      try { window.sessionStorage.removeItem("ss_admin_token"); } catch (_) {}
      setView("site");
    }
  }

  async function handleLogout() {
    try {
      await signOut(firebaseAuth);
    } catch (err) {
      console.error("Firebase logout failed:", err);
    }

    setCurrentUser(null);
    try { localStorage.removeItem("ss_admin_pin"); } catch (_) {}
    setView("site");
  }

  if (view === "auth") {
    return (
      <div className="app">
        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          onAdminSuccess={handleAdminSuccess}
          onBack={() => setView("site")}
        />
      </div>
    );
  }

  if (view === "admin") {
    return (
      <div className="app admin-shell">
        <AdminPage
          onBackToSite={() => setView("site")}
          onBackToLogin={() => setView("auth")}
          onLogout={handleAdminLogout}
        />
      </div>
    );
  }

  if (view === "live" && currentUser) {
    return (
      <div className="app">
        <LiveReadingPage
          currentUser={currentUser}
          onLogout={handleLogout}
          onUserUpdated={(user) => setCurrentUser(user)}
          onBackToSite={() => setView("site")}
        />
      </div>
    );
  }

  return (

    <div className="app">

      <Navbar
        isLoggedIn={!!currentUser}
        currentUser={currentUser}
        onLoginClick={() => setView("auth")}
        onLogoutClick={handleLogout}
        onDashboardClick={() => setView("live")}
        onPdfClick={() => setPdfOpen(true)}
      />

      <main>

        <Hero />

        <About />

        <Features />

        <HowItWorks />

        <AISection />

        <Contact onExplore={handleExploreSmartSurround} />

      </main>

      <Footer />

      <AnimatePresence>
        {pdfOpen && <PdfViewerModal onClose={() => setPdfOpen(false)} />}
      </AnimatePresence>

    </div>

  );
}