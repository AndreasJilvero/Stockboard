import React, { useEffect, useState } from 'react'
import { Layout } from 'react-grid-layout'
import { v4 as uuidv4 } from 'uuid'
import { AppContext } from './contexts/AppContext'
import { BoardType, DEFAULT_ID, DEFAULT_NAME } from './types/board'
import { Script } from './types/script'
import { DEFAULT_SCRIPTS, getScripts, saveScripts } from './store/scriptStore'
import { DEFAULT_LAYOUT, getLayout, saveLayout } from './store/layoutStore'
import { getBoards, saveBoards } from './store/boardStore'
import BarButton from './components/BarButton'
import Board from './components/Board'

const App: React.FC = () => {
  const DEFAULT_BOARD: BoardType = { 
    id: DEFAULT_ID, 
    name: DEFAULT_NAME,
  }

  const [showBoards, setShowBoards] = useState(false)
  const [editing, setEditing] = useState(false)
  const [modal, setModal] = useState("")
  const [currentScript, setCurrentScript] = useState("")
  const [currentBoard, setCurrentBoard] = useState(DEFAULT_ID)
  const [boards, setBoards] = useState<BoardType[]>(getBoards() || [])
  const [scripts, setScripts] = useState<Script[]>(getScripts(DEFAULT_ID) || [])
  const [layout, setLayout] = useState<Layout[]>(getLayout(DEFAULT_ID) || [])

  const names = boards.reduce((prev: any, curr) => {
    prev[curr.id] = curr.name
    return prev
  }, {})

  const createBoard = () => {
    const nextBoards = [ ...boards, { 
      id: `${boards.length + 1}`, 
      name: `Board ${boards.length + 1}`,
    }]

    setBoards(nextBoards)
    saveBoards(nextBoards)
  }

  const changeBoard = (id: string) => {
    setCurrentBoard(id)
    setLayout(getLayout(id) || [])
    setScripts(getScripts(id) || [])
  }

  const updateLayout = (nextLayout: Layout[]) => {
    setLayout(nextLayout)
    saveLayout(currentBoard, nextLayout)
  }

  const openModal = (cell: string) => {
    const entry = scripts.find(item => item.cell === cell)

    setCurrentScript(entry?.script || "")
    setModal(cell)
  }

  const closeModal = (save: boolean) => {
    if (save) {
      const nextScripts = [ ...scripts ]
      let entry = nextScripts.find(item => item.cell === modal)

      if (entry) {
        entry.script = currentScript
      } else {
        entry = {
          board: currentBoard,
          cell: modal,
          script: currentScript
        }

        nextScripts.push(entry)
      }

      setScripts(nextScripts)
      saveScripts(currentBoard, nextScripts)
    }

    setCurrentScript("")
    setModal("")
  }

  const createCell = (x: number, y: number): Layout => {
    return {
      i: uuidv4(),
      x,
      y,
      w: 1,
      h: 1,
    }
  }

  const addCell = () => {
    const cell: Layout =  (layout.length === 0) 
      ? createCell(0, 0) 
      : createCell(999, 999)

    updateLayout([...layout, cell])
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
        addCell()
      }

      boards.forEach((item, i) => {
        if (ev.key === item.id && currentBoard !== item.id) {
          changeBoard(item.id)
        }
      })
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyListener)

    return () => document.removeEventListener('keydown', keyListener)
  }, [])

  useEffect(() => {
    if (!getScripts(DEFAULT_ID)) {
      setScripts(DEFAULT_SCRIPTS)
      saveScripts(DEFAULT_ID, DEFAULT_SCRIPTS)
    }

    if (!getLayout(DEFAULT_ID)) {
      setLayout(DEFAULT_LAYOUT)
      saveLayout(DEFAULT_ID, DEFAULT_LAYOUT)
    }

    if (!getBoards()) {
      setBoards([DEFAULT_BOARD])
      saveBoards([DEFAULT_BOARD])
    }
  }, [])

  return (
    <AppContext.Provider value={{ editing }}>
      <div className="w-full min-h-screen bg-black font-mono">
        <header className="
          px-2
          text-slate-100 text-sm
          bg-gradient-to-r from-slate-900 via-green-500 to-slate-900"
        >
          <div className="flex justify-between items-center py-1">
            <h2 className='font-bold text-xl font-poppins'>gridboard</h2>
            <h3 className='text-lg px-2 rounded-lg bg-slate-950'>Current board: {names[currentBoard]}</h3>
            <div className='flex gap-1 items-center'>
              <BarButton shortcut='a' onClick={() => addCell()}>dd cell</BarButton>
              <BarButton shortcut='b' onClick={(oldVal) => setShowBoards(!oldVal)}>oards</BarButton>
              <BarButton shortcut='t' onClick={() => setEditing(!editing)}>oggle editing</BarButton>
            </div>
          </div>
          {showBoards && boards && (
            <div className='py-1 flex flex-wrap gap-1'>
              {boards.map((item, i) => (
                <BarButton onClick={() => changeBoard(item.id)} shortcut={item.id} className='px-2 py-1 bg-slate-950 border-2'>
                  {item.name}
                </BarButton>
              ))}
              <BarButton onClick={createBoard} shortcut='c' className='px-2 py-1 bg-slate-950 border-2'>
                reate new
              </BarButton>
            </div>
          )}
        </header>

        <Board scripts={scripts} layout={layout} setLayout={nextLayout => updateLayout(nextLayout)} handleScript={(cell) => openModal(cell)} />
      </div>
      {modal && (
        <div 
          className='absolute top-0 left-0 h-screen w-screen z-10 grid place-items-center text-white'
        >
          <div className='p-4 bg-black h-2/3 w-1/3 border flex flex-col gap-4'>
            <h4 className='text-lg'>Insert widget code from TradingView</h4>
            <textarea 
              className='block h-full text-black' 
              value={currentScript}
              onChange={(ev) => setCurrentScript(ev.target.value)}
              rows={20}
            />
            <div className='flex justify-between'>
              <button className='px-8 py-2 bg-blue-500 rounded-lg' onClick={() => closeModal(true)}>Save</button>
              <button className='px-8 py-2 bg-blue-500 rounded-lg' onClick={() => closeModal(false)}>Close without saving</button>
            </div>
          </div>
        </div>
      )}
    </AppContext.Provider>
  )
}

export default App;
