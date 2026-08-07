const QUIZ_RESULTS_KEY = 'exlr-quiz-results'
const LEARNING_PROGRESS_KEY = 'exlr-learning-progress'

export interface StoredQuizResult {
  id: string
  subject: string
  topic: string
  difficulty: string
  score: number
  total: number
  created_at: string
}

export interface StoredLearningProgress {
  id: string
  subject: string
  module_title: string
  created_at: string
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getStoredQuizResults() {
  return readStorage<StoredQuizResult[]>(QUIZ_RESULTS_KEY, [])
}

export function saveQuizResult(result: Omit<StoredQuizResult, 'id'>) {
  const existing = getStoredQuizResults()
  const next = [
    ...existing,
    {
      ...result,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    },
  ]
  writeStorage(QUIZ_RESULTS_KEY, next)
  return next
}

export function getStoredLearningProgress() {
  return readStorage<StoredLearningProgress[]>(LEARNING_PROGRESS_KEY, [])
}

export function saveLearningProgress(entry: Omit<StoredLearningProgress, 'id'>) {
  const existing = getStoredLearningProgress()
  const next = [
    ...existing,
    {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    },
  ]
  writeStorage(LEARNING_PROGRESS_KEY, next)
  return next
}
