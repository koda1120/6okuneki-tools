import { CreditCard } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CreditCard className="w-16 h-16 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          クレカ明細チェッカー
        </h1>
        <p className="text-gray-600">
          クレカ明細から支出をカテゴリ分け・見直し提案
        </p>
      </div>
    </div>
  )
}

export default App
