import { ChevronDown, ChevronRight, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import type { Prompt } from '../types/prompt'

type PromptListProps = {
  developerPrompts: Prompt[]
  userPrompts: Prompt[]
  selectedPromptId: string | null
  query: string
  onQueryChange: (value: string) => void
  onSelect: (id: string) => void
  onCreate: () => void
}

export function PromptList({
  developerPrompts,
  userPrompts,
  selectedPromptId,
  query,
  onQueryChange,
  onSelect,
  onCreate,
}: PromptListProps) {
  const [showDeveloperPrompts, setShowDeveloperPrompts] = useState(true)

  const renderItem = (prompt: Prompt) => {
    const active = prompt.id === selectedPromptId

    return (
      <li key={prompt.id}>
        <button
          type="button"
          onClick={() => onSelect(prompt.id)}
          className={`w-full rounded-xl px-2.5 py-2 text-left transition ${
            active ? 'bg-[#F1D2DE] text-slate-800' : 'hover:bg-[#F1D2DE]/45'
          }`}
        >
          <p className="truncate text-sm font-medium">{prompt.title}</p>
          <p className={`truncate text-xs ${active ? 'text-slate-600' : 'text-slate-500'}`}>
            {prompt.description || 'No description'}
          </p>
        </button>
      </li>
    )
  }

  return (
    <aside className="m-3 flex h-[calc(100%-1.5rem)] flex-col rounded-2xl border border-[#F1D2DE] bg-white">
      <div className="space-y-2 border-b border-[#F1D2DE] p-3">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-2.5 text-[#c08d9f]" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search prompts"
            className="w-full rounded-xl border border-[#F1D2DE] bg-white py-2 pl-8 pr-2 text-sm text-slate-700 outline-none transition focus:border-[#F5C8BD] focus:ring-2 focus:ring-[#F1D2DE]"
          />
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="flex w-full items-center justify-center gap-1 rounded-xl border border-[#F5C8BD] bg-[#F5C8BD]/40 px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#F5C8BD]/60"
        >
          <Plus size={14} />
          New prompt
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 p-2">
        <section
          className={`flex min-h-0 flex-col rounded-xl border border-[#F1D2DE] bg-[#fff9fc] ${
            showDeveloperPrompts ? 'flex-1' : 'flex-[1.8]'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#F1D2DE] px-2.5 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9a7284]">Prompt của bạn</p>
            <span className="rounded-full bg-[#F1D2DE]/55 px-2 py-0.5 text-[10px] font-semibold text-[#845a6d]">
              {userPrompts.length}
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {userPrompts.length > 0 ? (
              <ul className="space-y-1">{userPrompts.map(renderItem)}</ul>
            ) : (
              <p className="p-2 text-xs text-slate-500">Bạn chưa có prompt nào.</p>
            )}
          </div>
        </section>

        <section
          className={`flex min-h-0 flex-col rounded-xl border border-[#F1D2DE] bg-white ${
            showDeveloperPrompts ? 'flex-[0.9]' : 'flex-none'
          }`}
        >
          <button
            type="button"
            onClick={() => setShowDeveloperPrompts((value) => !value)}
            className="flex items-center justify-between border-b border-[#F1D2DE] px-2.5 py-2 text-left transition hover:bg-[#F1D2DE]/20"
          >
            <div className="flex items-center gap-1.5">
              {showDeveloperPrompts ? (
                <ChevronDown size={13} className="text-[#9a7284]" />
              ) : (
                <ChevronRight size={13} className="text-[#9a7284]" />
              )}
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9a7284]">Prompt nhà phát triển</p>
            </div>
            <span className="rounded-full bg-[#F1D2DE]/55 px-2 py-0.5 text-[10px] font-semibold text-[#845a6d]">
              {developerPrompts.length}
            </span>
          </button>

          {showDeveloperPrompts ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
              {developerPrompts.length > 0 ? (
                <ul className="space-y-1">{developerPrompts.map(renderItem)}</ul>
              ) : (
                <p className="p-2 text-xs text-slate-500">Không có prompt nhà phát triển.</p>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </aside>
  )
}
