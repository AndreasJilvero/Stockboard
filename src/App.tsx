import React, { useEffect, useState } from 'react'
import ReactGridLayout, { Layout, WidthProvider } from 'react-grid-layout'
import clsx from "clsx"
import InnerHTML from 'dangerously-set-html-content'
import { v4 as uuidv4 } from 'uuid';
import { getLayouts, setLayouts } from './store/layoutStore'
import { getScripts } from './store/scriptStore'
import CustomGridItemComponent from './components/CustomGridItemComponent'
import FancyButtonComponent from './components/FancyButtonComponent'

const ADD_NEW_KEY = "wow"

const GridLayout = WidthProvider(ReactGridLayout);

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

  const storedLayout = getLayouts()
  const storedScripts = getScripts()
  const [currentLayout, setCurrentLayout] = useState<Layout[]>(/*storedLayout || */defaultLayout)
  const [enableEditing, setEnableEditing] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)

  const removeCell = (id: string) => {
    setCurrentLayout(oldValue => oldValue.filter(x => x.i !== id))
  }

  const onLayoutChange = (layout: Layout[]) => {
    setCurrentLayout(layout)
    setLayouts(layout)
  }

  const keyListener = (ev: globalThis.KeyboardEvent) => {
    if (ev.altKey) {
      if (ev.code === "KeyT") {
        setEnableEditing(value => !value)
      }
      
      if (ev.code === "KeyS") {
        setShowToolbar(value => !value)
      }

      if (ev.code === "KeyA") {
        setCurrentLayout(oldValue => {
          console.log(oldValue)
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
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyListener)

    return () => document.removeEventListener('keydown', keyListener)
  }, [])

  return (
    <div className="w-full min-h-screen bg-black">
      <header className="text-slate-100 grid">
        <div 
          className={clsx(`
            flex justify-between items-center 
            bg-gradient-to-r from-slate-900 via-green-500 to-slate-900
            px-8 py-4
          `,
            {
              "hidden": !showToolbar
            }
          )}
          style={{
            gridArea: "1 / 1 / -1 / -1"
          }}
        >
          <h2 className='font-bold text-3xl font-poppins'>stockboard</h2>
          <div className='flex gap-4 items-center'>
            <span>alt+</span>
            <FancyButtonComponent>[b]oards</FancyButtonComponent>
            <FancyButtonComponent onClick={() => setEnableEditing(!enableEditing)}>[t]oggle editing</FancyButtonComponent>
          </div>
        </div>
        <div 
          className={clsx("flex items-end justify-center -bottom-4 relative pointer-events-none", {
            "h-0": !showToolbar
          })} 
          style={{ gridArea: "1 / 1 / -1 / -1" }}>
          <button
            className="
              h-8 w-8 p-4
              bg-black rounded-full text-gray-600 ring ring-white
              inline-flex items-center justify-center
              pointer-events-auto"
            onClick={() => setShowToolbar(value => !value)}
          >
          🔻
          </button>
        </div>
      </header>
      <div className='bg-black text-white m-2'>
        <GridLayout 
          className={clsx("[&>*]:text-center", {
            "[&>*]:border [&>*]:border-solid": enableEditing,
            "[&_div.handle]:hidden": !enableEditing
          })} 
          rowHeight={60}
          layout={currentLayout}
          onLayoutChange={onLayoutChange} 
          cols={12} 
          isResizable={enableEditing}
          draggableHandle=".handle"
        >
          {currentLayout.map(item => 
            <div key={item.i} className={clsx({
              "handle cursor-move": enableEditing
            })}>
              {enableEditing && <button onClick={() => removeCell(item.i)} className='absolute right-0 border border-white font-mono bg-black px-2'>×</button>}
              {storedScripts[item.i] && (
                <InnerHTML html={storedScripts[item.i]} className={clsx("h-full w-full grid place-items-center overflow-hidden", {
                  "pointer-events-none": enableEditing
                })} />
              )}
            </div>
          )}
        </GridLayout>
      </div>
    </div>
  );
}

export default App;
