import { Activity, Bell, ShieldCheck } from "lucide-react";
import StatTile from "../components/StatTile.jsx";

export default function AlertsPage({ alerts = [] }) {
  const activeAlerts = alerts.filter((alert) => ["warning", "danger"].includes(String(alert.level).toLowerCase()));
  const normalAlert = alerts.find((alert) => String(alert.level).toLowerCase() === "good");
  const highest = activeAlerts.some((alert) => String(alert.level).toLowerCase() === "danger")
    ? "Danger"
    : activeAlerts.length ? "Warning" : "Normal";

  return (
    <div className="page-block">
      <div className="page-heading">
        <div><div className="small-label">MONITORING</div><h1>Alerts</h1><p>Current conditions from your connected sensors.</p></div>
      </div>
      <div className="tile-grid three">
        <StatTile label="Active Alerts" value={activeAlerts.length} unit="" icon={<Bell size={16} />} />
        <StatTile label="Highest Level" value={highest} unit="" icon={<ShieldCheck size={16} />} />
        <StatTile label="Last Check" value={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} unit="" icon={<Activity size={16} />} />
      </div>
      <section className="alerts-list user-alerts-list" aria-label="Current alert information">
        {activeAlerts.length === 0 ? (
          <div className="user-alert-empty"><ShieldCheck size={20} /><div><strong>{normalAlert ? "No active alerts" : "Waiting for sensor readings"}</strong><span>{normalAlert?.message || "Alert status will appear here when sensor data is available."}</span></div></div>
        ) : activeAlerts.map((alert, index) => (
          <div className="alert-row" key={`${alert.title}-${index}`}>
            <div className="alert-icon">{alert.icon}</div>
            <div><strong>{alert.title}</strong><span>{alert.message}</span></div>
            <div className={`alert-level level-${String(alert.level).toLowerCase()}`}>{alert.level}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
