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
    // 背景画像を追加
    // https://patternico.com/#QAXtfEV1apVwKHgv
    <div className="min-h-screen relative py-20 sm:py-12 bg-gradient-to-br from-sky-600 via-sky-400 to-sky-700">
      <div className="absolute inset-0 bg-[url('./assets/background.png')] bg-center opacity-30"></div>
      <div className="relative max-w-md w-full mx-auto px-4">
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
