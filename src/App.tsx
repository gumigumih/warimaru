import { useState } from 'react'
import { InputForm } from './components/InputForm'
import { ResultScreen } from './components/ResultScreen'
import warimaruSvg from './assets/warimaru.svg'

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
        <div className="flex justify-center mb-4">
          <img src={warimaruSvg} alt="わりまる" className="w-1/2" />
        </div>
        <p className="text-center text-white mb-8 text-shadow-2xl">
          飲み会や旅行の支払いを<br />
          簡単に計算できます。<br />
          誰がいくら払ったか入力するだけで<br />
          精算金額が自動計算！
        </p>
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
