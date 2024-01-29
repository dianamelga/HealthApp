import {useEffect, useState} from 'react';
import WatchConnectivityManager, {
  WatchConnectivityEvents,
} from '../../modules/applewatch/WatchConnectivityManager';

export const useAppleWatch = () => {
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    // Add the listener when needed
    const subscription = WatchConnectivityEvents.addListener(
      'onNotificationMessageChanged',
      message => {
        console.log('Notification Message Changed:', message?.text);
        setNotificationMessage(message?.text);
      },
    );

    return () => subscription.remove();
  }, []);

  const sendMessageToWatch = (message: string) => {
    WatchConnectivityManager.sendMessage(message);
  };

  return {
    sendMessageToWatch,
    watchMessage: notificationMessage,
  };
};
