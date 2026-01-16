import { Home } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Home className="w-16 h-16 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          不動産仲介手数料適性チェック
        </h1>
        <p className="text-gray-600">
          その手数料、払いすぎていませんか？
        </p>
      </div>
    </div>
  )
}

export default App
