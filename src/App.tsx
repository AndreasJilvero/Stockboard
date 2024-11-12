import React, { useEffect, useState } from 'react';
import ReactGridLayout, { Layout, WidthProvider } from 'react-grid-layout';
import InnerHTML from 'dangerously-set-html-content'
import clsx from "clsx"
import { createDefaultContentMap } from './seed'
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'

const addNewKey = "wow"

const GridLayout = WidthProvider(ReactGridLayout);

const CustomGridItemComponent: React.FC<{
  content?: string
  editing: boolean
  editWidget: () => void
  deleteWidget: () => void
}> = ({
  content, 
  editing,
  editWidget,
  deleteWidget,
}) => {
  return (
    <div className='grid h-full w-full'>
      <div className='flex' style={{ gridArea: "1 / 1 / -1 / -1" }}>
        {content && <InnerHTML className="h-full w-full grid place-items-center" html={content} />}
        {!content && (
          <div className='flex place-items-center'>
            <button 
              type='button' 
              className='px-4 py-2 border rounded-lg border-solid border-blue'
              onClick={editWidget}
            >
              Insert code
            </button>
          </div>
        )}
      </div>
      {editing && (
        <div 
          className='handle cursor-move flex gap-2 items-center justify-center bg-black bg-opacity-50 text-xs' 
          style={{ gridArea: "1 / 1 / -1 / -1" }}
        >
          <div className='p-2 flex gap-4 bg-black shadow-lg rounded-lg'>
            <button 
              className='bg-blue-600 hover:bg-blue-900 px-2 py-1 rounded shadow-inner'
              onClick={editWidget}
            >
              Edit
            </button>
            <button 
              className='bg-red-600 hover:bg-red-900 px-2 py-1 rounded shadow-inner'
              onClick={deleteWidget}
            >
              Del
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const App: React.FC = () => {
  const defaultLayout: Layout[] = [
    { i: "top", x: 0, y: 0, w: 12, h: 1 },
    { i: "a", x: 0, y: 1, w: 6, h: 10 },
    { i: "b", x: 6, y: 1, w: 4, h: 10 },
    { i: "c", x: 10, y: 1, w: 2, h: 2 },
    { i: "d", x: 10, y: 1, w: 2, h: 2 },
    { i: "e", x: 10, y: 2, w: 2, h: 3 },
    { i: "f", x: 10, y: 2, w: 1, h: 1 }
  ];

  const [currentLayout, setCurrentLayout] = useState<Layout[]>(defaultLayout)
  const [contentMap, setContentMap] = useState<Map<string, string>>(new Map(JSON.parse(localStorage.getItem('content') || "")))
  const [enableEditing, setEnableEditing] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const [currentWidget, setCurrentWidget] = useState<{key: string, content?: string}>()

  const toggleToolbar = () => {
    if (showToolbar) {
      setEnableEditing(false)
    }

    setShowToolbar(!showToolbar)
  }

  const onLayoutChange = (layout: Layout[]) => {
    //setCurrentLayout(layout)
  }

  const save = () => {
    localStorage.setItem('layout', JSON.stringify(currentLayout))
    localStorage.setItem('content', JSON.stringify(Array.from(contentMap.entries())))
  }

  const withAddLayout = (layout: Layout[]): Layout[] => {
    if (!layout) {
      return []
    }

    const last = layout[layout.length-1]

    return [
      ...currentLayout,
      {
        i: addNewKey,
        x: (last?.x || 0) + 1,
        y: (last?.y || 0),
        w: 1,
        h: 1
      }
    ]
  }

  const saveWidget = () => {
    if (currentWidget) {
      setContentMap(contentMap.set(currentWidget.key, currentWidget.content || ""))
      setCurrentWidget(undefined)
    }
  }

  return (
    <div className="min-h-screen w-full h-full bg-black">
      <header 
        className="
          text-slate-300
          bg-gradient-to-r from-pink-800 via-purple-500 to-slate-900"
      >
        {showToolbar && (
          <div className='flex justify-between items-center px-8 py-4'>
            <h2 className='font-bold font-poppins text-3xl'>stockdeck</h2>
            <div className='flex gap-4'>
              <div className='px-4 py-2 border rounded-lg border-solid font-mono bg-black shadow-sm'>
                <button type='button' onClick={() => setEnableEditing(!enableEditing)}>[t]oggle view mode</button>
              </div>
              <div className='px-4 py-2 border rounded-lg border-solid font-mono bg-black shadow-sm'>
                <button>[c]reate new</button>
              </div>
              <div className='px-4 py-2 border rounded-lg border-solid font-mono bg-black shadow-sm'>
                <button type='button' onClick={save}>[s]ave</button>
              </div>
              <div className='px-4 py-2 border rounded-lg border-solid font-mono bg-black shadow-sm'>
                <button>login</button>
              </div>
            </div>
          </div>
        )}
        <div className={clsx("flex items-center justify-center h-4", {
          "!h-0": showToolbar
        })}>
          <button
            className={clsx(`
              h-4 w-4 p-4 z-50
              bg-white rounded-full text-gray-600 ring ring-black
              flex items-center justify-center relative -bottom-2`,
              {
                "!-bottom-0": showToolbar
              }
            )}
            onClick={toggleToolbar}
          >
            {showToolbar ? "☝" : "👇"}
          </button>
        </div>
      </header>

      <div className='bg-black text-white m-2'>
        <GridLayout 
          className={clsx("[&>*]:text-center", {
            "[&>*]:border [&>*]:border-solid": enableEditing,
          })} 
          rowHeight={60}
          onLayoutChange={onLayoutChange} 
          cols={12} 
          autoSize
          isResizable={enableEditing}
          layout={enableEditing ? withAddLayout(currentLayout) : currentLayout}
          draggableHandle=".handle"
        >
          {currentLayout.map(({i}) => (
            <div key={i}>
              <CustomGridItemComponent 
                content={contentMap.get(i)} 
                editing={enableEditing}
                editWidget={() => setCurrentWidget({ key: i, content: contentMap.get(i) })}
                deleteWidget={() => setCurrentLayout(currentLayout.filter(x => x.i !== i))}
              />
            </div>
          ))}
          {enableEditing && (
            <div key={addNewKey} className='grid place-items-center'>
              <button className=''>Add new</button>
            </div>
          )}
        </GridLayout>
      </div>
      <div className={clsx("relative z-10", {
        "hidden": !currentWidget
      })}>
        <div className="fixed inset-0 overflow-y-auto backdrop-brightness-50">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center">
                <h3
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add/edit widget
                </h3>
                <div className="mt-2 text-left font-mono text-xs">
                  <textarea 
                    spellCheck={false}
                    wrap='soft'
                    value={currentWidget?.content} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentWidget({ key: currentWidget?.key || "", content: e.target.value || "" })}
                    rows={20}
                    className="w-full h-full p-2"
                  />
                  {/*<CodeMirror
                    className='w-full h-full'
                    indentWithTab={false}
                    minHeight='200px'
                    extensions={[html()]}
                    value={currentWidget?.content}
                    onChange={(value: string, viewUpdate) => {
                      setCurrentWidget({ key: currentWidget?.key || "", content: value })
                    }}
                  />*/}

                </div>

                <div className="mt-4 flex justify-between font-medium">
                  <button
                    type="button"
                    onClick={saveWidget}
                    className="justify-center rounded-md border border-transparent bg-blue-100 text-blue-900 hover:bg-blue-200 px-4 py-2"
                  >
                    Save
                  </button>
                  <button
                    className='bg-gray-300 px-4 py-2 text-black rounded-md'
                    onClick={() => { setCurrentWidget(undefined) }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
