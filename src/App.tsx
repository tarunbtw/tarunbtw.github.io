import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl text-center">
        Vite + React + Tailwind + React Router
      </h1>
      <p className="text-lg text-gray-600 max-w-xl text-center">
        Clean base starter template configured with TypeScript and Tailwind CSS.
      </p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition"
        >
          Count is {count}
        </button>
        <Link
          to="/about"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Go to About
        </Link>
      </div>
    </div>
  )
}

function About() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">About Page</h1>
      <p className="text-gray-600 max-w-md text-center">
        This demonstrates client-side routing with React Router DOM.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <span className="font-semibold text-xl tracking-tight">Vite React App</span>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto flex-1 max-w-5xl px-6 flex items-center justify-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
