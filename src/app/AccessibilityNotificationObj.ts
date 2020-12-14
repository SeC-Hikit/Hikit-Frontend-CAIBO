import { AccessibilityNotification } from "./AccessibilityNotification"

export class AccessibilityNotificationObj implements AccessibilityNotification {
    constructor(public _id: string,
        public code: string,
        public description: string,
        public reportDate: Date,
        public resolutionDate: Date,
        public isMinor: boolean,
        public resolution: string
    ) { }


}