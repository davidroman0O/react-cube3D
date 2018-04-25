# react-cube3d

## Installation

```bash
npm install --save react-cube3d
```
![Example](https://media.giphy.com/media/2vmgLXBybBE1XLkISW/giphy.gif)

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
<<<<<<< HEAD
=======

>>>>>>> 32116385c60c676b3f71f692aae4386c9c7487d3
