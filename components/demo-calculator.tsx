"use client"

import type React from "react"
import { useState } from "react"
import { useDemo } from "../contexts/DemoContext"

const DemoCalculator = () => {
  const { isDemoMode, demoStep, nextDemoStep, setDemoStep } = useDemo() // Destructure nextDemoStep
  const [loanAmount, setLoanAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [quote, setQuote] = useState("")

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanAmount(e.target.value)
  }

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestRate(e.target.value)
  }

  const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanTerm(e.target.value)
  }

  const handleGetQuote = () => {
    // Basic calculation logic (replace with actual calculation)
    const calculatedQuote = `Loan Amount: ${loanAmount}, Interest Rate: ${interestRate}, Term: ${loanTerm}`
    setQuote(calculatedQuote)
    nextDemoStep() // Move to step 3 after getting quote
  }

  const handleLoadDemoFiles = () => {
    // Simulate loading demo files
    setLoanAmount("10000")
    setInterestRate("5")
    setLoanTerm("36")
    nextDemoStep() // Move to step 2 after loading demo files
  }

  return (
    <div>
      <h2>Demo Calculator</h2>
      {isDemoMode && <p>Demo Mode Enabled. Step: {demoStep}</p>}
      <div>
        <label>Loan Amount:</label>
        <input type="number" value={loanAmount} onChange={handleLoanAmountChange} />
      </div>
      <div>
        <label>Interest Rate:</label>
        <input type="number" value={interestRate} onChange={handleInterestRateChange} />
      </div>
      <div>
        <label>Loan Term (months):</label>
        <input type="number" value={loanTerm} onChange={handleLoanTermChange} />
      </div>
      <button onClick={handleGetQuote}>Get Quote</button>
      {isDemoMode && demoStep === 1 && <button onClick={handleLoadDemoFiles}>Load Demo Files</button>}
      {quote && (
        <div>
          <h3>Quote:</h3>
          <p>{quote}</p>
        </div>
      )}
    </div>
  )
}

export default DemoCalculator
