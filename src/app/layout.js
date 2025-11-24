import "./globals.css";
import { Provider } from "@/components/ui/provider";

export const metadata = {
  title: "GradNET",
  description: "Code by DARD",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning={true}>
      <body
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
