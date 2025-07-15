import { useState, useEffect, useCallback } from 'react'

const AVAILABLE_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
].map(lang => ({
    ...lang,
    code: lang.code.toLowerCase(),
    name: lang.name,
    flag: lang.flag
}))

type LanguageCode = typeof AVAILABLE_LANGUAGES[number]['code']

interface LanguageData {
    ui: {
        [key: string]: any
    }
    sidebar: {
        [key: string]: any
    }
    content: {
        [key: string]: any
    }
    [key: string]: any
}

interface LanguageInfo {
    code: string
    name: string
    flag: string
}

interface UseLanguageReturn {
    currentLanguage: LanguageCode
    availableLanguages: LanguageInfo[]
    languageData: LanguageData | null
    isLoading: boolean
    error: string | null
    changeLanguage: (languageCode: LanguageCode) => void
    getCurrentLanguageInfo: () => LanguageInfo
}

const DEFAULT_LANGUAGE: LanguageCode = 'en'
const STORAGE_KEY = 'easydocs-language'

export function useLanguage(): UseLanguageReturn {
    const [currentLanguage] = useState<LanguageCode>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved && AVAILABLE_LANGUAGES.some(lang => lang.code === saved)) {
                return saved as LanguageCode
            }
        }
        return DEFAULT_LANGUAGE
    })

    const [languageData, setLanguageData] = useState<LanguageData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadLanguageData = useCallback(async (languageCode: LanguageCode) => {
        setIsLoading(true)
        setError(null)

        try {
            const languageModule = await import(`../lang/${languageCode}.json`)
            const data = languageModule.default || languageModule
            
            setLanguageData(data)
        } catch (err) {
            console.error(`Failed to load language data for ${languageCode}:`, err)
            setError(`Failed to load language: ${languageCode}`)
            
            if (languageCode !== DEFAULT_LANGUAGE) {
                try {
                    const fallbackModule = await import(`../lang/${DEFAULT_LANGUAGE}.json`)
                    const fallbackData = fallbackModule.default || fallbackModule
                    setLanguageData(fallbackData)
                } catch (fallbackErr) {
                    console.error('Failed to load fallback language:', fallbackErr)
                    setError('Failed to load language data')
                }
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    const changeLanguage = useCallback((languageCode: LanguageCode) => {
        if (AVAILABLE_LANGUAGES.some(lang => lang.code === languageCode)) {
            if (languageCode !== currentLanguage) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem(STORAGE_KEY, languageCode)
                    window.location.reload()
                }
            }
        } else {
            console.warn(`Language ${languageCode} is not available`)
        }
    }, [currentLanguage])

    const getCurrentLanguageInfo = useCallback((): LanguageInfo => {
        return AVAILABLE_LANGUAGES.find(lang => lang.code === currentLanguage) || AVAILABLE_LANGUAGES[0]
    }, [currentLanguage])

    useEffect(() => {
        loadLanguageData(currentLanguage)
    }, [currentLanguage, loadLanguageData])

    return {
        currentLanguage,
        availableLanguages: AVAILABLE_LANGUAGES,
        languageData,
        isLoading,
        error,
        changeLanguage,
        getCurrentLanguageInfo,
    }
}