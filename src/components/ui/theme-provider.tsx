"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

// https://github.com/shadcn-ui/ui/issues/5552#issuecomment-2999470492
const initialRender = process.env.NODE_ENV === "production";

export function NextThemeProvider(
  props: React.ComponentProps<typeof ThemeProvider>
) {
  const [shouldRender, setShouldRender] = useState(initialRender);
  useEffect(() => {
    if (!initialRender) {
      setShouldRender(true);
    }
  }, []);
  return shouldRender ? <ThemeProvider {...props} /> : props.children;
}
