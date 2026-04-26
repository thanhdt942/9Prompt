import type { Prompt } from '../types/prompt'

const REMOTE_PROMPT_SOURCE_URL = 'https://thanhdt942.github.io/9Prompt/public/developer-prompts.json'

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

const fetchPromptList = async (url: string): Promise<Prompt[]> => {
  const response = await fetch(url, { cache: 'no-cache' })
  if (!response.ok) return []

  const payload = (await response.json()) as unknown
  if (!Array.isArray(payload)) return []

  return payload.filter(isPrompt)
}

export const loadDeveloperPrompts = async (): Promise<Prompt[]> => {
  try {
    const remotePrompts = await fetchPromptList(REMOTE_PROMPT_SOURCE_URL)
    if (remotePrompts.length > 0) return remotePrompts

    return await fetchPromptList('./developer-prompts.json')
  } catch {
    try {
      return await fetchPromptList('./developer-prompts.json')
    } catch {
      return []
    }
  }
}
