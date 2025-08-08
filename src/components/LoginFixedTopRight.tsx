'use client';
export default function LoginFixedTopRight({ children }: { children: React.ReactNode }) {
  return <div className="fixed right-3 top-3 z-50">{children}</div>;
}
