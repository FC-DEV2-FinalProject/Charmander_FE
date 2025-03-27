import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { dashboardHandlers } from './dashboardHandler';

export const worker = setupWorker(...handlers, ...dashboardHandlers);
