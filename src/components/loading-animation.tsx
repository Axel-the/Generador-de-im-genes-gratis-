'use client'

import { useEffect, useState } from 'react'

interface LoadingAnimationProps {
  prompt: string
  onComplete?: () => void
}

export default function LoadingAnimation({ prompt, onComplete }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  
  const steps = [
    'Analizando prompt...',
    'Preparando modelo...',
    'Generando imagen...',
    'Aplicando detalles...',
    'Optimizando calidad...',
    '¡Listo!'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          if (onComplete) onComplete()
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [onComplete, steps.length])

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Main animation container */}
      <div className="relative">
        {/* Animated brain/particle effect */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Central brain icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            {/* Orbiting particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 animate-spin"
                style={{
                  animationDuration: `${2 + i * 0.5}s`,
                  animationDelay: `${i * 0.2}s`
                }}
              >
                <div
                  className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateX(40px) rotate(-${i * 60}deg)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Generando imagen</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Current step */}
        <div className="text-center">
          <p className="text-sm font-medium text-primary">
            {steps[currentStep]}
          </p>
        </div>

        {/* Prompt preview */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Generando:</p>
          <p className="text-sm font-medium truncate">{prompt}</p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}