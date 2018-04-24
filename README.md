# react-cube3d

## Installation

```bash
npm install --save react-cube3d
```

## Usage

```jsx
import Cube, { Palette }  from "react-cube3d";

const size = 35;

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

<Cube
  top={-size/2}
  left={`calc(50% - ${size/2}px)`}
  size={size}
  speed={{
    x: getRandomFloat(-0.55555555555, 0.55555555555),
    y: getRandomFloat(-0.55555555555, 0.55555555555)
  }}
  palette={Palette.orange}
/>
```

