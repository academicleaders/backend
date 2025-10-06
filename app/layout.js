export const metadata = {
  title: "Backend",
  description: "API backend is up",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
