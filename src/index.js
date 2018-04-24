import React, { Component } from "react";
import PropTypes from 'prop-types';

import { mapKeys } from "lodash";

const directions = ["x", "y"];


export const Palette = {
  white: {
    color: [255, 255, 255],
    shading: [160, 190, 218]
  },
  orange: {
    color: [255, 250, 230],
    shading: [255, 120, 50]
  },
  green: {
    color: [205, 255, 204],
    shading: [0, 211, 136]
  },
  red: {
    color: [190, 10, 0],
    shading: [200, 250, 200]
  }
};



/*
  - Size
  - Speed
  - Per side:
    onClick onDoubleClick onDrag onDragEnd onDragEnter onDragExit
    onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
    onMouseMove onMouseOut onMouseOver onMouseUp
*/
export default class Cube extends Component {

  state = {
    x: this.props.x,
    y: this.props.y,
    sides: {
      front: this.createSide({
        transform: {
          rotate_x: 0,
          rotate_y: 0,
          rotate_z: 0,
        }
      }),
      back: this.createSide({
        transform: {
          rotate_x: 0,
          rotate_y: -180,
          rotate_z: 0,
        }
      }),
      left: this.createSide({
        transform: {
          rotate_x: 0,
          rotate_y: -90,
          rotate_z: 0,
        }
      }),
      right: this.createSide({
        transform: {
          rotate_x: 0,
          rotate_y: 90,
          rotate_z: 0,
        }
      }),
      top: this.createSide({
        transform: {
          rotate_x: 90,
          rotate_y: 0,
          rotate_z: 0,
        }

      }),
      bottom: this.createSide({
        transform: {
          rotate_x: -90,
          rotate_y: 0,
          rotate_z: 0,
        }
      }),
    },
  }

  createSide(side) {
    const [r, g, b] = this.props.palette.color;
    return {
      style: {
        position: "absolute",
        width: this.props.size,
        height: this.props.size,
        transform: `rotateX(${side.transform.rotate_x}deg) rotateY(${side.transform.rotate_y}deg) rotateZ(${side.transform.rotate_z}deg)`,
        backgroundColor: `rgb(${r}, ${g}, ${b})`,//"#07427a",
        transformStyle: "preserve-3d",
        perspective: "600px",
        backfaceVisibility: "hidden",
        willChange: "transform",
      },
      tint: this.props.palette,
      rotate: {
        x: side.transform.rotate_x,
        y: side.transform.rotate_y,
        z: side.transform.rotate_z,
      }
    };
  }


  getDistance(side) {
    return directions.reduce((object, axis) => {
      //// console.log(object, axis);
      object[axis] = Math.abs(this.state[axis] + side.rotate[axis]);
      return object;
    }, {});
  }


  getRotationSide(side) {
    const axis = side.rotate.x ? "Z" : "Y";
    const direction = side.rotate.x > 0 ? -1 : 1;
    return `
      rotateX(${this.state.x + side.rotate.x}deg)
      rotate${axis}(${direction * (this.state.y + side.rotate.y)}deg)
      translateZ(${this.props.size / 2}px)
    `;
  }


  interpolate (e, t, n) {
    return e * (1 - n) + t * n;
  }


  getShading(side, distance) {
    const darken = directions.reduce((object, axis) => {
      const delta = distance[axis];
      const ratio = delta / 180;
      object[axis] = delta > 180 ? Math.abs(2 - ratio) : ratio;
      return object;
    }, {});

    if (side.rotate.x) {
      darken.y = 0;
    } else {
      const {x} = distance;
      if (x > 90 && x < 270) {
        directions.forEach(axis => darken[axis] = 1 - darken[axis]);
      }
    }

    const alpha = (darken.x + darken.y) / 2;
    const blend = (value, index) => Math.round(this.interpolate(
        value,
        this.props.palette.shading[index],
        // side.tint.shading[index],
        alpha
      )
    );
    const [r, g, b] = this.props.palette.color.map(blend);
    return `rgb(${r}, ${g}, ${b})`;
  }


  verifyCubeCoordsEdges() {
    var state = this.state;
    var { speed } = this.props;
    directions.forEach((axis) => {
      state[axis] += speed[axis];
      if (Math.abs(state[axis]) < 360) {
        return;
      }
      const max = Math.max(state[axis], 360);
      const min = max == 360 ? Math.abs(state[axis]) : 360;
      state[axis] = max - min;
    });
    this.setState(state);
  }


  updateSides() {
    const keys_sides = [ "top", "bottom", "left", "right", "front", "back" ];
    var { sides } = this.state;
    for (var i = 0; i < keys_sides.length; i++) {
      //
      var side = sides[keys_sides[i]];
      var distance = this.getDistance(
        side
      );
      side.style = {
        ...side.style,
        transform: this.getRotationSide(side),
        backgroundColor: this.getShading(side, distance),
        ...this.props.hasOwnProperty("sides") ? this.props.sides[keys_sides[i]].style : {},
      };
    }
    this.verifyCubeCoordsEdges();
    this.setState({
      sides: sides
    });
    requestAnimationFrame(
      this.updateSides.bind(this)
    );
  }


  update() {
    requestAnimationFrame(this.updateSides.bind(this));

    this.now = Date.now();
    this.delta = this.now - this.then;

    if (this.delta > this.interval) {
      this.then = this.now - (this.delta % this.interval);
      this.updateSides();
    }
  }


  constructor(props) {
    super(props);
    this.fps = 30;
    this.now;
    this.then = Date.now();
    this.interval = 1000/this.fps;
    this.delta;
  }

  componentDidMount() {
    this.update();
  }

  render() {

    const { top, left } = this.props;

    const sides = [];
    const shadows = [];

    mapKeys(this.state.sides, (value, key) => {
      shadows.push(
        <div
          key={key}
          style={
            {
              ...value.style,
              backgroundColor: "#07427a"
            }
          }
        />
      );
      sides.push(
        <div
          onClick={(e) => this.props.onClick ? this.props.onClick(e, key, value) : null}
          onDoubleClick={(e) => this.props.onDoubleClick ? this.props.onDoubleClick(e, key, value) : null}
          onDrag={(e) => this.props.onDrag ? this.props.onDrag(e, key, value) : null}
          onDragEnd={(e) => this.props.onDragEnd ? this.props.onDragEnd(e, key, value) : null}
          onDragEnter={(e) => this.props.onDragEnter ? this.props.onDragEnter(e, key, value) : null}
          onDragExit={(e) => this.props.onDragExit ? this.props.onDragExit(e, key, value) : null}
          onDragLeave={(e) => this.props.onDragLeave ? this.props.onDragLeave(e, key, value) : null}
          onDragOver={(e) => this.props.onDragOver ? this.props.onDragOver(e, key, value) : null}
          onDragStart={(e) => this.props.onDragStart ? this.props.onDragStart(e, key, value) : null}
          onDrop={(e) => this.props.onDrop ? this.props.onDrop(e, key, value) : null}
          onMouseDown={(e) => this.props.onMouseDown ? this.props.onMouseDown(e, key, value) : null}
          onMouseEnter={(e) => this.props.onMouseEnter ? this.props.onMouseEnter(e, key, value) : null}
          onMouseLeave={(e) => this.props.onMouseLeave ? this.props.onMouseLeave(e, key, value) : null}
          onMouseMove={(e) => this.props.onMouseMove ? this.props.onMouseMove(e, key, value) : null}
          onMouseOut={(e) => this.props.onMouseOut ? this.props.onMouseOut(e, key, value) : null}
          onMouseOver={(e) => this.props.onMouseOver ? this.props.onMouseOver(e, key, value) : null}
          onMouseUp={(e) => this.props.onMouseUp ? this.props.onMouseUp(e, key, value) : null}
          onWheel={(e) => this.props.onWheel ? this.props.onWheel(e, key, value) : null}
          key={key}
          style={{
            ...value.style
          }}
        />
      );
    })

    return (
      <div
        style={{
          width: this.props.size,
          height: this.props.size,
          top,
          left,
          position: "absolute",
        }}

      >
        <div
          style={{
            zIndex: 0,
            position: "absolute",
            top: "40%", left:0, right: 0, bottom: 0,
            transformStyle: "preserve-3d",
            perspective: "600px",
            backfaceVisibility: "hidden",
            willChange: "transform",
            "transform": `translateZ(-${this.props.size}px)`,
            filter: `blur(${Math.round(this.props.size * this.props.blurFactor)}px)`,
            opacity: Math.min(this.props.size / 120, this.props.opacityFactor)
          }}
        >
          {
            shadows
          }
        </div>
        <div
          style={{
            zIndex: 100,
            transformStyle: "preserve-3d",
            perspective: "600px",
            backfaceVisibility: "hidden",
            willChange: "transform",
          }}

        >
          {
            sides
          }
        </div>
      </div>
    )
  }

}



Cube.propTypes = {
  palette: PropTypes.object,
  speed: PropTypes.object,
  size: PropTypes.number,
  blurFactor: PropTypes.number,
  opacityFactor: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
};


// Specifies the default values for props:
Cube.defaultProps = {
  palette: Palette.white,
  speed: { x: -0.11111, y: 0.1111 },
  size: 100,
  blurFactor: 0.2,
  opacityFactor: 0.4,
  x: 0,
  y: 0
};
