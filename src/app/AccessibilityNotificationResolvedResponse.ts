import { Status } from './Status';
import { AccessibilityNotification } from './AccessibilityNotification';

export interface AccessibilityNotificationResponse { 
    accessibilityNotifications : AccessibilityNotification[],
    status: Status,
    messages: string[]
}