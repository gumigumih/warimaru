import { useState } from 'react'
import { InputForm } from './components/organisms/InputForm'
import { ResultScreen } from './components/templates/ResultScreen'
import { Header } from './components/templates/Header'
import { Footer } from './components/templates/Footer'
import { Background } from './components/templates/Background'

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
      <Footer />
    </Background>
  )
}

export default App
