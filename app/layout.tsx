import "./globals.css";
import ClientLayout from "./ClientLayout";
import { ReactNode } from "react";

export const metadata = {
  title: "Ecommerce Frontend",
  description: "Frontend for your ecommerce app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
