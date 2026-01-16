import { Smartphone } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Smartphone className="w-16 h-16 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          携帯料金プラン最適化診断
        </h1>
        <p className="text-gray-600">
          100社以上のプランから最適なものを診断します
        </p>
      </div>
    </div>
  )
}

export default App
