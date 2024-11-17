import React, { useContext, useState } from 'react'
import ReactGridLayout, { Layout, WidthProvider } from 'react-grid-layout'
import clsx from "clsx"
import InnerHTML from 'dangerously-set-html-content'
import { getLayouts, setLayouts as storeLayout } from '../store/layoutStore'
import { getScripts } from '../store/scriptStore'
import { AppContext } from '../contexts/AppContext';
import { BoardType } from '../types/board'

const GridLayout = WidthProvider(ReactGridLayout);

const Board: React.FC<{ 
  board: BoardType
  layout: Layout[]
  setLayout: (layout: Layout[]) => void
}> = ({ 
  layout,
  setLayout
}) => {
  const appContext = useContext(AppContext)
  const storedLayout = getLayouts()
  const storedScripts = getScripts()

  const removeCell = (id: string) => {
    setLayout(layout.filter(x => x.i !== id))
  }

  const onLayoutChange = (layout: Layout[]) => {
    setLayout(layout)
    storeLayout(layout)
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
        onLayoutChange={onLayoutChange} 
        cols={12} 
        isResizable={appContext.editing}
        draggableHandle=".handle"
      >
        {layout.map(item => 
          <div key={item.i} className={clsx({
            "handle cursor-move": appContext.editing
          })}>
            {appContext.editing && <button onClick={() => removeCell(item.i)} className='absolute right-0 border border-white bg-black px-2'>×</button>}
            {storedScripts[item.i] ? (
              <InnerHTML html={storedScripts[item.i]} className={clsx("h-full w-full grid place-items-center overflow-hidden", {
                "pointer-events-none": appContext.editing
              })} />
            ) : (
              <a className='h-full w-full grid place-items-center bg-slate-950 border border-slate-600'>insert code</a>
            )}
          </div>
        )}
      </GridLayout>
    </div>
  )
}

export default Board
