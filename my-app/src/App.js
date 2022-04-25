import { useEffect, useState } from 'react'
import { knapSackRecursive } from './algorithms/knapsack'
import { iconsMock, itensBag } from './items/mock'
import Item from './components/Item'
import ItemArea from './components/ItemArea';
import './App.css';
import { postTransaction, getSalesStatus } from './services/axios';
import { startDjikstra, knapSackLimitedPathSimple, cidades } from './algorithms/utils';
import Graph from './components/Graph';

function App() {

  const [items, setItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedValuation, setSelectedValuation] = useState([0, 0])
  const [bagWeight, setBagWeight] = useState(20)
  const [solution, setSolution] = useState(null)
  const [solutionValue, setSolutionValue] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [salesStatus, setSalesStatus] = useState({ vendas: 0, viagens: 0, saldo: 0 })
  const [solutionPath, setSolutionPath] = useState([''])
  const [initialNode, setInitialNode] = useState(0)
  const [gameMode, setGameMode] = useState('KNAPSACK_WITH_LIMIT')

  const handleGetStatus = async () => {
    const res = await getSalesStatus();
    setSalesStatus(res);
  }

  useEffect(() => {
    randomizeItems()
    handleGetStatus()
  }, [])

  useEffect(() => {
    if (selectedItems.length === 0) {
      setSelectedValuation([0, 0])
      return
    }

    let actualResult = selectedItems.reduce((acc, curr) => {
      return [acc[0] + curr.value, acc[1] + curr.weight]
    }, [0, 0])
    setSelectedValuation(actualResult)
  }, [selectedItems])

  const handleSelectItem = (item) => {
    const arrayFiltered = items.filter(el => el.name !== item.name)
    setSelectedItems((prevState) => [...prevState, item])
    if (gameMode !== 'KNAPSACK_WITH_LIMIT') return
    setItems(arrayFiltered)
  }

  const handleSelectGameMode = (value) => {
    setGameMode(value)
  }

  useEffect(() => {
    setItems(itensBag)
    resetAttempt()
  }, [gameMode])

  const handleRemoveItem = (item) => {
    if (showSolution) return
    const arrayFiltered = selectedItems.filter(el => el.name !== item.name)
    setSelectedItems(arrayFiltered)
    if (gameMode !== 'KNAPSACK_WITH_LIMIT') return
    setItems((prevState) => [...prevState, item])
  }

  const finishAttempt = async () => {
    setShowSolution(true);
    // if(selectedValuation[1] < bagWeight) {
    //   await postTransaction({ type: 'SALE', value: selectedValuation[0] });
    //   await handleGetStatus();
    // }
  }

  const resetAttempt = () => {
    setShowSolution(false)
    setSolution(null)
    setSelectedItems([])
    randomizeItems()
  }

  const typeKnapsackWithLimit = ({ maxPath, maxWeight }) => {
    const knapsackWithLimit = knapSackLimitedPathSimple(maxPath, maxWeight, initialNode || 0)
    const knapsackWithLimitItemSolution = knapsackWithLimit[3].map((el) => itensBag[el])
    const knapsackWithLimitValue = knapsackWithLimit[0]
    const knapsackWithLimitEndPosition = knapsackWithLimit[4].slice(-1)
    const path = knapsackWithLimit[4].map(el => cidades[el])
    return [knapsackWithLimitItemSolution, knapsackWithLimitValue, knapsackWithLimitEndPosition[0], path]
  }

  const typeStartDjikstra = ({ bagWeight }) => {
    const startDjikstraRes = startDjikstra({ initialNode, bagWeight })
    const startDjikstraItem = startDjikstraRes.finalPath.map((el) => itensBag[el])
    const startDjikstraValue = startDjikstraRes.totalBag
    const startDjikstraEndPosition = startDjikstraRes.finalPath.slice(-1)
    const path = startDjikstraRes.finalPath.map(el => cidades[el])
    return [startDjikstraItem, startDjikstraValue, startDjikstraEndPosition[0], path]
  }


  const randomizeItems = () => {
    const maxPath = Math.floor(Math.random() * 175) + 9
    const maxWeight = Math.floor(Math.random() * 98) + 1
    setBagWeight(maxWeight)
    setItems(itensBag)
    const solution = gameMode === 'KNAPSACK_WITH_LIMIT' ? typeKnapsackWithLimit({ maxPath, maxWeight }) : typeStartDjikstra({ bagWeight: maxWeight })
    setSolution(solution[0])
    setSolutionValue(solution[1])
    setInitialNode(solution[2])
    setSolutionPath(solution[3])
  }

  return (
    <div className="App">

      <div className="mainArea">
        <div className='leftArea'>
          <div className='merchant'>
            <p>Total de vendas: {salesStatus.vendas}</p>
            <p>Total de viagens: {salesStatus.viagens}</p>
            <p>Saldo atual: {salesStatus.saldo}</p>
          </div>
          <div className='merchant'>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '400px', height: '400px', padding: '15px' }}>
              <p>Grafo representativo</p>
              <Graph />
            </div>
          </div>
        </div>
        <div className='rightArea'>
          {

            <ItemArea>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <select name="select" value={gameMode} onChange={(e) => handleSelectGameMode(e.target.value)}>
                  <option value='KNAPSACK_WITH_LIMIT'>With limit</option>
                  <option value='START_DJIKSTRA'>Start djk</option>
                </select>
                <p>Essas são as mercadorias de hoje.</p>
                <p>Você consegue carregar {bagWeight}kg.</p>
              </div>
              {
                items.length > 0 ?
                  items.map((el) => (
                    <Item item={el} key={Math.random()} selectItem={handleSelectItem} />
                  ))
                  :
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <p>Sem mercadorias...</p>
                  </div>
              }
            </ItemArea>
          }
          <ItemArea>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <p>Essas são as mercadorias que podem ser recuperadas</p>
            </div>
            {
              selectedItems.length > 0 ?
                selectedItems.map((el) => (
                  <Item item={el} key={Math.random()} selectItem={handleRemoveItem} />
                ))
                :
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <p>Sem mercadorias...</p>
                </div>

            }
            <div style={{ textAlign: 'center', width: '100%' }}>
              <p>Valor total: {selectedValuation[0]} - Peso: <span style={{ color: selectedValuation[1] > bagWeight ? '#d0342c' : 'black' }}>{selectedValuation[1]}kg</span></p>
            </div>
          </ItemArea>


          {(solution && showSolution) &&
            <ItemArea>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <p>Solução: </p>
              </div>
              {solution.map(el => <Item item={el} key={el.name} selectItem={() => { }} />)}
              <div style={{ textAlign: 'center', width: '100%' }}>
                <p>Valor total: {solutionValue}</p>
              </div>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <p>Caminho: {solutionPath.map((el) => <span>- {el} -</span>)}</p>
              </div>
            </ItemArea>
          }
          <div style={{ display: 'flex' }}>
            {!showSolution &&
              <button className='buttonClass' type='button' onClick={finishAttempt}>Finalizar</button>
            }
            <button className='buttonClass' type='button' onClick={resetAttempt}>Reiniciar</button>
          </div>
        </div>



      </div>
    </div>
  );
}

export default App;
