import './globals.css';

// Minimal root layout - route groups provide their own full layouts
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
