import React, { HTMLProps, useState } from 'react';
import ReactGridLayout, { Layout, WidthProvider } from 'react-grid-layout';
import InnerHTML from 'dangerously-set-html-content'
import clsx from "clsx"

const addNewKey = "wow"

const GridLayout = WidthProvider(ReactGridLayout);

const CustomGridItemComponent = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement> & { content?: string }>(({style, className, onMouseDown, onMouseUp, onTouchEnd, content, ...props}, ref) => {
  return (
    <div style={{...style}} className={className} ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchEnd={onTouchEnd} {...props}>
      <div className='absolute -top-3 -left-2 m-0 handle'>
        <button className='bg-white rounded-full inline-flex items-center justify-center text-gray-600 ring ring-offset-2 ring-gray-700 cursor-move'>
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {content && <InnerHTML className="h-full w-full grid place-items-center" html={content} />}
      {!content && (
        <div className='h-full w-full grid place-items-center'>
          <button className='px-4 py-2 border rounded-lg border-solid border-blue' type='button'>Insert code</button>
        </div>
      )}
    </div>
  );
})

const App: React.FC = () => {
  const layout: Layout[] = [
    { i: "top", x: 0, y: 0, w: 12, h: 1 },
    { i: "a", x: 0, y: 1, w: 6, h: 10 },
    { i: "b", x: 6, y: 1, w: 4, h: 10 },
    { i: "c", x: 10, y: 1, w: 2, h: 2 },
    { i: "d", x: 10, y: 1, w: 2, h: 2 },
    { i: "e", x: 10, y: 2, w: 2, h: 3 },
    { i: "f", x: 10, y: 2, w: 1, h: 1 }
  ];

  const [currentLayout, setCurrentLayout] = useState<Layout[]>(layout)
  const [enableEditing, setEnableEditing] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)

  const toggleToolbar = () => {
    if (showToolbar) {
      setEnableEditing(false)
    }

    setShowToolbar(!showToolbar)
  }

  const onLayoutChange = (layout: Layout[]) => {
    setCurrentLayout(layout)
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

  console.log(`Enable edit: ${enableEditing}`)
  console.log(`Show toolbar: ${showToolbar}`)

  return (
    <div className="w-full h-full bg-black">
      <header className="text-slate-100 grid">
        <div 
          className={clsx(`
            flex justify-between items-center 
            bg-gradient-to-r from-pink-800 via-purple-500 to-slate-900
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
          <div className='px-4 py-2 border rounded-lg border-solid border-blue-700 font-mono bg-black shadow-sm shadow-white'>
              <button type='button' onClick={() => setEnableEditing(!enableEditing)}>[t]oggle view mode</button>
            </div>
            <div className='px-4 py-2 border rounded-lg border-solid border-blue-700 font-mono bg-black shadow-sm shadow-white'>
              <button>[c]reate new</button>
            </div>
            <div className='px-4 py-2 border rounded-lg border-solid border-blue-700 font-mono bg-black shadow-sm shadow-white'>
              <button>login</button>
            </div>
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
            onClick={toggleToolbar}
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
          <CustomGridItemComponent key="c" content={`<!-- TradingView Widget BEGIN -->
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
          <CustomGridItemComponent key="d" content={`<!-- TradingView Widget BEGIN -->
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
          <div key={addNewKey} className='grid place-items-center'>
            <button className=''>Add new</button>
          </div>
        </GridLayout>
      </div>
    </div>
  );
}

export default App;
