import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
import router from './App';

// 유형 안전성을 위해 라우터 인스턴스 등록
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
