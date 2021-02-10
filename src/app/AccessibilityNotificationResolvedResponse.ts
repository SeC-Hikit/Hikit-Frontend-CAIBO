import { Status } from './Status';
import { AccessibilityNotification } from './AccessibilityNotification';

export interface AccessibilityNotificationResponse { 
    content : AccessibilityNotification[],
    status: Status,
    messages: string[]
}