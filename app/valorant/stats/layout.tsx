export default function StatsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      // This preserves the dark background for the stats viewer
      <div className="min-h-screen bg-[#0a0a0a]">
        {children}
      </div>
    )
  }