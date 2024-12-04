import { useState } from 'react'

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingCount, setLoadingCount] = useState(0)
  const [loadingText, setLoadingText] = useState('Loading...')

  const startLoading = (text = 'Loading...') => {
    setLoadingCount((prevCount) => prevCount + 1)
    setLoadingText(text)
    setIsLoading(true)
  }

  const stopLoading = () => {
    setIsLoading(false)

    setLoadingCount((prevCount) => prevCount - 1)

    if (loadingCount === 1) {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading
  }
}
