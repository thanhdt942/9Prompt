import type { Prompt } from '../types/prompt'

const isPrompt = (value: unknown): value is Prompt => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<Prompt>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.content === 'string' &&
    Array.isArray(candidate.tags) &&
    typeof candidate.createdAt === 'number' &&
    typeof candidate.updatedAt === 'number'
  )
}

export const loadDeveloperPrompts = async (): Promise<Prompt[]> => {
  try {
    const response = await fetch('./developer-prompts.json')
    if (!response.ok) return []

    const payload = (await response.json()) as unknown
    if (!Array.isArray(payload)) return []

    return payload.filter(isPrompt)
  } catch {
    return []
  }
}
