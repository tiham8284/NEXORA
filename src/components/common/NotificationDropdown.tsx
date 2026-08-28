import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from '../../types';
import { getNotifications, markNotificationAsRead, markAllNotificationsRead, subscribeToStore } from '../../services/storageService';
import { Bell, CheckCheck, AlertCircle, Wrench, ShieldAlert, Check } from 'lucide-react';

interface NotificationDropdownProps {
  onSelectIssue?: (issueId: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onSelectIssue }) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifs = () => {
    if (currentUser) {
      setNotifications(getNotifications(currentUser));
    }
  };

  useEffect(() => {
    loadNotifs();
    const unsubscribe = subscribeToStore(loadNotifs);
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleItemClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    if (notif.issueId && onSelectIssue) {
      onSelectIssue(notif.issueId);
      setIsOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead(currentUser || undefined);
  };

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'critical_alert':
      case 'iot_alert':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'assignment':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'reopened':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'verification':
        return <Check className="w-4 h-4 text-green-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-2xs"
        title="Notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-red-600 rounded-full border border-white dark:border-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-medium">No notifications</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex gap-3 ${
                    !notif.read ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 self-start">
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs ${!notif.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'} truncate`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{notif.message}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {notif.issueId && (
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-mono font-bold">
                          {notif.issueId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

