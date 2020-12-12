export interface AccessibilityNotification { 
    _id: string,
    code: string,
    description: string,
    reportDate: Date,
    resolutionDate: Date,
    isMinor: boolean,
    resolution: string
}