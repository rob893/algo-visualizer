import { AppBar, Toolbar } from '@mui/material';
// import { wasmService } from "../services/WasmService";
// import { drawPath, getPoint } from "../utilities/utilities";

export default function ControlBar(): JSX.Element {
  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* <Button onClick={handleReset}>Clear</Button>
        <Button
          onClick={() => {
            gridKeys.flat().forEach(nodeKey => {
              const ele = document.getElementById(nodeKey);

              if (ele && (ele.className === 'visited' || ele.className === 'path')) {
                ele.className = '';
              }
            });
          }}
        >
          Clear Path
        </Button>
        <Button onClick={() => drawPath(wasmService.universe, getPoint(start), getPoint(end), currAlgo, speed)}>
          Find Path!
        </Button>
        <Button onClick={() => (currAlgo = PathFindingAlgorithm.Dijkstra)}>Use Dijkstra's!</Button>
        <Button onClick={() => (currAlgo = PathFindingAlgorithm.Astar)}>Use A*!</Button>
        <Button onClick={() => (speed = 200)}>Slow</Button>
        <Button onClick={() => (speed = 100)}>Normal</Button>
        <Button onClick={() => (speed = 50)}>Fast</Button> */}
      </Toolbar>
    </AppBar>
  );
}
