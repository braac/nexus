export default function ChatLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      // This preserves the original dark background for the chat viewer
      <div className="min-h-screen bg-[#0a0a0a]">
        {children}
      </div>
    )
  }