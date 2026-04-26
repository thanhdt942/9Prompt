import { useEffect, useMemo, useState } from 'react'
import { PromptDetail } from './components/PromptDetail'
import { PromptEditor } from './components/PromptEditor'
import { PromptList } from './components/PromptList'
import { loadDeveloperPrompts } from './lib/developerPromptSource'
import { usePromptStore } from './store/usePromptStore'
import type { Prompt } from './types/prompt'

function App() {
  const initialize = usePromptStore((state) => state.initialize)
  const loading = usePromptStore((state) => state.loading)
  const query = usePromptStore((state) => state.query)
  const selectedPromptId = usePromptStore((state) => state.selectedPromptId)
  const setQuery = usePromptStore((state) => state.setQuery)
  const selectPrompt = usePromptStore((state) => state.selectPrompt)
  const createPrompt = usePromptStore((state) => state.createPrompt)
  const updatePrompt = usePromptStore((state) => state.updatePrompt)
  const deletePrompt = usePromptStore((state) => state.deletePrompt)
  const prompts = usePromptStore((state) => state.prompts)
  const [mode, setMode] = useState<'view' | 'create' | 'edit'>('view')
  const [developerPrompts, setDeveloperPrompts] = useState<Prompt[]>([])
  const [developerLoading, setDeveloperLoading] = useState(true)

  const developerPromptIds = useMemo(
    () => new Set(developerPrompts.map((prompt) => prompt.id)),
    [developerPrompts],
  )
  const allPrompts = useMemo(() => [...developerPrompts, ...prompts], [developerPrompts, prompts])

  useEffect(() => {
    void initialize()
  }, [initialize])

  useEffect(() => {
    const load = async () => {
      setDeveloperLoading(true)
      const templates = await loadDeveloperPrompts()
      setDeveloperPrompts(templates)
      setDeveloperLoading(false)
    }

    void load()
  }, [])

  const selectedPrompt: Prompt | undefined = useMemo(
    () => allPrompts.find((prompt) => prompt.id === selectedPromptId),
    [allPrompts, selectedPromptId],
  )
  const filteredAllPrompts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allPrompts

    return allPrompts.filter((prompt) => {
      return (
        prompt.title.toLowerCase().includes(q) ||
        prompt.content.toLowerCase().includes(q) ||
        (prompt.description ?? '').toLowerCase().includes(q) ||
        prompt.tags.join(' ').toLowerCase().includes(q)
      )
    })
  }, [allPrompts, query])

  const filteredDeveloperPrompts = useMemo(
    () => filteredAllPrompts.filter((prompt) => developerPromptIds.has(prompt.id)),
    [filteredAllPrompts, developerPromptIds],
  )
  const filteredUserPrompts = useMemo(
    () => filteredAllPrompts.filter((prompt) => !developerPromptIds.has(prompt.id)),
    [filteredAllPrompts, developerPromptIds],
  )
  const selectedIsDeveloperPrompt = selectedPrompt ? developerPromptIds.has(selectedPrompt.id) : false

  useEffect(() => {
    if (!selectedPromptId) {
      if (developerPrompts[0]) {
        selectPrompt(developerPrompts[0].id)
        return
      }

      if (prompts[0]) {
        selectPrompt(prompts[0].id)
      }
    }
  }, [developerPrompts, prompts, selectedPromptId, selectPrompt])

  const handleDelete = async () => {
    if (!selectedPrompt || selectedIsDeveloperPrompt) return
    await deletePrompt(selectedPrompt.id)
    setMode('view')
  }

  const handleSaveToMyPrompts = async () => {
    if (!selectedPrompt || !selectedIsDeveloperPrompt) return

    await createPrompt({
      title: `${selectedPrompt.title} (Đã lưu)`,
      content: selectedPrompt.content,
      description: selectedPrompt.description,
      tags: selectedPrompt.tags,
    })
    setMode('view')
  }

  return (
    <main className="h-full w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-white via-[#F1D2DE] to-[#F5C8BD] text-slate-800">
      <div className="flex h-full">
        <div className="w-[280px]">
          <PromptList
            developerPrompts={filteredDeveloperPrompts}
            userPrompts={filteredUserPrompts}
            selectedPromptId={selectedPromptId}
            query={query}
            onQueryChange={setQuery}
            onSelect={(id) => {
              selectPrompt(id)
              setMode('view')
            }}
            onCreate={() => setMode('create')}
          />
        </div>

        <section className="flex-1 overflow-y-auto p-4">
          {loading || developerLoading ? <p className="text-sm text-slate-500">Loading prompts...</p> : null}

          {!loading && !developerLoading && mode === 'create' ? (
            <div className="rounded-2xl border border-[#F1D2DE] bg-white p-5">
              <h1 className="mb-3 text-lg font-semibold">New Prompt</h1>
              <PromptEditor
                key="create"
                onCancel={() => setMode('view')}
                onSave={async (draft) => {
                  await createPrompt(draft)
                  setMode('view')
                }}
              />
            </div>
          ) : null}

          {!loading && !developerLoading && mode === 'edit' && selectedPrompt ? (
            <div className="rounded-2xl border border-[#F1D2DE] bg-white p-5">
              <h1 className="mb-3 text-lg font-semibold">Edit Prompt</h1>
              <PromptEditor
                key={selectedPrompt.id}
                prompt={selectedPrompt}
                onCancel={() => setMode('view')}
                onSave={async (draft) => {
                  await updatePrompt(selectedPrompt.id, draft)
                  setMode('view')
                }}
              />
            </div>
          ) : null}

          {!loading && !developerLoading && mode === 'view' ? (
            selectedPrompt ? (
              <div className="rounded-2xl border border-[#F1D2DE] bg-white p-5">
                <PromptDetail
                  prompt={selectedPrompt}
                  isDeveloperPrompt={selectedIsDeveloperPrompt}
                  onEdit={selectedIsDeveloperPrompt ? undefined : () => setMode('edit')}
                  onDelete={() => {
                    void handleDelete()
                  }}
                  onSaveToMyPrompts={selectedIsDeveloperPrompt ? () => void handleSaveToMyPrompts() : undefined}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#F5C8BD] bg-white p-6 text-center">
                <p className="text-sm text-slate-600">Create your first reusable prompt.</p>
              </div>
            )
          ) : null}
        </section>
      </div>
    </main>
  )
}

export default App
