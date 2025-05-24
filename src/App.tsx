import { useState } from 'react'
import { Provider } from 'react-redux'
import { InputForm } from './components/InputForm'
import { ResultScreen } from './components/ResultScreen'
import { store } from './store/store'

export const App = () => {
  const [showResult, setShowResult] = useState(false);

  const handleShowResult = () => {
    setShowResult(true);
  };

  const handleBack = () => {
    setShowResult(false);
  };

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="max-w-md w-full mx-auto px-4">
          <h1 className="text-2xl font-bold text-center mb-8">割り勘計算</h1>
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
    </Provider>
  )
}

export default App
