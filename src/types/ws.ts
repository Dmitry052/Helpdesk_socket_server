export interface WS_SEND_MESSAGE {
  userId: string;
  from: string;
  to: string;
  message: string;
  type: string;
  date: Date;
}
