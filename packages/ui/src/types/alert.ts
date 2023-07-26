export enum AlertTypes {
  INFO = 'info',
  ERROR = 'error'
}
export interface Alert {
  id: string
  type: AlertTypes
  message: string
}
