'use client';

import { useGlobalContext } from '@/context/AppContext';

export default function AuthButton() {
  const { user, loading, signIn } = useGlobalContext();

  if (loading) {
    return (
      <div className="px-3 py-2 rounded-full border bg-white/80">
        読み込み中
      </div>
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
    <div className="h-10 w-10 rounded-full border bg-white/90 backdrop-blur overflow-hidden grid place-items-center">
      {user.photoURL ? (
        <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="text-sm">🙂</div>
      )}
    </div>
  );
}
