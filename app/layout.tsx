import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workout App",
  description: "Best workout app ever :D",
  icons: [
    {
      url: "/app-icon.png",
      sizes: "512x512",
      type: "image/png",
      rel: "icon",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  );
}
