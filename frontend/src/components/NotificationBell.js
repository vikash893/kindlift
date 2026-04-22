import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, Check, CheckCheck, Trash2, ExternalLink } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

// ─── Notification type → icon/color map ───────────────────────────────────────
const TYPE_CONFIG = {
  ride_accepted:        { emoji: '✅', color: 'bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500' },
  ride_rejected:        { emoji: '❌', color: 'bg-red-50 border-red-100', dot: 'bg-red-500' },
  ride_completed:       { emoji: '🎉', color: 'bg-blue-50 border-blue-100', dot: 'bg-blue-500' },
  ride_request:         { emoji: '🚗', color: 'bg-amber-50 border-amber-100', dot: 'bg-amber-500' },
  verification_approved:{ emoji: '🎊', color: 'bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500' },
  verification_rejected:{ emoji: '⚠️', color: 'bg-red-50 border-red-100', dot: 'bg-red-500' },
  new_verification:     { emoji: '📋', color: 'bg-violet-50 border-violet-100', dot: 'bg-violet-500' },
  new_user:             { emoji: '👤', color: 'bg-blue-50 border-blue-100', dot: 'bg-blue-500' },
  new_feedback:         { emoji: '💬', color: 'bg-indigo-50 border-indigo-100', dot: 'bg-indigo-500' },
  new_rating:           { emoji: '⭐', color: 'bg-amber-50 border-amber-100', dot: 'bg-amber-500' },
  friend_request:       { emoji: '👋', color: 'bg-purple-50 border-purple-100', dot: 'bg-purple-500' },
  friend_accepted:      { emoji: '🤝', color: 'bg-teal-50 border-teal-100', dot: 'bg-teal-500' },
  dm_message:           { emoji: '💬', color: 'bg-cyan-50 border-cyan-100', dot: 'bg-cyan-500' },
  system:               { emoji: '📢', color: 'bg-gray-50 border-gray-100', dot: 'bg-gray-500' },
};

// ─── Single Notification Item ─────────────────────────────────────────────────
const NotificationItem = ({ notif, onMarkRead, onDelete }) => {
  const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
  const isUnread = !notif.read;

  return (
    <div
      className={`group relative flex gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
        isUnread ? config.color : 'bg-white border-gray-100 opacity-75'
      }`}
      onClick={() => !notif.read && onMarkRead(notif._id)}
    >
      {/* Unread indicator dot */}
      {isUnread && (
        <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
      )}

      {/* Emoji icon */}
      <div className="flex-shrink-0 text-xl w-8 h-8 flex items-center justify-center">
        {config.emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <p className={`text-sm font-semibold truncate ${isUnread ? 'text-brand-dark' : 'text-brand-muted'}`}>
          {notif.title}
        </p>
        <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">
          {notif.message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-brand-muted/60">
            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
          </span>
          {notif.actionUrl && (
            <Link
              to={notif.actionUrl}
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] font-semibold text-brand-accent hover:underline flex items-center gap-0.5"
            >
              View <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Actions (visible on hover) */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isUnread && (
          <button
            onClick={(e) => { e.stopPropagation(); onMarkRead(notif._id); }}
            className="p-1 rounded-lg bg-white shadow-sm hover:bg-emerald-50 text-brand-muted hover:text-emerald-600 transition-colors"
            title="Mark as read"
          >
            <Check className="h-3 w-3" />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(notif._id); }}
          className="p-1 rounded-lg bg-white shadow-sm hover:bg-red-50 text-brand-muted hover:text-red-500 transition-colors"
          title="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

// ─── Skeleton Notification ────────────────────────────────────────────────────
const NotificationSkeleton = () => (
  <div className="flex gap-3 p-3 rounded-xl border border-gray-100 animate-pulse">
    <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded-full w-3/4" />
      <div className="h-2.5 bg-gray-100 rounded-full w-full" />
      <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
    </div>
  </div>
);

// ─── Main NotificationBell component ─────────────────────────────────────────
export const NotificationBell = () => {
  const { notifications, unreadCount, loading, panelOpen, setPanelOpen, openPanel, markRead, markAllRead, deleteNotification } = useNotifications();
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!panelOpen) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [panelOpen, setPanelOpen]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        id="notification-bell"
        onClick={() => panelOpen ? setPanelOpen(false) : openPanel()}
        className={`relative p-2 rounded-full transition-all duration-200 ${
          panelOpen ? 'bg-brand-accent/10 text-brand-accent' : 'text-brand-muted hover:bg-brand-dark/5 hover:text-brand-dark'
        }`}
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full shadow-sm animate-bounce-once">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {panelOpen && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[200] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-brand-dark/[0.02] to-transparent">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-brand-accent" />
              <span className="font-display font-bold text-sm text-brand-dark">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[10px] font-semibold text-brand-accent hover:bg-brand-accent/10 px-2 py-1 rounded-lg transition-colors"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
              <button
                onClick={() => setPanelOpen(false)}
                className="p-1.5 rounded-lg hover:bg-brand-dark/5 text-brand-muted hover:text-brand-dark transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-[420px] overflow-y-auto overscroll-contain">
            {loading ? (
              <div className="p-3 space-y-2">
                {[...Array(4)].map((_, i) => <NotificationSkeleton key={i} />)}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-3">
                  <Bell className="h-7 w-7 text-brand-accent/40" />
                </div>
                <p className="font-display font-bold text-sm text-brand-dark">All caught up!</p>
                <p className="text-xs text-brand-muted mt-1">No notifications yet. We'll alert you when something happens.</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {notifications.map(notif => (
                  <NotificationItem
                    key={notif._id}
                    notif={notif}
                    onMarkRead={markRead}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-brand-dark/[0.01] text-center">
              <span className="text-[10px] text-brand-muted">
                Showing {notifications.length} most recent • Auto-expires after 90 days
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
