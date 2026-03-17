import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SL Metro - Smart Transit for Sri Lanka",
  description:
    "Explore metro bus routes, plan journeys, and calculate fares for Colombo's modern metro bus system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
