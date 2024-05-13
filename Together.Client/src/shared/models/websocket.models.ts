export interface IWebSocketMessage<T = any> {
  target: string;
  data: T;
}
