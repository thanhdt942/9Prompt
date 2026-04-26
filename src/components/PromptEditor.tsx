import { useState } from 'react'
import type { Prompt, PromptDraft } from '../types/prompt'

type PromptEditorProps = {
  prompt?: Prompt
  onCancel?: () => void
  onSave: (draft: PromptDraft) => Promise<void>
}

export function PromptEditor({ prompt, onCancel, onSave }: PromptEditorProps) {
  const [title, setTitle] = useState(prompt?.title ?? '')
  const [description, setDescription] = useState(prompt?.description ?? '')
  const [content, setContent] = useState(prompt?.content ?? '')
  const [tagsText, setTagsText] = useState((prompt?.tags ?? []).join(', '))
  const [saving, setSaving] = useState(false)

  const canSave = title.trim().length > 0 && content.trim().length > 0

  const handleSave = async () => {
    if (!canSave || saving) return

    setSaving(true)
    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    try {
      await onSave({
        title,
        content,
        description,
        tags,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-[#F5C8BD] bg-[#F5C8BD]/30 px-3 py-2 text-xs text-[#7f4c5f]">
        Mẹo parameter: dùng <span className="font-semibold">{'{{para}}'}</span>. Nếu muốn giá trị mặc định, dùng{' '}
        <span className="font-semibold">{'{{para|default}}'}</span> (hoặc <span className="font-semibold">{'{{para=default}}'}</span>).
      </div>

      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Prompt title"
        className="w-full rounded-2xl border border-[#F1D2DE] bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#F5C8BD] focus:ring-2 focus:ring-[#F1D2DE]"
      />

      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Short description (optional)"
        className="w-full rounded-2xl border border-[#F1D2DE] bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#F5C8BD] focus:ring-2 focus:ring-[#F1D2DE]"
      />

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Write your prompt. Ex: {{tone|friendly}}, {{language=English}}"
        className="min-h-36 w-full resize-y rounded-2xl border border-[#F1D2DE] bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#F5C8BD] focus:ring-2 focus:ring-[#F1D2DE]"
      />

      <input
        value={tagsText}
        onChange={(event) => setTagsText(event.target.value)}
        placeholder="Tags, comma separated"
        className="w-full rounded-2xl border border-[#F1D2DE] bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#F5C8BD] focus:ring-2 focus:ring-[#F1D2DE]"
      />

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-3 py-1.5 text-sm text-slate-600 transition hover:bg-[#F1D2DE]/40"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || saving}
          className="rounded-xl border border-[#F5C8BD] bg-[#F5C8BD] px-3 py-1.5 text-sm font-medium text-slate-800 transition hover:bg-[#efb9ad] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? 'Saving...' : prompt ? 'Save changes' : 'Create prompt'}
        </button>
      </div>
    </div>
  )
}
