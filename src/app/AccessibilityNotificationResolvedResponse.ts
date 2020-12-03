import { Status } from './Status';
import { AccessibilityNotification } from './AccessibilityNotification';

export interface AccessibilityNotificationResponse { 
    trailPreviews : AccessibilityNotification[],
    status: Status,
    messages: string[]
}