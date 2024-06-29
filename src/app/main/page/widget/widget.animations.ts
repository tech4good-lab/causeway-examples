import { trigger, group, query, animateChild, state, style, animate, transition, keyframes } from '@angular/animations';

export const WidgetAnimations = [
  trigger('goalState', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(100%)' }),
      animate('0.3s 0.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
    ]),
    transition(':leave', [
      animate('0.3s ease-in', keyframes([
        style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
        style({ opacity: 0, transform: 'translateX(100%)', offset: 1 }),
      ])),
    ]),
  ]),
];
