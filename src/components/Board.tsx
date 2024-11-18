import React, { useContext } from 'react'
import ReactGridLayout, { Layout, WidthProvider } from 'react-grid-layout'
import clsx from "clsx"
import InnerHTML from 'dangerously-set-html-content'
import { AppContext } from '../contexts/AppContext';
import { BoardType } from '../types/board'
import { Script } from '../types/script';

const GridLayout = WidthProvider(ReactGridLayout);

const Board: React.FC<{ 
  board: BoardType
  setLayout: (layout: Layout[]) => void
  insertScript: (cell: string) => void
}> = ({ 
  board,
  setLayout,
  insertScript,
}) => {
  const appContext = useContext(AppContext)

  const scripts = board.scripts.reduce((prev: any, curr: Script) => {
    prev[curr.cell] = curr.script
    return prev
  }, {})

  const removeCell = (id: string) => {
    setLayout(board.layout.filter(x => x.i !== id))
  }

  return (
    <div className='bg-black text-white m-2'>
      <GridLayout 
        className={clsx("[&>*]:text-center", {
          "[&>*]:border [&>*]:border-solid": appContext.editing,
          "[&_div.handle]:hidden": !appContext.editing
        })} 
        rowHeight={60}
        layout={board.layout}
        onLayoutChange={(layout) => setLayout(layout)}
        cols={12} 
        isResizable={appContext.editing}
        draggableHandle=".handle"
      >
        {board.layout.map(item => 
          <div key={item.i} className={clsx({
            "handle cursor-move": appContext.editing
          })}>
            {appContext.editing && (
              <button onClick={() => removeCell(item.i)} className='absolute right-0 border border-white bg-black px-2'>×</button>
            )}
            {scripts[item.i] ? (
              <InnerHTML html={scripts[item.i]} className={clsx("h-full w-full grid place-items-center overflow-hidden", {
                "pointer-events-none": appContext.editing
              })} />
            ) : (
              <a 
                onClick={() => insertScript(item.i)} 
                className='h-full w-full grid place-items-center bg-slate-950 border border-slate-600 cursor-pointer'
              >
                insert code
              </a>
            )}
          </div>
        )}
      </GridLayout>
    </div>
  )
}

export default Board
