import Auth from "@/components/Auth";

export default function Home() {
  return (
    <main style={{ padding: '20px' }}>
      <header>
        <h1>地図コレ</h1>
        <p>自分だけの日本地図を、思い出の写真で塗りつぶそう！</p>
      </header>
      <hr style={{ margin: '20px 0' }} />
      <Auth />
    </main>
  );
}
