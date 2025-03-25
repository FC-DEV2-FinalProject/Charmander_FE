import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_projectSideBarLayout/$project/script/')(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  return <div>Hello "/_projectSideBarLayout/project-script/"!</div>;
}
