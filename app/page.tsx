'use client'

import { useState, useEffect, useCallback } from 'react'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [history, setHistory] = useState<string[]>([])
  const [isDark, setIsDark] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const savedHistory = localStorage.getItem('calcHistory')
    if (savedTheme === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', !isDark ? 'dark' : 'light')
  }

  const addToHistory = (calculation: string) => {
    const newHistory = [calculation, ...history.slice(0, 9)]
    setHistory(newHistory)
    localStorage.setItem('calcHistory', JSON.stringify(newHistory))
  }

  const handleInput = (value: string) => {
    if (value === 'C') {
      setDisplay('0')
    } else if (value === '=') {
      try {
        const result = eval(display.replace('×', '*').replace('÷', '/'))
        const calculation = `${display} = ${result}`
        addToHistory(calculation)
        setDisplay(result.toString())
      } catch {
        setDisplay('Error')
      }
    } else if (value === '⌫') {
      setDisplay(display.length > 1 ? display.slice(0, -1) : '0')
    } else if (value === '%') {
      try {
        const result = eval(display) / 100
        setDisplay(result.toString())
      } catch {
        setDisplay('Error')
      }
    } else {
      setDisplay(display === '0' || display === 'Error' ? value : display + value)
    }
  }

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    e.preventDefault()
    const key = e.key
    if (/[0-9]/.test(key)) handleInput(key)
    else if (key === '+' || key === '-') handleInput(key)
    else if (key === '*') handleInput('×')
    else if (key === '/') handleInput('÷')
    else if (key === 'Enter' || key === '=') handleInput('=')
    else if (key === 'Escape') handleInput('C')
    else if (key === 'Backspace') handleInput('⌫')
    else if (key === '%') handleInput('%')
    else if (key === '(' || key === ')' || key === '.') handleInput(key)
  }, [display])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  const buttons = [
    ['C', '⌫', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '(', ')'],
  ]

  const getButtonClass = (btn: string) => {
    if (btn === 'C') return 'calc-btn-clear'
    if (btn === '=') return 'calc-btn-equals'
    if (['+', '-', '×', '÷', '%', '⌫'].includes(btn)) return 'calc-btn-operator'
    return 'calc-btn-number'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 mb-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Calculator</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                📝
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {isDark ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="text-right text-3xl font-mono text-gray-800 dark:text-white break-all">
                {display}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            {buttons.flat().map((btn) => (
              <button
                key={btn}
                onClick={() => handleInput(btn)}
                className={getButtonClass(btn)}
              >
                {btn}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleInput('=')}
            className="calc-btn-equals w-full"
          >
            =
          </button>
        </div>

        {showHistory && history.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 animate-slide-up max-h-60 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">History</h3>
            {history.map((calc, index) => (
              <button
                key={index}
                onClick={() => {
                  const result = calc.split(' = ')[1]
                  if (result) setDisplay(result)
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-300 transition-colors mb-1 font-mono"
              >
                {calc}
              </button>
            ))}
            <button
              onClick={() => {
                setHistory([])
                localStorage.removeItem('calcHistory')
              }}
              className="w-full mt-2 p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  )
}