import "./globals.css";
import { Provider } from "@/components/ui/provider";

export const metadata = {
  title: "GradNET",
  description: "Code by DARD",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
