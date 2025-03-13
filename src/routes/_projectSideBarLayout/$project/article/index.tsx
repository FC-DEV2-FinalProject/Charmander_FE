import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_projectSideBarLayout/$project/article/'
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>기사 입력 창입니다다!</div>;
}
