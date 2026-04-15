import ChatInterface from '@/components/chat/ChatInterface';

export const metadata = {
  title: 'François | Wine Reviews',
  description: 'Chat with François, your AI wine expert, about regions, grapes, winemaking, and more.',
};

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <ChatInterface />
    </main>
  );
}
