import { useState } from 'react'
import { InputForm } from './components/InputForm'
import { ResultScreen } from './components/ResultScreen'

export const App = () => {
  const [showResult, setShowResult] = useState(false);

  const handleShowResult = () => {
    setShowResult(true);
  };

  const handleBack = () => {
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 py-6 flex flex-col justify-center sm:py-12">
      <div className="max-w-md w-full mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8 text-white">割り勘計算</h1>
        {showResult ? (
          <ResultScreen
            onBack={handleBack}
          />
        ) : (
          <InputForm
            onShowResult={handleShowResult}
          />
        )}
      </div>
    </div>
  )
}

export default App
