import { useState } from 'react'
import { InputForm } from './components/organisms/InputForm'
import { PaymentResult } from './components/organisms/PaymentResult'
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
        <PaymentResult
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
