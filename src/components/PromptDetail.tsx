import { Check, Copy, Pencil, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { resolvePromptWithDefaults } from '../lib/parameters'
import type { Prompt } from '../types/prompt'
import { PromptContentPreview } from './PromptContentPreview'

type PromptDetailProps = {
  prompt: Prompt
  isDeveloperPrompt: boolean
  onEdit?: () => void
  onDelete?: () => void
  onSaveToMyPrompts?: () => void
}

export function PromptDetail({ prompt, isDeveloperPrompt, onEdit, onDelete, onSaveToMyPrompts }: PromptDetailProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyPrompt = async () => {
    try {
      const text = resolvePromptWithDefaults(prompt.content)
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => {
        setCopied(false)
      }, 1400)
    } catch (error) {
      console.error('Khong the copy prompt:', error)
    }
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{prompt.title}</h2>
            <p className="text-sm text-slate-500">{prompt.description || 'No description'}</p>
            <span className="mt-1 inline-flex rounded-full bg-[#F1D2DE]/55 px-2 py-0.5 text-xs font-medium text-[#845a6d]">
              {isDeveloperPrompt ? 'Template nhà phát triển' : 'Prompt người dùng'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                void handleCopyPrompt()
              }}
              className="rounded-xl border border-[#F1D2DE] p-1.5 text-[#9e6f84] transition hover:bg-[#F1D2DE]/55 hover:text-slate-700"
              title="Copy prompt text (dùng default nếu có)"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            {isDeveloperPrompt ? (
              <button
                type="button"
                onClick={onSaveToMyPrompts}
                className="rounded-xl border border-[#F1D2DE] p-1.5 text-[#9e6f84] transition hover:bg-[#F1D2DE]/55 hover:text-slate-700"
                title="Lưu thành Prompt người dùng"
              >
                <Save size={14} />
              </button>
            ) : null}
            {!isDeveloperPrompt ? (
              <>
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-xl border border-[#F1D2DE] p-1.5 text-[#9e6f84] transition hover:bg-[#F1D2DE]/55 hover:text-slate-700"
                  title="Edit prompt"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-xl border border-[#F5C8BD] p-1.5 text-[#c97976] transition hover:bg-[#F5C8BD]/40 hover:text-[#b65f5d]"
                  title="Delete prompt"
                >
                  <Trash2 size={14} />
                </button>
              </>
            ) : null}
          </div>
        </div>

        {prompt.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1">
            {prompt.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-[#F1D2DE]/55 px-2 py-0.5 text-xs text-[#845a6d]">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9a7284]">Preview</h3>
        <div className="rounded-2xl border border-[#F1D2DE] bg-white p-3">
          <PromptContentPreview content={prompt.content} />
        </div>
      </section>
    </div>
  )
}
