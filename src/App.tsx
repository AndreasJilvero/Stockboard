import React, { useEffect, useState } from 'react'
import { Layout } from 'react-grid-layout'
import { v4 as uuidv4 } from 'uuid';
import { getLayouts, setLayouts } from './store/layoutStore'
import BarButton from './components/BarButton'
import Board from './components/Board';
import { AppContext } from './contexts/AppContext';
import { BoardType } from './types/board';
import { getDefaultScripts } from './store/scriptStore';
import { Script } from './types/script';

const ADD_NEW_KEY = "wow"

const App: React.FC = () => {
  const defaultLayout: Layout[] = [
    { i: "top", x: 0, y: 0, w: 12, h: 1 },
    { i: "a", x: 0, y: 1, w: 6, h: 10 },
    { i: "b", x: 6, y: 1, w: 4, h: 10 },
    { i: "eurusd", x: 10, y: 1, w: 2, h: 2 },
    { i: "inve", x: 10, y: 1, w: 2, h: 2 },
    { i: "e", x: 10, y: 2, w: 2, h: 3 },
    { i: "empty", x: 10, y: 2, w: 1, h: 1 },
  ];

  const defaultBoard: BoardType = { 
    id: "1", 
    name: "Start", 
    layout: defaultLayout,
    scripts: getDefaultScripts()
  }

  const [showBoards, setShowBoards] = useState(false)
  const [editing, setEditing] = useState(false)
  const [currentBoard, setCurrentBoard] = useState<BoardType>(defaultBoard)
  const [boards, setBoards] = useState<BoardType[]>([defaultBoard])
  const [scriptModal, setScriptModal] = useState("")
  const [currentScript, setCurrentScript] = useState("")

  const createBoard = () => {
    setBoards((oldVal) => (
      [ ...oldVal, { 
        id: `${oldVal.length + 1}`, 
        name: `Board ${oldVal.length + 1}`, 
        layout: [],
        scripts: []
      }]
    ))
  }

  const updateLayout = (layout: Layout[]) => {
    setCurrentBoard(oldVal => {
      const newVal = ({ ...oldVal, layout })
      return newVal
    })
  }

  const closeScript = (save: boolean) => {
    if (save && currentScript) {
      setCurrentBoard((oldVal) => {
        const entry = oldVal.scripts.find(item => item.cell === scriptModal)

        if (entry) {
          entry.script = currentScript
        } else {
          const newEntry: Script = {
            cell: scriptModal,
            script: currentScript
          }

          oldVal.scripts.push(newEntry)
        }

        return { ...oldVal }
      })
    }

    setCurrentScript("")
    setScriptModal("")
  }

  const keyListener = (ev: globalThis.KeyboardEvent) => {
    if (ev.altKey) {
      if (ev.code === "KeyT") {
        setEditing(value => !value)
      }

      if (ev.code === "KeyC") {
        createBoard()
      }

      if (ev.code === "KeyB") {
        setShowBoards(value => !value)
      }

      if (ev.code === "KeyA") {
        setCurrentBoard(oldValue => {
          const handleEmptyBoard = (): Layout => {
            return {
              i: ADD_NEW_KEY,
              x: 0,
              y: 0,
              w: 1,
              h: 1
            }
          }

          const handleFilledBoard = (layout: Layout[]): Layout => {
            const last = layout[layout.length-1] 
    
            last!.i = uuidv4()
  
            return {
              i: ADD_NEW_KEY,
              x: 999,
              y: 999,
              w: 1,
              h: 1
            }
          }

          const cell: Layout =  (oldValue.layout.length === 0) 
            ? handleEmptyBoard() 
            : handleFilledBoard(oldValue.layout)

          return {...oldValue, layout: [...oldValue.layout, cell] }
        })
      }

      boards.forEach((item, i) => {
        if (ev.key === item.id) {
          setCurrentBoard(item)
        }
      })
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyListener)

    return () => document.removeEventListener('keydown', keyListener)
  })

  return (
    <AppContext.Provider value={{ editing }}>
      <div className="w-full min-h-screen bg-black font-mono">
        <header className="
          px-2
          text-slate-100 text-sm
          bg-gradient-to-r from-slate-900 via-green-500 to-slate-900"
        >
          <div className="flex justify-between items-center py-1">
            <h2 className='font-bold text-xl font-poppins'>stockboard</h2>
            <h3 className='text-lg px-2 rounded-lg bg-slate-950'>Current board: {currentBoard.name}</h3>
            <div className='flex gap-1 items-center'>
              <BarButton shortcut='b'>oards</BarButton>
              <BarButton shortcut='t' onClick={() => setEditing(!editing)}>oggle editing</BarButton>
            </div>
          </div>
          {showBoards && boards && (
            <div className='py-1 flex flex-wrap gap-1'>
              {boards.map((item, i) => (
                <BarButton onClick={() => setCurrentBoard(item)} shortcut={item.id} className='px-2 py-1 bg-slate-950 border-2'>
                  {item.name}
                </BarButton>
              ))}
              <BarButton onClick={createBoard} shortcut='c' className='px-2 py-1 bg-slate-950 border-2'>
                reate new
              </BarButton>
            </div>
          )}
        </header>

        <Board board={currentBoard} setLayout={layout => updateLayout(layout)} insertScript={(cell) => setScriptModal(cell)} />
      </div>
      {scriptModal && (
        <div 
          className='absolute top-0 left-0 h-screen w-screen z-10 grid place-items-center text-white'
        >
          <div className='p-4 bg-black h-2/3 w-1/3 border flex flex-col gap-4'>
            <h4 className='text-lg'>Insert widget code from TradingView</h4>
            <span>{currentScript}</span>
            <span>{scriptModal}</span>
            <textarea 
              className='block h-full text-black' 
              value={currentScript}
              onChange={(ev) => setCurrentScript(ev.target.value)}
              rows={20}
            />
            <div className='flex justify-between'>
              <button className='px-8 py-2 bg-blue-500 rounded-lg' onClick={() => closeScript(true)}>Save</button>
              <button className='px-8 py-2 bg-blue-500 rounded-lg' onClick={() => closeScript(false)}>Close without saving</button>
            </div>
          </div>
        </div>
      )}
    </AppContext.Provider>
  )
}

export default App;
