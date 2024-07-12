import { useState } from 'react'
import reactLogo from './assets/react.svg'
import bookLogo from './assets/book.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
          <img src={bookLogo} className="logo" alt="Book logo" />
      </div>
      <h1 className='title'>Documentation Analyzer</h1>
      <div className="card">
        <p>Enter a documentation website address</p>
        <input type='text' id='urlBox' name='urlBox'></input>
        <button onClick={() => setCount((count) => count + 1)}>
          Analyze
        </button>
      </div>
      <footer className="footer">
        <p>Built for the INM363: Individual Project module at <a href='https://city.ac.uk'>City, University of London</a></p>
      </footer>
    </>
  )
}

export default App
