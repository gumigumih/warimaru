import { useState } from 'react'
import { InputForm } from './components/input/InputForm'
import { ResultScreen } from './components/result/ResultScreen'
import { Header } from './components/layout/Header'
import { Background } from './components/layout/Background'

export const App = () => {
  const [showResult, setShowResult] = useState(false);

  const handleShowResult = () => {
    setShowResult(true);
  };

  const handleBack = () => {
    setShowResult(false);
  };

  return (
    <Background>
      <Header />
      {showResult ? (
        <ResultScreen
          onBack={handleBack}
        />
      ) : (
        <InputForm
          onShowResult={handleShowResult}
        />
      )}
    </Background>
  )
}

export default App
