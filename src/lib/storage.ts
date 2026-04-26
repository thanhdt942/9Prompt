import type { Prompt } from '../types/prompt'

const STORAGE_KEY = '9prompt.prompts'

const hasChromeStorage = (): boolean =>
  typeof chrome !== 'undefined' &&
  typeof chrome.storage !== 'undefined' &&
  typeof chrome.storage.local !== 'undefined'

const getChromeLocalStorage = (): chrome.storage.StorageArea | null => {
  if (!hasChromeStorage()) {
    return null
  }

  return chrome.storage.local
}

const chromeGet = async (storageArea: chrome.storage.StorageArea, key: string): Promise<unknown> => {
  return await new Promise<unknown>((resolve, reject) => {
    storageArea.get(key, (items) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve(items[key])
    })
  })
}

const chromeSet = async (
  storageArea: chrome.storage.StorageArea,
  items: Record<string, unknown>,
): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    storageArea.set(items, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve()
    })
  })
}

export const promptStorage = {
  async loadPrompts(): Promise<Prompt[]> {
    const chromeStorage = getChromeLocalStorage()

    if (chromeStorage) {
      const value = await chromeGet(chromeStorage, STORAGE_KEY)
      return Array.isArray(value) ? (value as Prompt[]) : []
    }

    const fallback = localStorage.getItem(STORAGE_KEY)
    if (!fallback) return []

    try {
      const parsed = JSON.parse(fallback)
      return Array.isArray(parsed) ? (parsed as Prompt[]) : []
    } catch {
      return []
    }
  },

  async savePrompts(prompts: Prompt[]): Promise<void> {
    const chromeStorage = getChromeLocalStorage()

    if (chromeStorage) {
      await chromeSet(chromeStorage, { [STORAGE_KEY]: prompts })
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
  },
}
