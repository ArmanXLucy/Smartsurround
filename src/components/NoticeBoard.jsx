import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  User,
  Radio,
  ExternalLink,
  X,
  AlertTriangle,
  Info,
  ShieldAlert,
} from "lucide-react";

function formatNoticeTime(timestamp) {
  if (!timestamp) return "Recently";
  const date = new Date(Number(timestamp));
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffSec = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getSeverityBadge(severity) {
  const s = String(severity || "info").toLowerCase();
  if (s === "danger") {
    return <span className="notice-badge danger">Danger</span>;
  }
  if (s === "warning") {
    return <span className="notice-badge warning">Warning</span>;
  }
  if (s === "success") {
    return <span className="notice-badge success">Success</span>;
  }
  return <span className="notice-badge info">Info</span>;
}

export function NoticeDetailModal({ notice, onClose }) {
  if (!notice) return null;

  return (
    <div className="account-confirm-backdrop" role="presentation" onClick={onClose}>
      <div
        className="notice-detail-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="notice-modal-close"
          onClick={onClose}
          aria-label="Close notice details"
        >
          <X size={18} />
        </button>

        {notice.imageUrl && (
          <div className="notice-detail-image-wrap">
            <img
              src={notice.imageUrl}
              alt={notice.title}
              className="notice-detail-image"
            />
          </div>
        )}

        <div className="notice-detail-body">
          <div className="notice-detail-pills">
            <span className="notice-badge category">{notice.category || "General"}</span>
            {getSeverityBadge(notice.severity)}
          </div>

          <h3 id="notice-detail-title" className="notice-detail-title">
            {notice.title}
          </h3>

          <p className="notice-detail-desc">{notice.description}</p>

          <div className="notice-detail-meta-grid">
            {notice.locationName && (
              <div className="notice-meta-item">
                <MapPin size={14} className="notice-meta-icon" />
                <span>
                  <strong>Location:</strong> {notice.locationName}
                </span>
              </div>
            )}

            {Number.isFinite(notice.latitude) && Number.isFinite(notice.longitude) && (
              <div className="notice-meta-item">
                <MapPin size={14} className="notice-meta-icon" />
                <span>
                  <strong>GPS:</strong> {notice.latitude}, {notice.longitude}
                </span>
              </div>
            )}

            <div className="notice-meta-item">
              <User size={14} className="notice-meta-icon" />
              <span>
                <strong>Posted by:</strong> {notice.createdBy || "Admin"}
              </span>
            </div>

            <div className="notice-meta-item">
              <Calendar size={14} className="notice-meta-icon" />
              <span>
                <strong>Date:</strong>{" "}
                {new Date(Number(notice.createdAt) || Date.now()).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="notice-detail-footer">
          <button type="button" className="primary-button small" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NoticeBoard({ notices = [] }) {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [viewAllOpen, setViewAllOpen] = useState(false);

  const displayNotices = notices.slice(0, 4);

  return (
    <>
      <section className="overview-noticeboard" aria-labelledby="noticeboard-heading">
        <div className="overview-alerts-heading">
          <div>
            <div className="small-label">COMMUNITY & SAFETY</div>
            <h2 id="noticeboard-heading">Notice Board</h2>
          </div>
          {notices.length > 4 && (
            <button
              type="button"
              className="noticeboard-viewall-btn"
              onClick={() => setViewAllOpen(true)}
            >
              View All ({notices.length})
            </button>
          )}
        </div>

        {notices.length === 0 ? (
          <div className="noticeboard-empty">
            <Radio size={18} />
            <span>No notices available</span>
          </div>
        ) : (
          <div className="noticeboard-grid">
            {displayNotices.map((n) => (
              <article
                key={n.id}
                className="notice-card"
                onClick={() => setSelectedNotice(n)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedNotice(n)}
              >
                {n.imageUrl ? (
                  <div className="notice-card-thumb">
                    <img src={n.imageUrl} alt={n.title} loading="lazy" />
                  </div>
                ) : (
                  <div className="notice-card-thumb-placeholder">
                    <Radio size={22} />
                  </div>
                )}

                <div className="notice-card-content">
                  <div className="notice-card-header">
                    <div className="notice-card-tags">
                      <span className="notice-badge category">{n.category || "General"}</span>
                      {getSeverityBadge(n.severity)}
                    </div>
                    <span className="notice-card-time">{formatNoticeTime(n.createdAt)}</span>
                  </div>

                  <strong className="notice-card-title">{n.title}</strong>
                  <p className="notice-card-desc">{n.description}</p>

                  <div className="notice-card-footer">
                    {Number.isFinite(n.latitude) && Number.isFinite(n.longitude) ? (
                      <span className="notice-gps-tag">
                        <MapPin size={12} />
                        GPS: {n.latitude.toFixed(4)}, {n.longitude.toFixed(4)}
                      </span>
                    ) : n.locationName ? (
                      <span className="notice-gps-tag">
                        <MapPin size={12} />
                        {n.locationName}
                      </span>
                    ) : null}
                    <span className="notice-author">By {n.createdBy || "Admin"}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <NoticeDetailModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}

      {/* View All Notices Modal */}
      {viewAllOpen && (
        <div className="account-confirm-backdrop" role="presentation" onClick={() => setViewAllOpen(false)}>
          <div
            className="notice-viewall-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-notices-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notice-viewall-header">
              <div>
                <div className="small-label">ALL ANNOUNCEMENTS</div>
                <h3 id="all-notices-title">All Notices ({notices.length})</h3>
              </div>
              <button
                type="button"
                className="notice-modal-close"
                onClick={() => setViewAllOpen(false)}
                aria-label="Close all notices"
              >
                <X size={18} />
              </button>
            </div>

            <div className="notice-viewall-list">
              {notices.map((n) => (
                <article
                  key={n.id}
                  className="notice-card"
                  onClick={() => {
                    setViewAllOpen(false);
                    setSelectedNotice(n);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {n.imageUrl ? (
                    <div className="notice-card-thumb">
                      <img src={n.imageUrl} alt={n.title} loading="lazy" />
                    </div>
                  ) : (
                    <div className="notice-card-thumb-placeholder">
                      <Radio size={20} />
                    </div>
                  )}
                  <div className="notice-card-content">
                    <div className="notice-card-header">
                      <div className="notice-card-tags">
                        <span className="notice-badge category">{n.category || "General"}</span>
                        {getSeverityBadge(n.severity)}
                      </div>
                      <span className="notice-card-time">{formatNoticeTime(n.createdAt)}</span>
                    </div>
                    <strong className="notice-card-title">{n.title}</strong>
                    <p className="notice-card-desc">{n.description}</p>
                    <div className="notice-card-footer">
                      {Number.isFinite(n.latitude) && Number.isFinite(n.longitude) && (
                        <span className="notice-gps-tag">
                          <MapPin size={12} />
                          GPS: {n.latitude.toFixed(4)}, {n.longitude.toFixed(4)}
                        </span>
                      )}
                      <span className="notice-author">By {n.createdBy || "Admin"}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
