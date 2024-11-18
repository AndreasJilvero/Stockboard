import React, { useContext } from 'react'
import ReactGridLayout, { Layout, WidthProvider } from 'react-grid-layout'
import clsx from "clsx"
import InnerHTML from 'dangerously-set-html-content'
import { AppContext } from '../contexts/AppContext'
import { Script } from '../types/script'

const GridLayout = WidthProvider(ReactGridLayout)

const Board: React.FC<{ 
  layout: Layout[]
  scripts: Script[]
  setLayout: (layout: Layout[]) => void
  handleScript: (cell: string) => void
}> = ({ 
  layout,
  scripts,
  setLayout,
  handleScript,
}) => {
  const appContext = useContext(AppContext)

  const scriptMap = scripts.reduce((prev: any, curr) => {
    prev[curr.cell] = curr.script
    return prev
  }, {})

  const removeCell = (id: string) => {
    setLayout(layout.filter(x => x.i !== id))
  }

  return (
    <div className='bg-black text-white m-2'>
      <GridLayout 
        className={clsx("[&>*]:text-center", {
          "[&>*]:border [&>*]:border-solid": appContext.editing,
          "[&_div.handle]:hidden": !appContext.editing
        })} 
        rowHeight={60}
        layout={layout}
        onLayoutChange={(layout) => setLayout(layout)}
        cols={12} 
        isResizable={appContext.editing}
        draggableHandle=".handle"
      >
        {layout.map(item => 
          <div key={item.i} className={clsx({
            "handle cursor-move": appContext.editing
          })}>
            {appContext.editing && (
              <div className='absolute right-0 bg-black flex'>
                <button onClick={() => handleScript(item.i)} className='border border-white px-2 py-1'>✏️</button>
                <button onClick={() => removeCell(item.i)} className='border border-white px-2 py-1'>❌</button>
              </div>
            )}
            {scriptMap[item.i] ? (
              <InnerHTML html={scriptMap[item.i]} allowRerender={true} className={clsx("h-full w-full grid place-items-center overflow-hidden", {
                "pointer-events-none": appContext.editing
              })} />
            ) : (
              <a 
                onClick={() => handleScript(item.i)} 
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
