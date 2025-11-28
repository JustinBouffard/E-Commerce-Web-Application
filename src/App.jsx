import { useState } from 'react'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <main className="app">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <ProductList searchQuery={searchQuery} />
    </main>
  )
}

export default App
