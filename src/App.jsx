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
} from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { firebaseApp, db } from "./firebaseClient";

import "./index.css";

const firebaseAuth = getAuth(firebaseApp);

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

function Contact() {

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

          <a href="#home" className="primary-button">
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

function AuthPage({ onAuthSuccess, onBack }) {

  const [mode, setMode] = React.useState("login"); // "login" | "signup"
  const [showPassword, setShowPassword] = React.useState(false);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
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
  async function handleSubmit(e) {
    e.preventDefault();

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
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>

            <p>
              {mode === "login"
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
            {passwordResetSent && (
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
                : mode === "login"
                  ? "Log In"
                  : "Create Account"}
              <ArrowRight size={16} />
            </button>

          </form>

          <div className="auth-switch">
            {mode === "login" ? (
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


/* =========================================================
   LIVE READING PAGE (INTERNAL, POST-LOGIN)
========================================================= */

function LiveReadingPage({ currentUser, onLogout, onBackToSite }) {

  const [activePage, setActivePage] = React.useState("overview");
  const [menuOpen, setMenuOpen] = React.useState(false);

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
    <div className="live-shell">

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

            <div className="live-user">
              <span className="nav-user-avatar">
                <User size={13} />
              </span>
              {currentUser?.name || "Account"}
            </div>

            <button type="button" className="secondary-button" onClick={onBackToSite}>
              Back to Site
            </button>

            <button
              type="button"
              className="nav-logout-button"
              onClick={onLogout}
              aria-label="Log out"
            >
              <LogOut size={15} />
            </button>

          </div>

        </div>

        <form className="esp32-panel" onSubmit={handleConnect}>

          <div className="esp32-panel-text">
            <strong>
              <Radio size={14} />
              Firebase sensor connection
            </strong>

            <span>
              {connectionStatus === "connected"
                ? "Live sensor and GPS readings are being received from Firebase Realtime Database. Use the local ESP32 IP below only for the camera stream on the same network."
                : connectionStatus === "error"
                  ? "Firebase connection error. Check your Firebase configuration, Realtime Database rules and network connection."
                  : "Waiting for live sensor data from Firebase Realtime Database."}
            </span>
          </div>

          <div className="esp32-panel-controls">

            <input
              type="text"
              placeholder="ESP32 local IP (camera)"
              value={esp32Input}
              onChange={(e) => setEsp32Input(e.target.value)}
            />

            <button type="submit" className="primary-button small">
              Save IP
            </button>

            {esp32Ip && (
              <button
                type="button"
                className="secondary-button small"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            )}

          </div>

        </form>

        <div className="live-page-content">

          {activePage === "overview" && (
            <OverviewPage latest={latest} alerts={alerts} connectionStatus={connectionStatus} />
          )}

          {activePage === "airquality" && (
            <AirQualityPage latest={latest} pmHistory={pmHistory} />
          )}

          {activePage === "environment" && <EnvironmentPage latest={latest} />}

          {activePage === "camera" && <CameraPage camIp={camIp} cameraOnline={cameraOnline} />}

          {activePage === "location" && <LocationPage gps={gps} />}

          {activePage === "datalog" && (
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

          {activePage === "alerts" && (
            <AlertsPage
              alerts={alerts}
              alertSettings={alertSettings}
              onSave={saveAlertSettings}
              onReset={resetAlertSettings}
            />
          )}

          {activePage === "safety" && <SafetyPage />}

        </div>

      </div>

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
  const [imageUrl, setImageUrl] = React.useState(null);
  const [status, setStatus] = React.useState("CONNECTING");
  const [error, setError] = React.useState("");
  const [refreshKey, setRefreshKey] = React.useState(0);

  const apiUrl = import.meta.env.VITE_CAMERA_API_URL;
  const token = import.meta.env.VITE_CAMERA_TOKEN;

  React.useEffect(() => {
    let cancelled = false;
    let timer;
    let currentObjectUrl = null;

    const loadFrame = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/frame`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const blob = await response.blob();

        if (!blob.type.startsWith("image/")) {
          throw new Error("The server did not return an image.");
        }

        const nextUrl = URL.createObjectURL(blob);

        if (cancelled) {
          URL.revokeObjectURL(nextUrl);
          return;
        }

        const previousUrl = currentObjectUrl;
        currentObjectUrl = nextUrl;

        setImageUrl(nextUrl);
        setStatus("LIVE");
        setError("");

        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Camera feed error:", err);
          setStatus("OFFLINE");

          if (err.message.includes("401")) {
            setError("Authentication failed. Check the camera token.");
          } else if (err.message.includes("404")) {
            setError("The /api/frame endpoint was not found.");
          } else {
            setError("Unable to receive frames from Render.");
          }
        }
      } finally {
        if (!cancelled) {
          timer = setTimeout(loadFrame, 0);
        }
      }
    };

    if (!apiUrl || !token) {
      setStatus("OFFLINE");
      setError("Missing VITE_CAMERA_API_URL or VITE_CAMERA_TOKEN in .env");
      return;
    }

    loadFrame();

    return () => {
      cancelled = true;
      clearTimeout(timer);

      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [apiUrl, token, refreshKey]);

  const reconnect = () => {
    setStatus("CONNECTING");
    setError("");
    setRefreshKey((key) => key + 1);
  };

  const isLive = status === "LIVE";

  return (
    <div className="page-block">
      <div className="page-heading">
        <div>
          <div className="small-label">AI VISION</div>
          <h1>Live Camera Feed</h1>
          <p>Visual monitoring from the ESP32-CAM through Render.</p>
        </div>

        <div className="dashboard-live">
          <span></span>
          {isLive ? "ESP32 LIVE" : status}
        </div>
      </div>

      <div className="camera-card">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="ESP32-CAM live feed"
            className="camera-stream"
          />
        ) : (
          <div className="camera-placeholder">
            <Video size={30} />
            <h4>
              {status === "CONNECTING"
                ? "Connecting to camera..."
                : "Camera feed unavailable"}
            </h4>
            <p>{error || "Waiting for the ESP32-CAM to upload a frame."}</p>
          </div>
        )}

        <div className="camera-overlay-top">
          <span className="rec-dot"></span>
          {isLive ? "LIVE" : status}
        </div>
      </div>

      <div className="tile-grid three">
        <StatTile
          label="Status"
          value={isLive ? "Streaming" : "Offline"}
          unit=""
          icon={<Video size={16} />}
        />

        <StatTile
          label="Connection"
          value="Render Cloud"
          unit=""
          icon={<Activity size={16} />}
        />

        <StatTile
          label="Refresh Rate"
          value={isLive ? "~2" : "--"}
          unit={isLive ? "requests/sec max" : ""}
          icon={<Camera size={16} />}
        />
      </div>

      {error && (
        <p role="alert" style={{ color: "#dc2626", marginTop: 12 }}>
          {error}
        </p>
      )}

      <button
        type="button"
        className="secondary-button"
        onClick={reconnect}
      >
        Reconnect Camera
      </button>
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

  const [view, setView] = React.useState("site"); // "site" | "auth" | "live"
  const [currentUser, setCurrentUser] = React.useState(null);
  const [pdfOpen, setPdfOpen] = React.useState(false);

  // Restore Firebase login after refresh and react to auth changes.
  React.useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!mounted) return;

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
        });
      } else {
        // Never keep an unverified account inside the dashboard.
        setCurrentUser(null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  function handleAuthSuccess(user) {
    setCurrentUser(user);
    setView("live");
  }

  async function handleLogout() {
    try {
      await signOut(firebaseAuth);
    } catch (err) {
      console.error("Firebase logout failed:", err);
    }

    setCurrentUser(null);
    setView("site");
  }

  if (view === "auth") {
    return (
      <div className="app">
        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          onBack={() => setView("site")}
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

        <Contact />

      </main>

      <Footer />

      <AnimatePresence>
        {pdfOpen && <PdfViewerModal onClose={() => setPdfOpen(false)} />}
      </AnimatePresence>

    </div>

  );
}