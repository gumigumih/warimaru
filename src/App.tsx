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
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-400 to-sky-700 py-20 sm:py-12">
      <div className="max-w-md w-full mx-auto px-4">
        <h1 className="text-center text-4xl font-bold text-white mb-2 text-shadow-2xl">
          わりまる
        </h1>
        <p className="text-center text-white mb-8 text-shadow-2xl">複数人での支払いがある、<br/>ワリカンを計算します。</p>
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
