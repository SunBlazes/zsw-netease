import { NLayout } from "./components/NLayout"
import { Playerbar } from "./components/Playerbar"
import { usePlayQueueStore } from "./store/playQueueStore"

function App() {
  const currIndex = usePlayQueueStore((state) => state.context.currIndex)

  return (
    <div>
      <NLayout />
      {currIndex !== -1 && <Playerbar />}
    </div>
  )
}

export default App
