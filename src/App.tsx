import React, { useEffect, useState } from 'react'
import ReactGridLayout, { Layout, WidthProvider } from 'react-grid-layout'
import clsx from "clsx"

import CustomGridItemComponent from './components/CustomGridItemComponent'
import FancyButtonComponent from './components/FancyButtonComponent'
import { getLayoutStore, setLayoutStore } from './store/store'

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
    { i: "f", x: 10, y: 2, w: 1, h: 1 }
  ];

  const storedLayout = getLayoutStore()
  const [currentLayout, setCurrentLayout] = useState<Layout[]>(storedLayout || defaultLayout)
  const [enableEditing, setEnableEditing] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)

  const onLayoutChange = (layout: Layout[]) => {
    setCurrentLayout(layout)
    setLayoutStore(layout)
  }

  const withAddLayout = (layout: Layout[]): Layout[] => {
    if (!layout) {
      return []
    }

    const last = layout[layout.length-1]

    return [
      ...layout,
      {
        i: ADD_NEW_KEY,
        x: (last?.x || 0) + 1,
        y: (last?.y || 0),
        w: 1,
        h: 1
      }
    ]
  }

  const addCell = () => {
    const cell = withAddLayout(currentLayout).pop()

    cell!.i = `${currentLayout.length + 2}`

    setCurrentLayout([ ...currentLayout, cell! ])
  }

  const keyListener = (ev: globalThis.KeyboardEvent) => {
    if (ev.altKey) {
      if (ev.code === "KeyT") {
        setEnableEditing(value => !value)
      }
      
      if (ev.code === "KeyS") {
        setShowToolbar(value => !value)
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
          <div className='flex gap-4'>
            <FancyButtonComponent onClick={() => setEnableEditing(!enableEditing)}>to[g]gle view mode</FancyButtonComponent>
            <FancyButtonComponent>[c]reate new</FancyButtonComponent>
            <FancyButtonComponent>[l]ogin</FancyButtonComponent>
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
          onLayoutChange={onLayoutChange} 
          cols={12} 
          autoSize
          layout={withAddLayout(currentLayout)}
          draggableHandle=".handle"
        >
            <CustomGridItemComponent key="top" content={`<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js" async>
  {
  "symbols": [
    {
      "proName": "FOREXCOM:SPXUSD",
      "title": "S&P 500"
    },
    {
      "proName": "FOREXCOM:NSXUSD",
      "title": "US 100"
    },
    {
      "proName": "FX_IDC:EURUSD",
      "title": "EUR to USD"
    },
    {
      "proName": "BITSTAMP:BTCUSD",
      "title": "Bitcoin"
    },
    {
      "proName": "BITSTAMP:ETHUSD",
      "title": "Ethereum"
    }
  ],
  "showSymbolLogo": true,
  "colorTheme": "dark",
  "isTransparent": false,
  "displayMode": "adaptive",
  "locale": "en"
}
  </script>
</div>
<!-- TradingView Widget END -->`} />
            <CustomGridItemComponent key="a" content={`<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js" async>
  {
  "exchanges": [],
  "dataSource": "AllSWE",
  "grouping": "sector",
  "blockSize": "market_cap_basic",
  "blockColor": "change",
  "locale": "en",
  "symbolUrl": "",
  "colorTheme": "dark",
  "hasTopBar": false,
  "isDataSetEnabled": false,
  "isZoomEnabled": true,
  "hasSymbolTooltip": true,
  "width": "100%",
  "height": "100%"
}
  </script>
</div>
<!-- TradingView Widget END -->`} />
            <CustomGridItemComponent key="b" content={`
              <!-- TradingView Widget BEGIN -->
              <div class="tradingview-widget-container">
                <div class="tradingview-widget-container__widget"></div>
                <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js" async>
                {
                "colorTheme": "dark",
                "dateRange": "12M",
                "exchange": "US",
                "showChart": true,
                "locale": "en",
                "largeChartUrl": "",
                "isTransparent": false,
                "showSymbolLogo": false,
                "showFloatingTooltip": false,
                "width": "100%",
                "height": "100%",
                "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
                "plotLineColorFalling": "rgba(41, 98, 255, 1)",
                "gridLineColor": "rgba(42, 46, 57, 0)",
                "scaleFontColor": "rgba(134, 137, 147, 1)",
                "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
                "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
                "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
                "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
                "symbolActiveColor": "rgba(41, 98, 255, 0.12)"
              }
                </script>
              </div>
              <!-- TradingView Widget END -->
              `
            } />
          <CustomGridItemComponent key="eurusd" content={`<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js" async>
  {
  "symbol": "FX:EURUSD",
  "width": "100%",
  "height": "100%",
  "colorTheme": "dark",
  "isTransparent": false,
  "locale": "en"
}
  </script>
</div>
<!-- TradingView Widget END -->`} />
          <CustomGridItemComponent key="inve" content={`<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js" async>
  {
  "symbol": "OMXSTO:INVE_B",
  "width": "100%",
  "height": "100%",
  "colorTheme": "dark",
  "isTransparent": false,
  "locale": "en"
}
  </script>
</div>
<!-- TradingView Widget END -->`} />
          <CustomGridItemComponent key="e" content={`<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>
  {
  "symbol": "OMXSTO:SX3010PI",
  "width": "100%",
  "height": "100%",
  "locale": "en",
  "dateRange": "12M",
  "colorTheme": "dark",
  "isTransparent": false,
  "autosize": true,
  "largeChartUrl": ""
}
  </script>
</div>
<!-- TradingView Widget END -->`} />
          <CustomGridItemComponent key="f" />
          <div key={ADD_NEW_KEY} className='grid place-items-center'>
            <FancyButtonComponent onClick={addCell}>add new</FancyButtonComponent>
          </div>
        </GridLayout>
      </div>
    </div>
  );
}

export default App;
