"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

// Rutas donde el Footer NO debe aparecer
const RUTAS_SIN_FOOTER = ["/", "/registro"];

export default function ConditionalFooter() {
  const pathname = usePathname();

  if (RUTAS_SIN_FOOTER.includes(pathname)) {
    return null;
  }

  return <Footer />;
}
