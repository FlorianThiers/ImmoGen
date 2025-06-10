import { useState } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, TrendingUp, Home } from 'lucide-react';

import "./Notifications.css"
// Notification types voor een vastgoed-app
const NOTIFICATION_TYPES = {
  PROPERTY_VALUE_CHANGE: 'property_value_change',
  NEW_COMPARABLE_PROPERTY: 'new_comparable_property',
  MARKET_TREND: 'market_trend',
  VALUATION_COMPLETE: 'valuation_complete',
  SUBSCRIPTION_EXPIRY: 'subscription_expiry',
  SYSTEM_UPDATE: 'system_update',
  PRICE_ALERT: 'price_alert',
  REPORT_READY: 'report_ready'
};

// Mock data voor demonstratie
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: NOTIFICATION_TYPES.PROPERTY_VALUE_CHANGE,
    title: 'Waardestijging Gedetecteerd',
    message: 'Uw woning aan de Korenmarkt 15, Gent is in waarde gestegen met €12.000 (+4.8%)',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min geleden
    read: false,
    priority: 'high',
    data: { address: 'Korenmarkt 15, Gent', valueChange: 12000, percentage: 4.8 }
  },
  {
    id: 2,
    type: NOTIFICATION_TYPES.NEW_COMPARABLE_PROPERTY,
    title: 'Nieuwe Vergelijkbare Woning',
    message: 'Een soortgelijke woning in uw buurt is verkocht voor €285.000',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 uur geleden
    read: false,
    priority: 'medium',
    data: { address: 'Korte Meer 8, Gent', price: 285000 }
  },
  {
    id: 3,
    type: NOTIFICATION_TYPES.MARKET_TREND,
    title: 'Markttrend Update',
    message: 'De vastgoedmarkt in Gent toont een stijgende trend van 3.2% deze maand',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 uur geleden
    read: true,
    priority: 'low',
    data: { location: 'Gent', trend: 3.2 }
  },
  {
    id: 4,
    type: NOTIFICATION_TYPES.VALUATION_COMPLETE,
    title: 'Waardering Voltooid',
    message: 'Uw aangevraagde waardering voor Veldstraat 42 is klaar',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dag geleden
    read: true,
    priority: 'high',
    data: { address: 'Veldstraat 42, Gent', reportId: 'RPT-2024-001' }
  },
  {
    id: 5,
    type: NOTIFICATION_TYPES.SUBSCRIPTION_EXPIRY,
    title: 'Abonnement Verloopt Binnenkort',
    message: 'Uw Premium abonnement verloopt over 7 dagen',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dagen geleden
    read: false,
    priority: 'high',
    data: { daysLeft: 7, plan: 'Premium' }
  }
];

type NotificationIconProps = {
  type: string;
  priority: 'high' | 'medium' | 'low';
};

const NotificationIcon = ({ type, priority }: NotificationIconProps) => {
  const getIcon = () => {
    switch (type) {
      case NOTIFICATION_TYPES.PROPERTY_VALUE_CHANGE:
        return <TrendingUp size={20} />;
      case NOTIFICATION_TYPES.NEW_COMPARABLE_PROPERTY:
        return <Home size={20} />;
      case NOTIFICATION_TYPES.MARKET_TREND:
        return <TrendingUp size={20} />;
      case NOTIFICATION_TYPES.VALUATION_COMPLETE:
        return <CheckCircle size={20} />;
      case NOTIFICATION_TYPES.SUBSCRIPTION_EXPIRY:
        return <AlertTriangle size={20} />;
      case NOTIFICATION_TYPES.SYSTEM_UPDATE:
        return <Info size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getColor = () => {
    if (priority === 'high') return '#ef4444';
    if (priority === 'medium') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="notification-icon" style={{ color: getColor() }}>
      {getIcon()}
    </div>
  );
};

type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  data?: any;
};

type NotificationItemProps = {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: (notification: Notification) => void;
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onClick }: NotificationItemProps) => {
interface FormatTimeAgo {
    (timestamp: Date): string;
}

const formatTimeAgo: FormatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m geleden`;
    if (hours < 24) return `${hours}u geleden`;
    return `${days}d geleden`;
};

  return (
    <div 
      className={`notification-item ${!notification.read ? 'unread' : ''}`}
      onClick={() => onClick(notification)}
    >
      <div className="notification-content">
        <div className="notification-mini-header">
          <NotificationIcon type={notification.type} priority={notification.priority} />
          <div className="notification-meta">
            <span className="notification-time">{formatTimeAgo(notification.timestamp)}</span>
            {!notification.read && <span className="unread-dot"></span>}
          </div>
        </div>
        <h4 className="notification-title">{notification.title}</h4>
        <p className="notification-message">{notification.message}</p>
        {notification.data && (
          <div className="notification-data">
            {notification.type === NOTIFICATION_TYPES.PROPERTY_VALUE_CHANGE && (
              <span className="value-change positive">+€{notification.data.valueChange.toLocaleString()}</span>
            )}
          </div>
        )}
      </div>
      <div className="notification-actions">
        {!notification.read && (
          <button 
            className="mark-read-btn"
            title="Markeer als gelezen"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            <CheckCircle size={16} />
          </button>
        )}
        <button 
          className="delete-btn"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

const markAsRead = (id: number): void => {
    setNotifications((prev: Notification[]) => 
        prev.map((n: Notification) => n.id === id ? { ...n, read: true } : n)
    );
};

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'high') return n.priority === 'high';
    return true;
  });

const handleNotificationClick = (notification: Notification): void => {
    setSelectedNotification(notification);
    if (!notification.read) {
        markAsRead(notification.id);
    }
};

  return (
    <div className="notification-system">
      {/* Notification Bell */}
      <div className="notification-trigger">
        <button 
          className="notification-bell"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="notification-count combo">{unreadCount}</span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Meldingen</h3>
            <div className="notification-header-actions">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="mark-all-read">
                  Alles markeren als gelezen
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="close-btn-notification" title="Sluiten">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="notification-filters">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              Alle ({notifications.length})
            </button>
            <button 
              className={filter === 'unread' ? 'active' : ''}
              onClick={() => setFilter('unread')}
            >
              Ongelezen ({unreadCount})
            </button>
            <button 
              className={filter === 'high' ? 'active' : ''}
              onClick={() => setFilter('high')}
            >
              Belangrijk
            </button>
          </div>

          <div className="notification-list">
            {filteredNotifications.length === 0 ? (
              <div className="no-notifications">
                <Bell size={48} />
                <p>Geen meldingen</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onClick={handleNotificationClick}
                />
              ))
            )}
         {/* Notification Settings */}
            <div className="notification-settings">
                <h4>Meldingsinstellingen</h4>
                <div className="setting-item">
                <label>
                    <input type="checkbox" defaultChecked />
                    Waardeveranderingen
                </label>
                </div>
                <div className="setting-item">
                <label>
                    <input type="checkbox" defaultChecked />
                    Nieuwe vergelijkbare woningen
                </label>
                </div>
                <div className="setting-item">
                <label>
                    <input type="checkbox" defaultChecked />
                    Markttrends
                </label>
                </div>
                <div className="setting-item">
                <label>
                    <input type="checkbox" defaultChecked />
                    Rapporten voltooid
                </label>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="notification-modal-overlay" onClick={() => setSelectedNotification(null)}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedNotification.title}</h3>
              <button onClick={() => setSelectedNotification(null)}  className="close-btn-notification" title="Sluiten">
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              <p>{selectedNotification.message}</p>
              {selectedNotification.data && (
                <div className="notification-details">
                  {selectedNotification.type === NOTIFICATION_TYPES.PROPERTY_VALUE_CHANGE && (
                    <div className="property-details">
                      <h4>Details:</h4>
                      <p><strong>Adres:</strong> {selectedNotification.data.address}</p>
                      <p><strong>Waardeverandering:</strong> +€{selectedNotification.data.valueChange.toLocaleString()}</p>
                      <p><strong>Percentage:</strong> +{selectedNotification.data.percentage}%</p>
                    </div>
                  )}
                </div>
              )}
              <div className="modal-actions">
                <button className="btn-primary">Bekijk Volledig Rapport</button>
                <button className="btn-secondary">Delen</button>
              </div>
            </div>
          </div>
           
        </div>
      )}

    </div>
  );
};

export default NotificationCenter;