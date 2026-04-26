const PARAM_REGEX = /\{\{([^}]+)\}\}/g

export type PromptSegment =
  | { type: 'text'; value: string }
  | { type: 'parameter'; value: string; key: string; defaultValue?: string; explanation: string }

const parseParameterToken = (token: string): { key: string; defaultValue?: string } => {
  const raw = token.trim()
  if (!raw) return { key: '' }

  const pipeIndex = raw.indexOf('|')
  const equalIndex = raw.indexOf('=')
  const separatorIndex = pipeIndex >= 0 ? pipeIndex : equalIndex

  if (separatorIndex < 0) {
    return { key: raw }
  }

  const key = raw.slice(0, separatorIndex).trim()
  const defaultValue = raw.slice(separatorIndex + 1).trim()
  return {
    key,
    defaultValue: defaultValue || undefined,
  }
}

const toExplanation = (key: string, defaultValue?: string): string => {
  const normalized = key.replace(/[_-]/g, ' ').trim()
  if (!normalized) {
    return 'Replace this parameter with your own value.'
  }

  if (defaultValue) {
    return `Replace ${normalized}. Default: ${defaultValue}.`
  }

  return `Replace with ${normalized}.`
}

export const parsePromptContent = (content: string): PromptSegment[] => {
  const segments: PromptSegment[] = []
  let cursor = 0

  for (const match of content.matchAll(PARAM_REGEX)) {
    const matchText = match[0]
    const token = match[1] ?? ''
    const { key, defaultValue } = parseParameterToken(token)
    const index = match.index ?? 0

    if (index > cursor) {
      segments.push({
        type: 'text',
        value: content.slice(cursor, index),
      })
    }

    segments.push({
      type: 'parameter',
      value: matchText,
      key,
      defaultValue,
      explanation: toExplanation(key, defaultValue),
    })

    cursor = index + matchText.length
  }

  if (cursor < content.length) {
    segments.push({
      type: 'text',
      value: content.slice(cursor),
    })
  }

  return segments
}

export const resolvePromptWithDefaults = (content: string): string =>
  content.replace(PARAM_REGEX, (_, token: string) => {
    const { key, defaultValue } = parseParameterToken(token ?? '')
    return defaultValue ?? `{{${key}}}`
  })
