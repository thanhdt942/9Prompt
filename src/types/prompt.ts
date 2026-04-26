export type Prompt = {
  id: string
  title: string
  content: string
  description?: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export type PromptDraft = {
  title: string
  content: string
  description?: string
  tags: string[]
}
