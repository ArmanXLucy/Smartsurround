/**
 * notificationService.js
 * -----------------------
 * Shared notification and notice board subsystem for SmartSurround.
 * Backed by Firebase Realtime Database and Supabase Storage (for images).
 *
 * Provides:
 * - Real-time notification synchronization for Users and Admins
 * - Real-time Notice Board synchronization
 * - Web Audio API synthesized notification sounds (INFO, WARNING, DANGER, SUCCESS)
 * - Autoplay permission handling & sound toggle
 * - Deduplicated sensor-to-notification pipeline
 * - Notice publishing, editing, and soft deletion
 * - Alert clearing persistence
 */

import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  get,
} from "firebase/database";
import { db } from "../firebaseClient";
import { uploadToSupabase } from "../supabaseClient";

// ---------------------------------------------------------------------------
// 1. Web Audio API Sound Engine
// Synthesized audio ensures zero external asset dependencies, zero 404s,
// instant playback, and distinct sound signatures per severity.
// ---------------------------------------------------------------------------

let audioContext = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) {
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

// Unlock audio on the first user interaction anywhere on the document
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener("click", unlockAudio, { once: true, passive: true });
  window.addEventListener("keydown", unlockAudio, { once: true, passive: true });
  window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
}

export function isSoundEnabled() {
  try {
    const raw = localStorage.getItem("smartsurround_sound_enabled");
    if (raw === null) return true; // Default ON
    return raw === "true";
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled) {
  try {
    localStorage.setItem("smartsurround_sound_enabled", String(enabled));
  } catch {
    // Browser storage may be unavailable in private or restricted contexts.
  }
}

export function playNotificationSound(severityOrType = "info") {
  if (!isSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== "running") {
      // Audio is suspended / waiting for gesture; respect browser autoplay policy
      return;
    }

    const t = ctx.currentTime;
    const kind = String(severityOrType || "info").toLowerCase();

    if (kind === "danger" || kind === "critical" || kind === "safety") {
      // DANGER / URGENT: 3 rapid warning pulses (alternating 820Hz and 620Hz)
      [0, 0.11, 0.22].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(idx % 2 === 0 ? 820 : 620, t + delay);
        gain.gain.setValueAtTime(0.18, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 0.1);
      });
    } else if (kind === "warning" || kind === "camera" || kind === "device") {
      // WARNING: 2 distinct medium warning tones (520Hz -> 420Hz)
      [0, 0.15].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(idx === 0 ? 520 : 420, t + delay);
        gain.gain.setValueAtTime(0.2, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.13);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 0.14);
      });
    } else if (kind === "success") {
      // SUCCESS: short bright major chord chime (523Hz -> 659Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, t);
      osc.frequency.exponentialRampToValueAtTime(659.25, t + 0.12);
      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    } else {
      // INFO / NOTICE: soft pleasant chime (587Hz -> 880Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.09);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    }
  } catch (err) {
    console.debug("Audio playback ignored:", err);
  }
}

const NOTIFICATIONS_CLEARED_STORAGE_KEY = "smartsurround_cleared_notifications";

export function getClearedNotificationsState(userId = "guest") {
  try {
    const raw = localStorage.getItem(`${NOTIFICATIONS_CLEARED_STORAGE_KEY}_${userId}`);
    if (!raw) return { clearedAt: 0, clearedIds: [] };
    return JSON.parse(raw);
  } catch {
    return { clearedAt: 0, clearedIds: [] };
  }
}

export function saveClearedNotificationsState(userId = "guest", ids = []) {
  try {
    const existing = getClearedNotificationsState(userId);
    const set = new Set([...(existing.clearedIds || []), ...ids]);
    const state = {
      clearedAt: Date.now(),
      clearedIds: Array.from(set),
    };
    localStorage.setItem(
      `${NOTIFICATIONS_CLEARED_STORAGE_KEY}_${userId}`,
      JSON.stringify(state)
    );
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("smartsurround_notifications_cleared", { detail: { userId, state } }));
    }
    return state;
  } catch {
    return { clearedAt: Date.now(), clearedIds: ids };
  }
}

export async function clearAllNotificationsForUser(notifications, userId = "guest") {
  const ids = Array.isArray(notifications) ? notifications.map((n) => n.id) : [];
  const state = saveClearedNotificationsState(userId, ids);
  try {
    // Keep shared event records intact while recording a per-user clear marker
    // on each visible item. This uses the existing notification write model.
    const updates = {};
    ids.forEach((id) => {
      updates[`notifications/${id}/clearedBy/${userId}`] = true;
    });
    updates[`notificationState/${userId}`] = state;
    if (Object.keys(updates).length > 0) await update(ref(db), updates);
  } catch (err) {
    // Local state remains a safe fallback when an older Firebase ruleset does
    // not yet include the per-user notificationState path.
    console.warn("Unable to sync notification clear state:", err);
  }
}

/**
 * Subscribe to notifications in Firebase Realtime Database.
 * Accurately filters based on recipient role (user vs admin), handles
 * read status per user, respects per-user cleared state, and triggers audio only for genuinely NEW incoming items.
 */
export function subscribeToNotifications({ userId, isAdmin = false, onUpdate }) {
  const notifRef = ref(db, "notifications");
  const effectiveUserId = userId || (isAdmin ? "admin" : "guest");
  let isInitialLoad = true;
  const processedIds = new Set();
  let latestRawSnapshot = {};
  let latestClearedState = getClearedNotificationsState(effectiveUserId);

  const processAndEmit = (data) => {
    const clearedState = latestClearedState;
    const clearedIdsSet = new Set(clearedState.clearedIds || []);
    const clearedAt = Number(clearedState.clearedAt) || 0;

    const list = [];

    Object.entries(data || {}).forEach(([key, value]) => {
      if (!value || typeof value !== "object") return;
      const id = value.id || key;

      // Check if this item was cleared by this user
      if (clearedIdsSet.has(id)) return;
      if (clearedAt > 0 && Number(value.createdAt || 0) <= clearedAt) return;
      if (value.clearedBy && value.clearedBy[effectiveUserId]) return;

      // Role & User targeting filter
      let isForMe = false;
      if (isAdmin) {
        // Admin receives admin-directed notifications and broadcast notices
        if (value.recipientType === "admin" || value.recipientType === "all") {
          isForMe = true;
        }
      } else if (userId) {
        // User receives notices for all, or items directly targeted to them
        if (value.recipientType === "all") {
          isForMe = true;
        } else if (value.recipientType === "user") {
          if (value.recipientId === userId) {
            isForMe = true;
          } else if (Array.isArray(value.recipientIds) && value.recipientIds.includes(userId)) {
            isForMe = true;
          }
        }
      }

      if (!isForMe) return;

      // Compute read state for this specific user/admin
      const isRead =
        Boolean(value.read) ||
        Boolean(value.readBy && (userId ? value.readBy[userId] : value.readBy["admin"]));

      list.push({
        ...value,
        id,
        read: isRead,
      });
    });

    // Sort newest first
    list.sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));

    // Handle sound for genuinely NEW items arriving after initial load
    if (!isInitialLoad) {
      list.forEach((item) => {
        if (!processedIds.has(item.id) && !item.read) {
          playNotificationSound(item.soundType || item.severity || "info");
        }
      });
    }

    list.forEach((item) => processedIds.add(item.id));
    isInitialLoad = false;

    onUpdate(list);
  };

  const handleClearedEvent = (e) => {
    if (e.detail?.userId === effectiveUserId) {
      latestClearedState = e.detail.state || getClearedNotificationsState(effectiveUserId);
      processAndEmit(latestRawSnapshot);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("smartsurround_notifications_cleared", handleClearedEvent);
  }

  const unsubscribe = onValue(
    notifRef,
    (snapshot) => {
      latestRawSnapshot = snapshot.val() || {};
      processAndEmit(latestRawSnapshot);
    },
    (err) => {
      console.warn("Notifications listener warning:", err);
      onUpdate([]);
    }
  );

  const unsubscribeClearedState = onValue(
    ref(db, `notificationState/${effectiveUserId}`),
    (snapshot) => {
      latestClearedState = snapshot.val() || getClearedNotificationsState(effectiveUserId);
      processAndEmit(latestRawSnapshot);
    },
    () => {
      // Local storage remains the fallback for projects with older rules.
    }
  );

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("smartsurround_notifications_cleared", handleClearedEvent);
    }
    unsubscribe();
    unsubscribeClearedState();
  };
}

/**
 * Create a new notification record in Firebase Realtime Database.
 * Returns null on failure (non-critical callers can ignore the failure).
 * For callers that need error propagation, await and check return value,
 * or use the throwing variant inside publishNotice.
 */
export async function createNotification(notifData) {
  try {
    const notifCollection = ref(db, "notifications");
    const newRef = push(notifCollection);
    const id = newRef.key;

    const payload = {
      id,
      type: notifData.type || "alert",
      title: notifData.title || "Notification",
      message: notifData.message || "",
      severity: notifData.severity || "info",
      recipientType: notifData.recipientType || "all",
      recipientId: notifData.recipientId || null,
      recipientIds: notifData.recipientIds || null,
      noticeId: notifData.noticeId || null,
      createdAt: notifData.createdAt || Date.now(),
      read: false,
      readBy: {},
      soundType: notifData.soundType || notifData.severity || "info",
    };

    await set(newRef, payload);
    return id;
  } catch (err) {
    console.error("Failed to create notification:", err);
    return null;
  }
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationAsRead(notificationId, userId = "admin") {
  if (!notificationId) return;
  try {
    const targetRef = ref(db, `notifications/${notificationId}`);
    const snapshot = await get(targetRef);
    if (!snapshot.exists()) return;

    const val = snapshot.val();
    const updates = {};

    // For direct user notifications, mark read: true
    if (val.recipientType === "user" && val.recipientId === userId) {
      updates.read = true;
    }
    // Record readBy[userId] = true so broadcast notices track per user
    updates[`readBy/${userId}`] = true;

    await update(targetRef, updates);
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
  }
}

/**
 * Mark all notifications in the provided list as read for this user.
 */
export async function markAllNotificationsAsRead(notifications, userId = "admin") {
  if (!Array.isArray(notifications) || notifications.length === 0) return;
  try {
    const rootUpdates = {};
    notifications.forEach((n) => {
      if (!n.read) {
        if (n.recipientType === "user" && n.recipientId === userId) {
          rootUpdates[`notifications/${n.id}/read`] = true;
        }
        rootUpdates[`notifications/${n.id}/readBy/${userId}`] = true;
      }
    });

    if (Object.keys(rootUpdates).length > 0) {
      await update(ref(db), rootUpdates);
    }
  } catch (err) {
    console.error("Failed to mark all as read:", err);
  }
}

// ---------------------------------------------------------------------------
// 3. Realtime Notices Subscription & Management
// ---------------------------------------------------------------------------

/**
 * Subscribe to notices in Firebase Realtime Database.
 */
export function subscribeToNotices({ userId, isAdmin = false, onUpdate }) {
  const noticesRef = ref(db, "notices");

  const unsubscribe = onValue(
    noticesRef,
    (snapshot) => {
      const data = snapshot.val() || {};
      const list = [];

      Object.entries(data).forEach(([key, val]) => {
        if (!val || typeof val !== "object") return;
        const id = val.id || key;

        // If not admin, hide archived notices
        if (!isAdmin && val.archived === true) return;

        // Filter by target audience
        if (!isAdmin && userId) {
          if (val.audienceType === "specific" && val.targetUserId !== userId) {
            return;
          }
          if (
            val.audienceType === "selected" &&
            Array.isArray(val.targetUserIds) &&
            !val.targetUserIds.includes(userId)
          ) {
            return;
          }
        }

        list.push({
          ...val,
          id,
        });
      });

      // Newest first
      list.sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));

      onUpdate(list);
    },
    (err) => {
      console.warn("Notices listener warning:", err);
      onUpdate([]);
    }
  );

  return unsubscribe;
}

/**
 * Upload an image file for a notice to Supabase Storage.
 * Falls back safely to Base64 data URL if the upload fails for any reason.
 */
export async function uploadNoticeImage(file) {
  if (!file) return null;

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPG, PNG, WEBP, or GIF image.");
  }

  // 5 MB limit
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("Image file size exceeds the 5 MB limit.");
  }

  try {
    // Upload to Supabase Storage bucket "notice-images"
    const publicUrl = await uploadToSupabase(file);
    return publicUrl;
  } catch (storageErr) {
    console.warn("Supabase Storage upload failed — using base64 fallback:", storageErr);
    // Fallback: encode as base64 data URL so publishing still succeeds
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to process image file."));
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Publish a new notice by Admin.
 * Automatically saves notice to /notices and creates an associated notification in /notifications.
 * Returns an object with noticeId and recipientCount for accurate success messaging.
 */
export async function publishNotice(noticeData, imageFile = null) {
  let imageUrl = noticeData.imageUrl || null;
  if (imageFile) {
    imageUrl = await uploadNoticeImage(imageFile);
  }

  const noticesCollection = ref(db, "notices");
  const newNoticeRef = push(noticesCollection);
  const noticeId = newNoticeRef.key;

  const createdAt = Date.now();
  const noticeRecord = {
    id: noticeId,
    title: noticeData.title.trim(),
    description: noticeData.description.trim(),
    imageUrl: imageUrl || null,
    category: noticeData.category || "Infrastructure",
    severity: noticeData.severity || "Warning",
    locationName: noticeData.locationName ? noticeData.locationName.trim() : "",
    latitude: noticeData.latitude ? Number(noticeData.latitude) : null,
    longitude: noticeData.longitude ? Number(noticeData.longitude) : null,
    audienceType: noticeData.audienceType || "all", // "all" | "specific" | "selected"
    targetUserId: noticeData.targetUserId || null,
    targetUserIds: Array.isArray(noticeData.targetUserIds) ? noticeData.targetUserIds : [],
    createdBy: noticeData.createdBy || "SmartSurround Admin",
    createdAt,
    updatedAt: createdAt,
    archived: false,
  };

  // Step 1: Save notice record
  await set(newNoticeRef, noticeRecord);

  // Step 2: Create notification - recipientType for the notification
  const notifRecipientType =
    noticeRecord.audienceType === "all" ? "all" : "user";
  const notifRecipientId =
    noticeRecord.audienceType === "specific" ? noticeRecord.targetUserId : null;
  const notifRecipientIds =
    noticeRecord.audienceType === "selected" ? noticeRecord.targetUserIds : null;

  // Determine recipient count for success message
  const recipientCount =
    noticeRecord.audienceType === "all"
      ? null // "all users" — actual count unknown client-side
      : noticeRecord.audienceType === "specific"
      ? 1
      : Array.isArray(noticeRecord.targetUserIds)
      ? noticeRecord.targetUserIds.length
      : 0;

  // Step 2: Create notification — throws if Firebase write fails
  // (notice is already saved; caller sees real error)
  const notifCollection = ref(db, "notifications");
  const newNotifRef = push(notifCollection);
  const notifId = newNotifRef.key;
  await set(newNotifRef, {
    id: notifId,
    type: "notice",
    title: `Notice: ${noticeRecord.title}`,
    message: noticeRecord.description.length > 120
      ? `${noticeRecord.description.slice(0, 117)}...`
      : noticeRecord.description,
    severity: String(noticeRecord.severity).toLowerCase(),
    recipientType: notifRecipientType,
    recipientId: notifRecipientId,
    recipientIds: notifRecipientIds,
    noticeId,
    createdAt,
    read: false,
    readBy: {},
    soundType: String(noticeRecord.severity).toLowerCase() === "danger" ? "danger" : "info",
  });

  return { noticeId, audienceType: noticeRecord.audienceType, recipientCount };
}

/**
 * Update an existing notice.
 */
export async function updateNotice(noticeId, updates, newImageFile = null) {
  if (!noticeId) return;
  let finalUpdates = { ...updates, updatedAt: Date.now() };

  if (newImageFile) {
    finalUpdates.imageUrl = await uploadNoticeImage(newImageFile);
  }

  const targetRef = ref(db, `notices/${noticeId}`);
  await update(targetRef, finalUpdates);
}

/**
 * Soft delete (archive) a notice.
 */
export async function archiveNotice(noticeId, archived = true) {
  if (!noticeId) return;
  const targetRef = ref(db, `notices/${noticeId}`);
  await update(targetRef, { archived, updatedAt: Date.now() });
}

/**
 * Delete a notice permanently.
 */
export async function deleteNoticePermanently(noticeId) {
  if (!noticeId) return;
  const targetRef = ref(db, `notices/${noticeId}`);
  await remove(targetRef);
}

// ---------------------------------------------------------------------------
// 4. Alert Clearing Helpers
// ---------------------------------------------------------------------------

const ALERTS_CLEARED_STORAGE_KEY = "smartsurround_cleared_alerts";

export function getClearedAlertsState(userId = "guest") {
  try {
    const raw = localStorage.getItem(`${ALERTS_CLEARED_STORAGE_KEY}_${userId}`);
    if (!raw) return { clearedAt: 0, clearedTitles: [] };
    return JSON.parse(raw);
  } catch {
    return { clearedAt: 0, clearedTitles: [] };
  }
}

export function saveClearedAlertsState(userId = "guest", titles = []) {
  try {
    const state = {
      clearedAt: Date.now(),
      clearedTitles: titles,
    };
    localStorage.setItem(
      `${ALERTS_CLEARED_STORAGE_KEY}_${userId}`,
      JSON.stringify(state)
    );
    return state;
  } catch {
    return { clearedAt: Date.now(), clearedTitles: titles };
  }
}
