interface StoryHeaderProps {
  title: string
  moral: string
}

export function StoryHeader({ title, moral }: StoryHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#0A0A0A] dark:text-white mb-2">
        {title}
      </h1>
      <div className="bg-[#FF6719]/10 border border-[#FF6719]/30 rounded-lg px-4 py-3">
        <p className="text-sm text-[#FF6719] font-medium">{moral}</p>
      </div>
    </div>
  )
}
