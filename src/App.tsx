import React, { useEffect, useState, useRef } from 'react'
import ReactGridLayout, { Layout, WidthProvider } from 'react-grid-layout'
import clsx from "clsx"
import InnerHTML from 'dangerously-set-html-content'
import { v4 as uuidv4 } from 'uuid';
import { getLayouts, setLayouts } from './store/layoutStore'
import { getScripts } from './store/scriptStore'
import BarButton from './components/BarButton'
import Board from './components/Board';
import { AppContext } from './contexts/AppContext';
import { BoardType } from './types/board';

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

  const defaultBoard: BoardType = { id: "1", name: "Start", layout: defaultLayout }
  const [showBoards, setShowBoards] = useState(false)
  const [editing, setEditing] = useState(false)
  const [currentBoard, setCurrentBoard] = useState<BoardType>(defaultBoard)
  const [boards, setBoards] = useState<BoardType[]>([defaultBoard])
  const [currentLayout, setCurrentLayout] = useState<Layout[]>(/*storedLayout || */defaultLayout)

  const createBoard = () => {
    setBoards(oldVal => [...oldVal, { id: `${oldVal.length + 1}`, name: `Board ${oldVal.length + 1}` }])
  }

  const setBoard = (board: BoardType) => {
    setCurrentBoard(board)
    setCurrentLayout([])
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
        setCurrentLayout(oldValue => {
          if (oldValue.length === 0) {
            const cell = {
              i: ADD_NEW_KEY,
              x: 0,
              y: 0,
              w: 1,
              h: 1
            } as Layout
  
            return [cell]
          }

          const last = oldValue[oldValue.length-1]
    
          last!.i = uuidv4()

          const cell = {
            i: ADD_NEW_KEY,
            x: 999,
            y: 999,
            w: 1,
            h: 1
          } as Layout
    
          return [...oldValue, cell]
        })
      }

      boards.forEach((item, i) => {
        if (ev.key === item.id) {
          setBoard(item)
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
                <BarButton onClick={() => setBoard(item)} shortcut={item.id} className='px-2 py-1 bg-slate-950 border-2'>
                  {item.name}
                </BarButton>
              ))}
              <BarButton onClick={createBoard} shortcut='c' className='px-2 py-1 bg-slate-950 border-2'>
                reate new
              </BarButton>
            </div>
          )}
        </header>

        <Board board={currentBoard} layout={currentLayout} setLayout={layout => setCurrentLayout(layout)} />
      </div>
    </AppContext.Provider>
  )
}

export default App;
