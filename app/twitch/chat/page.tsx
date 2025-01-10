// app/twitch/chat/page.tsx
import TwitchChatViewer from '@/components/chat/TwitchChatViewer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <TwitchChatViewer />
    </main>
  );
}