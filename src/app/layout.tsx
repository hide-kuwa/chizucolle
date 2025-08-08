import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import Auth from "@/components/Auth";
import LoginFixedTopRight from "@/components/LoginFixedTopRight";

export const metadata: Metadata = {
  title: "地図コレ",
  description: "自分だけの日本地図を、思い出の写真で塗りつぶそう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className="bg-background text-text-primary">
        <AuthProvider>
          <AppProvider>
            <LoginFixedTopRight>
              <Auth />
            </LoginFixedTopRight>
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

