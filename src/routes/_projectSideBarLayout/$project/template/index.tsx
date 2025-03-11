import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_projectSideBarLayout/$project/template/'
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_projectSideBarLayout/project-template/"!</div>;
}
