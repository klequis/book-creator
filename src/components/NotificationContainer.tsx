import { Component, For, Show } from 'solid-js';
import { getNotifications, dismissNotification } from '../utils/notifications';
import './NotificationContainer.css';

export const NotificationContainer: Component = () => {
  const notifications = getNotifications();

  return (
    <div class="notification-container">
      <For each={notifications()}>
        {(notification) => (
          <div 
            class={`notification notification-${notification.type}`}
            onClick={() => dismissNotification(notification.id)}
          >
            <span class="notification-icon">
              <Show when={notification.type === 'success'}>✓</Show>
              <Show when={notification.type === 'error'}>✕</Show>
              <Show when={notification.type === 'info'}>ℹ</Show>
            </span>
            <span class="notification-message">{notification.message}</span>
          </div>
        )}
      </For>
    </div>
  );
};
