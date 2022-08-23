export interface CalendarEvent {
  __id: string;
  __userId: string;
  __weekGoalId: string;
  startTime: number; // start of event in GMT time in milliseconds since 1/1/1970
  endTime: number; // end of event in GMT time in milliseconds since 1/1/1970
  summary: string;
}
