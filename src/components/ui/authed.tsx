import { isAuthenticated } from "@/lib/actions";
import { env } from "@/lib/env";
import { Suspense } from "react";

async function AuthedInner(props: {
  authed: React.ReactNode;
  unauthed: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();
  if (env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  if (authenticated) {
    return props.authed;
  }
  return props.unauthed;
}

export function Authed(props: {
  authed: React.ReactNode;
  unauthed: React.ReactNode;
  fallback: React.ReactNode;
}) {
  return (
    <Suspense fallback={props.fallback}>
      <AuthedInner authed={props.authed} unauthed={props.unauthed} />
    </Suspense>
  );
}
