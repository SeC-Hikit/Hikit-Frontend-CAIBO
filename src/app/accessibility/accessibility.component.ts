import { Component, OnInit } from '@angular/core';
import { AccessibilityNotification } from '../AccessibilityNotification';
import { AccessibilityNotificationUnresolved } from '../AccessibilityNotificationUnresolved';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.css']
})
export class AccessibilityComponent implements OnInit {

  unresolvedNotifications : AccessibilityNotificationUnresolved[]
  itemsSolved : AccessibilityNotification[]

  constructor() { }

  ngOnInit(): void {
  }

}
