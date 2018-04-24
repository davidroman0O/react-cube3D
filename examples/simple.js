const React = require('react');
const ReactDOM = require('react-dom');
const Cube3D = require('react-cube3D');


const size = 35;

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

ReactDOM.render(
  <div style={{ marginLeft: 10 }}>
    <h1>TEST</h1>
    <Cube3D
        key={Math.random()}
        top={-size/2}
        left={`calc(50% - ${size/2}px)`}
        size={size}
        speed={{
          x: getRandomFloat(-0.55555555555, 0.55555555555),
          y: getRandomFloat(-0.55555555555, 0.55555555555)
        }}
        palette={{
          color: [255, 250, 230],
          shading: [255, 120, 50]
        }}
    />
  </div>,
  document.getElementById('__react-content')
);
