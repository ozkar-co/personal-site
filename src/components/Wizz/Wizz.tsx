import { useState, useEffect, useCallback } from 'react'
import quotes from '../../data/quotes.txt?raw'
import {
  WIZARD_IMAGE_COUNT,
  getRandomWizardImage,
  getWizardImagePath,
  preloadWizardImages,
} from '../../data/wizardImages'
import './Wizz.scss'

export const Wizz = () => {
  const [currentQuote, setCurrentQuote] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentWizardImage, setCurrentWizardImage] = useState('')

  const getRandomQuote = useCallback(() => {
    const quoteLines = quotes.split('\n').filter((line) => line.trim() !== '')
    const randomIndex = Math.floor(Math.random() * quoteLines.length)
    return quoteLines[randomIndex]
  }, [])

  const pickDifferentImage = useCallback((current: string) => {
    if (WIZARD_IMAGE_COUNT <= 1) return getRandomWizardImage()

    let next = getRandomWizardImage()
    let attempts = 0
    while (next === current && attempts < 10) {
      next = getWizardImagePath(Math.floor(Math.random() * WIZARD_IMAGE_COUNT))
      attempts++
    }
    return next
  }, [])

  const handleWizardClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentQuote(getRandomQuote())
      setCurrentWizardImage((current) => pickDifferentImage(current))
    }, 200)
  }

  useEffect(() => {
    preloadWizardImages()
    setCurrentQuote(getRandomQuote())
    setCurrentWizardImage(getRandomWizardImage())
  }, [getRandomQuote])

  // Fallback: if onLoad never fires (same src / edge cases), clear loading
  useEffect(() => {
    if (!isLoading || !currentWizardImage) return
    const timeout = window.setTimeout(() => setIsLoading(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [isLoading, currentWizardImage])

  return (
    <section className="wizz">
      <div className="wizz-container">
        <div className="quote-section">
          <div className="quote-content">
            {isLoading ? (
              <div className="loading-quote">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              <blockquote className="ancient-quote">
                {currentQuote.split(/([;.])/).map((part, index, array) => {
                  const isPunctuation = part === ';' || part === '.'
                  const isLastPart = index === array.length - 1
                  const nextPart = array[index + 1]

                  const shouldAddBreak =
                    isPunctuation &&
                    !isLastPart &&
                    nextPart &&
                    nextPart.trim() !== ''

                  return (
                    <span key={index}>
                      {part}
                      {shouldAddBreak && <br />}
                    </span>
                  )
                })}
              </blockquote>
            )}
          </div>
        </div>

        <div className="wizard-section">
          <div className="wizard-container">
            {currentWizardImage && (
              <img
                src={currentWizardImage}
                alt="Sabio Mago"
                className="wizard-image"
                width={800}
                height={800}
                decoding="async"
                onClick={handleWizardClick}
                onLoad={() => setIsLoading(false)}
                title="Haz clic para obtener nueva sabiduría"
              />
            )}
            <div className="wizard-glow"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
