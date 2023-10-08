
import './App.css'
import { Card } from './components/card/card'
import { useImageData } from './hooks/useImageData'

function App() {
  
  const { data } = useImageData()

  return (
    <>
      <div className='container'>
        <h1 className='text-center text-white'>Valorant Guess</h1>
        <div>
          {data &&  <Card image={data.displayIcon} slot={data.slot}/>}
        </div>
      </div>
    </>
  )
}

export default App
