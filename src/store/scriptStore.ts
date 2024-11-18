import { DEFAULT_ID } from "../types/board"
import { Script } from "../types/script"

const KEY = "Scripts"

const createKey = (board: string) => `${KEY}-${board}`

export const getScripts = (board: string): Script[] | null => {
  const val = globalThis.localStorage.getItem(createKey(board))

  if (val) {
    return JSON.parse(val)
  }

  return null
}

export const saveScripts = (board: string, scripts: Script[]) => {
  const val = JSON.stringify(scripts)

  globalThis.localStorage.setItem(createKey(board), val)
}

export const DEFAULT_SCRIPTS: Script[] = 
  [{
    board: DEFAULT_ID,
    cell: "eurusd",
    script: `
      <!-- TradingView Widget BEGIN -->
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
      <!-- TradingView Widget END -->`,
  }, {
    board: DEFAULT_ID,
    cell: "inve",
    script: `
      <!-- TradingView Widget BEGIN -->
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
      <!-- TradingView Widget END -->`,
  }, {
    board: DEFAULT_ID,
    cell: "e",
    script: `
      <!-- TradingView Widget BEGIN -->
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
      <!-- TradingView Widget END -->`,
  }, {
    board: DEFAULT_ID,
    cell: "b",
    script: `
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
      <!-- TradingView Widget END -->`,
  }, {
    board: DEFAULT_ID,
    cell: "a",
    script: `
      <!-- TradingView Widget BEGIN -->
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
      <!-- TradingView Widget END -->`,
  }, {
    board: DEFAULT_ID,
    cell: "top", 
    script: `
      <!-- TradingView Widget BEGIN -->
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
      <!-- TradingView Widget END -->`
  }]