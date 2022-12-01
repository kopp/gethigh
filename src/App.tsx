import { useState } from 'react'
import { Grid } from "./components/Grid"
import './App.css'

function App() {
  const [width, setWidth] = useState<number>(5);
  const [height, setHeight] = useState<number>(5);

  return (
    <div className="App">
      <h1>GetHigh</h1>
      <div className="controls">
        Pick your challenge:{" "}
        <label htmlFor="width">width:</label>
        <input type="number" min={1} max={10} maxLength={3} id="width" name="width" value={width} onChange={event => setWidth(parseInt(event.target.value))} />{" "}
        <label htmlFor="height">height:</label>
        <input type="number" min={1} max={10} maxLength={3} id="height" name="height" value={height} onChange={event => setHeight(parseInt(event.target.value))} />
      </div>
      <div id="grid">
        {/* key is used to re-initialize the grid when width and/or height changes */}
        <Grid width={width} height={height} key={width * height} maxInitValue={3} />
      </div>
      <div>
        <p>
          Goal: Get the highest number possible.
        </p>
        <p>
          Getting higher numbers: You can "merge" multiple numbers of the same value when they are connected (neighbors in left/right/up/down direction). Click on one (connected cells are highlighted), then on a second.  All highlightes numbers will get "merged" to a number one higher than before where you clicked last time.  All other highlighted cells are removed.  Existing cells above them "slide" down to fill the holes, new (random) number from the top fill gaps.
        </p>
      </div>
    </div>
  )
}

export default App
