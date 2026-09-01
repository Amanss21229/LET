import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LET - Learn Earn Teach",
  description: "Learn • Earn • Teach",

  verification: {
    google: "a8clSvgtk7cHYp7cRjpc54UPZKuBdOXmUcsgTLrKtJc",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
