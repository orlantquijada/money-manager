import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  show?: boolean;
}>;

export default function Show({ show = true, children }: Props): JSX.Element {
  return <>{show ? children : null}</>;
}
