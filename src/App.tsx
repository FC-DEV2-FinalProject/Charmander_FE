import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
// 새 라우터 인스턴스 만들기

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
