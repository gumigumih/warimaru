import { useState } from 'react'
import { InputForm } from './components/InputForm'
import type { Person, PaymentItem } from './types'

export const App = () => {
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'Aさん', payments: [] },
    { id: '2', name: 'Bさん', payments: [] },
  ])

  const handleAddPerson = () => {
    const newId = String(people.length + 1)
    const newName = String.fromCharCode(65 + people.length) + 'さん'
    setPeople([...people, { id: newId, name: newName, payments: [] }])
  }

  const handleDeletePerson = (personId: string) => {
    if (window.confirm('この人物を削除してもよろしいですか？\n関連する支払い情報もすべて削除されます。')) {
      setPeople(people.filter(person => person.id !== personId))
    }
  }

  const handleAddPayment = (personId: string, payment: Omit<PaymentItem, 'id'>) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        return {
          ...person,
          payments: [...person.payments, { ...payment, id: String(Date.now()) }],
        }
      }
      return person
    }))
  }

  const handleUpdatePersonName = (personId: string, newName: string) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        return {
          ...person,
          name: newName,
        }
      }
      return person
    }))
  }

  const handleUpdatePayment = (personId: string, paymentId: string, updatedPayment: Omit<PaymentItem, 'id'>) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        return {
          ...person,
          payments: person.payments.map(payment => {
            if (payment.id === paymentId) {
              return {
                ...payment,
                ...updatedPayment,
              }
            }
            return payment
          }),
        }
      }
      return person
    }))
  }

  const handleDeletePayment = (personId: string, paymentId: string) => {
    if (window.confirm('この項目を削除してもよろしいですか？')) {
      setPeople(people.map(person => {
        if (person.id === personId) {
          const newPayments = person.payments.filter(payment => payment.id !== paymentId);
          return {
            ...person,
            payments: newPayments,
          }
        }
        return person
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="max-w-md w-full mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8">割り勘計算</h1>
        <InputForm
          people={people}
          onAddPerson={handleAddPerson}
          onAddPayment={handleAddPayment}
          onUpdatePersonName={handleUpdatePersonName}
          onUpdatePayment={handleUpdatePayment}
          onDeletePerson={handleDeletePerson}
          onDeletePayment={handleDeletePayment}
        />
      </div>
    </div>
  )
}

export default App
