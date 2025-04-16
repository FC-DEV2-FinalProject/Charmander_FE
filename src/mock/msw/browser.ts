import { setupWorker } from 'msw/browser';
import { handlers } from './projectHandlers';
import { dashboardHandlers } from './dashboardHandler';

export const worker = setupWorker(...handlers, ...dashboardHandlers);
