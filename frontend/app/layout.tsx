import { dmSans } from "@/theme/theme";
import React, { ReactNode } from "react";
import AppWrappers from "./AppWrappers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={dmSans.className}>
      <body id={"root"}>
        <AppWrappers>{children}</AppWrappers>
      </body>
    </html>
  );
}
