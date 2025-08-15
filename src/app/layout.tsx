import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Sidebar from "@/components/Sidebar";
import AuthButton from "@/components/AuthButton";

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
      <body className="bg-background text-text-primary min-h-svh antialiased">
        <AppProvider>
          <div className="fixed top-3 right-3 z-50">
            <AuthButton />
          </div>
          <div className="flex h-screen overflow-hidden">
            <div className="hidden md:block">
              <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

