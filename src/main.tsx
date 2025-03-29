import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
import router from './App';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

// async function enableMocking() {
//   if (import.meta.env.MODE !== 'development') {
//     return;
//   }

//   const { worker } = await import('./mock/browser'); // Dynamic Import
//   return worker.start();
// }

// // MSW가 설정된 후에만 렌더링
// enableMocking().then(() => {
//   const rootElement = document.getElementById('root');
//   if (!rootElement) {
//     throw new Error('Root element not found');
//   }

//   if (!rootElement.innerHTML) {
//     const root = ReactDOM.createRoot(rootElement);
//     root.render(
//       <StrictMode>
//         <App />
//       </StrictMode>
//     );
//   }
// });
