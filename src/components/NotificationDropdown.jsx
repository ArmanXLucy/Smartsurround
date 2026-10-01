import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  AlertTriangle,
  Radio,
  Flame,
  Camera,
  Activity,
  ShieldCheck,
  Check,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  isSoundEnabled,
  setSoundEnabled,
} from "../lib/notificationService";

function formatRelativeTime(timestamp) {
  if (!timestamp) return "just now";
  const diffSec = Math.max(0, Math.floor((Date.now() - Number(timestamp)) / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getNotificationIcon(type, severity) {
  const t = String(type || "").toLowerCase();
  const s = String(severity || "").toLowerCase();

  if (t === "safety" || s === "danger" || t === "fire") {
    return <Flame size={15} className="notif-icon danger" />;
  }
  if (t === "alert" || s === "warning") {
    return <AlertTriangle size={15} className="notif-icon warning" />;
  }
  if (t === "camera") {
    return <Camera size={15} className="notif-icon info" />;
  }
  if (t === "device") {
    return <Radio size={15} className="notif-icon muted" />;
  }
  if (t === "notice") {
    return <Bell size={15} className="notif-icon primary" />;
  }
  return <Activity size={15} className="notif-icon info" />;
}

export default function NotificationDropdown({
  notifications = [],
  userId = null,
  isAdmin = false,
  onNavigate = null,
  onOpenNotice = null,
}) {
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(notifications, userId || (isAdmin ? "admin" : "guest"));
  };

  const handleClickItem = async (notif) => {
    await markNotificationAsRead(notif.id, userId || (isAdmin ? "admin" : "guest"));
    setOpen(false);

    if (notif.type === "notice" && notif.noticeId && onOpenNotice) {
      onOpenNotice(notif.noticeId);
    } else if (notif.type === "camera" && onNavigate) {
      onNavigate(isAdmin ? "monitoring" : "camera");
    } else if (notif.type === "device" && onNavigate) {
      onNavigate(isAdmin ? "monitoring" : "overview");
    } else if (notif.type === "alert" && onNavigate) {
      onNavigate("overview");
    }
  };

  return (
    <div className="notif-bell-container" ref={dropdownRef}>
      <button
        type="button"
        className="notif-bell-button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown-menu" role="menu">
          <div className="notif-dropdown-header">
            <div className="notif-header-title">
              <strong>Notifications</strong>
              {unreadCount > 0 && (
                <span className="notif-unread-pill">{unreadCount} new</span>
              )}
            </div>
            <div className="notif-header-actions">
              <button
                type="button"
                className="notif-sound-toggle"
                onClick={handleToggleSound}
                title={soundOn ? "Mute notification sounds" : "Enable notification sounds"}
                aria-label={soundOn ? "Mute notification sounds" : "Enable notification sounds"}
              >
                {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="notif-mark-all"
                  onClick={handleMarkAllRead}
                >
                  <Check size={13} />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>
          </div>

          <div className="notif-dropdown-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <ShieldCheck size={20} />
                <span>No new notifications</span>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`notif-item ${n.read ? "read" : "unread"}`}
                  onClick={() => handleClickItem(n)}
                >
                  <span className="notif-item-icon">
                    {getNotificationIcon(n.type, n.severity)}
                  </span>
                  <div className="notif-item-body">
                    <div className="notif-item-head">
                      <strong className="notif-item-title">{n.title}</strong>
                      <span className="notif-item-time">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="notif-item-message">{n.message}</p>
                  </div>
                  {!n.read && <span className="notif-unread-dot" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
