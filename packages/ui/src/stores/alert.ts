import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { Alert, AlertTypes } from '../types/alert';

export interface AlertState {
  alerts: Alert[];
}

export const useAlertStore = defineStore({
  id: 'app-store',
  state: (): AlertState => {
    return {
      alerts: [],
    };
  },
  getters: {
    allAlerts: (state) => {
      return state.alerts;
    },
  },
  actions: {
    addAlert(type: AlertTypes, message: string) {
      this.alerts.push({
        id: uuidv4(),
        type,
        message,
      });
    },
    removeAlert(id: string) {
      this.alerts = this.alerts.filter((alert: Alert) => alert.id !== id);
    },
  },
});
