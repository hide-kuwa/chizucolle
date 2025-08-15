'use client';

import { useGlobalContext } from '@/context/AppContext';

export default function AuthButton() {
  const { user, loading, signIn, signOut } = useGlobalContext();

  if (loading) {
    return (
      <button className="px-3 py-2 rounded-xl border bg-white/80 backdrop-blur">
        読み込み中
      </button>
    );
  }

  if (!user) {
    return (
      <button
        onClick={signIn}
        className="px-3 py-2 rounded-xl bg-neutral-900 text-white hover:opacity-90"
      >
        ログイン
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt=""
          width={28}
          height={28}
          className="rounded-full"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-neutral-200" />
      )}
      <button
        onClick={signOut}
        className="px-3 py-2 rounded-xl border hover:bg-neutral-50"
      >
        ログアウト
      </button>
    </div>
  );
}

