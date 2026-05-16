import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acceder al dev server desde IPs locales (otros dispositivos
  // de tu red Wi-Fi, como tu móvil para probar la app).
  // Añade aquí cualquier IP/host desde el que quieras servir Tracki en dev.
  allowedDevOrigins: [
    "192.168.77.1",
    "192.168.1.*",  // Wildcard: toda tu red local típica
    "192.168.0.*",
  ],
};

export default nextConfig;
