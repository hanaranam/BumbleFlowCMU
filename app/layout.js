import "./globals.css";

export const metadata = {
  title: "Bumble Flow",
  description: "Bumble Flow prototype migrated to Next.js",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
