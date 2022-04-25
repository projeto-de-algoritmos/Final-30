import { useEffect, useState } from 'react'
import { knapSackRecursive } from './algorithms/knapsack'
import { iconsMock } from './items/mock'
import Item from './components/Item'
import ItemArea from './components/ItemArea';
import './App.css';
import { postTransaction, getSalesStatus } from './services/axios';

function App() {

    const [items, setItems] = useState([])
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedValuation, setSelectedValuation] = useState([0, 0])
    const [bagWeight, setBagWeight] = useState(20)
    const [solution, setSolution] = useState(null)
    const [showSolution, setShowSolution] = useState(false)
    const [salesStatus, setSalesStatus] = useState({vendas: 0, viagens: 0, saldo: 0})

    const handleGetStatus = async() => {
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
        setItems(arrayFiltered)
    }

    const handleRemoveItem = (item) => {
        if (showSolution) return
        const arrayFiltered = selectedItems.filter(el => el.name !== item.name)
        setItems((prevState) => [...prevState, item])
        setSelectedItems(arrayFiltered)
    }

    const finishAttempt = async () => {
        setShowSolution(true);
        await postTransaction({ type: 'SALE', value: selectedValuation[0] });
        await handleGetStatus();
    }

    const resetAttempt = () => {
        setShowSolution(false)
        setSolution(null)
        setSelectedItems([])
        randomizeItems()
    }


    const randomizeItems = () => {
        const size = Math.floor(Math.random() * 20) + 5
        const weight = Math.floor(Math.random() * 120) + 20
        setBagWeight(weight)
        const numbers = new Set([])
        const selected = []

        while (numbers.size < size) {
            numbers.add(Math.floor(Math.random() * 36))
        }
        numbers.forEach((el) => selected.push(iconsMock[el]))
        const solutionList = knapSackRecursive(weight, selected, selected.length)
        setSolution(solutionList)
        setItems(selected)
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
                </div>
                <div className='rightArea'>
                    {

                        <ItemArea>
                            <div style={{ textAlign: 'center', width: '100%' }}>
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
                            <p>Essas são as mercadorias selecionadas</p>
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
                            {solution[1].map(el => <Item item={el} key={el.name} selectItem={() => { }} />)}
                            <div style={{ textAlign: 'center', width: '100%' }}>
                                <p>Valor total: {solution[0]}</p>
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
