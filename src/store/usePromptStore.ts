import { create } from 'zustand'
import { promptStorage } from '../lib/storage'
import type { Prompt, PromptDraft } from '../types/prompt'

type PromptStore = {
  prompts: Prompt[]
  selectedPromptId: string | null
  query: string
  loading: boolean
  initialized: boolean
  initialize: () => Promise<void>
  setQuery: (query: string) => void
  selectPrompt: (id: string | null) => void
  createPrompt: (draft: PromptDraft) => Promise<Prompt>
  updatePrompt: (id: string, draft: PromptDraft) => Promise<void>
  deletePrompt: (id: string) => Promise<void>
  duplicatePrompt: (id: string) => Promise<void>
}

const uid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const persist = async (prompts: Prompt[]) => {
  await promptStorage.savePrompts(prompts)
}

export const usePromptStore = create<PromptStore>((set, get) => ({
  prompts: [],
  selectedPromptId: null,
  query: '',
  loading: false,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return

    set({ loading: true })
    const prompts = await promptStorage.loadPrompts()
    const sorted = prompts.sort((a, b) => b.updatedAt - a.updatedAt)
    set({
      prompts: sorted,
      loading: false,
      initialized: true,
      selectedPromptId: sorted[0]?.id ?? null,
    })
  },

  setQuery: (query) => set({ query }),

  selectPrompt: (id) => set({ selectedPromptId: id }),

  createPrompt: async (draft) => {
    const now = Date.now()
    const next: Prompt = {
      id: uid(),
      title: draft.title.trim(),
      content: draft.content,
      description: draft.description?.trim(),
      tags: draft.tags,
      createdAt: now,
      updatedAt: now,
    }

    const prompts = [next, ...get().prompts]
    await persist(prompts)
    set({ prompts, selectedPromptId: next.id })
    return next
  },

  updatePrompt: async (id, draft) => {
    const prompts = get().prompts.map((prompt) =>
      prompt.id === id
        ? {
            ...prompt,
            title: draft.title.trim(),
            content: draft.content,
            description: draft.description?.trim(),
            tags: draft.tags,
            updatedAt: Date.now(),
          }
        : prompt,
    )

    prompts.sort((a, b) => b.updatedAt - a.updatedAt)
    await persist(prompts)
    set({ prompts })
  },

  deletePrompt: async (id) => {
    const prompts = get().prompts.filter((prompt) => prompt.id !== id)
    await persist(prompts)

    const selectedPromptId = get().selectedPromptId === id ? (prompts[0]?.id ?? null) : get().selectedPromptId
    set({ prompts, selectedPromptId })
  },

  duplicatePrompt: async (id) => {
    const source = get().prompts.find((prompt) => prompt.id === id)
    if (!source) return

    const now = Date.now()
    const clone: Prompt = {
      ...source,
      id: uid(),
      title: `${source.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    }

    const prompts = [clone, ...get().prompts]
    await persist(prompts)
    set({ prompts, selectedPromptId: clone.id })
  },
}))
