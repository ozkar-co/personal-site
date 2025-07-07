import { useState, useEffect } from 'react'
import quotes from '../../data/quotes.txt?raw'
import { getRandomWizardImage } from '../../data/wizardImages'
import './Wizz.scss'

export const Wizz = () => {
  const [currentQuote, setCurrentQuote] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentWizardImage, setCurrentWizardImage] = useState('')

  const getRandomQuote = () => {
    const quoteLines = quotes.split('\n').filter(line => line.trim() !== '')
    const randomIndex = Math.floor(Math.random() * quoteLines.length)
    return quoteLines[randomIndex]
  }

  const handleWizardClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentQuote(getRandomQuote())
      setCurrentWizardImage(getRandomWizardImage())
      setIsLoading(false)
    }, 300)
  }

  useEffect(() => {
    setCurrentQuote(getRandomQuote())
    setCurrentWizardImage(getRandomWizardImage())
    setIsLoading(false)
  }, [])

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
                  const isPunctuation = part === ';' || part === '.';
                  const isLastPart = index === array.length - 1;
                  const nextPart = array[index + 1];
                  
                  // Añadir salto de línea después de ; o . (excepto si es el final)
                  const shouldAddBreak = isPunctuation && !isLastPart && nextPart && nextPart.trim() !== '';
                  
                  return (
                    <span key={index}>
                      {part}
                      {shouldAddBreak && <br />}
                    </span>
                  );
                })}
              </blockquote>
            )}
          </div>
        </div>
        
        <div className="wizard-section">
          <div className="wizard-container">
            <img 
              src={currentWizardImage} 
              alt="Sabio Mago" 
              className="wizard-image"
              onClick={handleWizardClick}
              title="Haz clic para obtener nueva sabiduría"
            />
            <div className="wizard-glow"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 