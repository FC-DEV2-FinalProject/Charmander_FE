import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_sideBarLayout/my-project/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>내 프로젝트</div>;
}
