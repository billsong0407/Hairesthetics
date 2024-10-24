import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Loader } from "@react-three/drei"

// import main script and neural network model from  FaceFilter NPM package
import { JEELIZFACEFILTER, NN_4EXPR } from 'facefilter'

// import THREE.js helper, useful to compute pose
// The helper is not minified, feel free to customize it (and submit pull requests bro):
import { ThreeFiberHelper } from '../helpers/ThreeFiberHelper.js'
import { ShortHair } from './models/ShortHair.js'
import { Ponytails } from './models/Ponytails.js'
import { Head } from './models/Head.js'
import { Hat } from './models/Hat.js'
import { Mm } from './models/Mm.js'
import { ManHair0 } from './models/ManHair0.js'
import { ManHair1 } from './models/ManHair1.js'
import { ManHair2 } from './models/ManHair2.js'
import { ManHair3 } from './models/ManHair3.js'
import { ManHair4 } from './models/ManHair4.js'
import { WomanHair1 } from './models/WomanHair1.js'
import { WomanHair2 } from './models/WomanHair2.js'
import { WomanHair3 } from './models/WomanHair3.js'
import { Malehair } from './models/Malehair.js'

// Set the maximum number of detected faces to 1 and create an array to store face followers
const _maxFacesDetected = 1 
const _faceFollowers = new Array(_maxFacesDetected)
let _expressions = null


// Define a component for a mesh that follows the face and put stuff in it
// Its position and orientation is controlled by THREE.js helper
const FaceFollower = (props) => {
  // This reference will give us direct access to the mesh
  const objRef = useRef()

  // Update the array of face followers with the current mesh
  useEffect(() => {
    const threeObject3D = objRef.current
    _faceFollowers[props.faceIndex] = threeObject3D
  })

// Render the mesh
  console.log('RENDER FaceFollower component')
  return (
    <object3D ref={objRef}>


        {/* <mesh name="mainCube">
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshNormalMaterial />
        </mesh> */}
        {props.selectedHair.selectedHair == 0 &&
          <ShortHair
          rotation={[-Math.PI/2, 0, 0]}
          position={[0, 0.45, -0.2]}
          scale={[80, 80, 80]}
          renderOrder={2}
          color={props.selectedHair.color}
          />
        }
        {props.selectedHair.selectedHair == 1 &&
          <WomanHair1
          rotation={[0, 0, 0]}
          position={[0, 0, -0.5]}
          scale={[0.1675, 0.1675, 0.1675]}
          renderOrder={2}
          color={props.selectedHair.color}
          />
        }
        {props.selectedHair.selectedHair == 2 &&
          <Mm
          rotation={[0, 0, 0]}
          position={[-0.2, -1.7, -0.5]}
          scale={[0.08, 0.08, 0.08]}
          renderOrder={2}
          color={props.selectedHair.color}
          />
        }

      {props.selectedHair.selectedHair == 3 &&
          <Malehair
          rotation={[0, 0, 0]}
          position={[0, 0.21, -0.425]}
          scale={[0.88, 0.94, 0.88]}
          renderOrder={2}
          color={props.selectedHair.color}
          />
        }
        {props.selectedHair.selectedHair == 4 &&
          <ManHair1
          rotation={[0, 0, 0]}
          position={[0.175, -0.275, -0.2]}
          scale={[5, 5, 5]}
          renderOrder={2}
          color={props.selectedHair.color}
          />
        }
        {props.selectedHair.selectedHair == 5 &&
          <ManHair2
          rotation={[0, 0, 0]}
          position={[0.1, -0.725, -0.525]}
          scale={[4.40, 4.75, 4.40]}
          renderOrder={2}
          color={props.selectedHair.color}
          />
        }

        {props.selectedHair.selectedHair == 6 &&
          <WomanHair2
          rotation={[0, 0, 0]}
          position={[0.05, -0.875, -0.2750]}
          scale={[4.40, 4.75, 4.40]}
          renderOrder={2}
          color={props.selectedHair.color}
          />
        }
        {/* x, y, z(+ going outward, - going inward) */}
        {props.selectedHair.selectedHair == 7 &&
          <WomanHair3
          rotation={[0, 0, 0]}
          position={[0.05, -0.725, -0.3850]}
          scale={[4.4, 4.75, 4.40]}
          renderOrder={2}
          color={props.selectedHair.color}
          />
        }
        {props.selectedHair.selectedHair == 8 &&
          <ManHair3
          rotation={[0, 0, 0]}
          position={[0.1, -0.555, -0.10]}
          scale={[4.40, 4.75, 4.40]}
          renderOrder={2}
          color={props.selectedHair.color}
          />
        }
        {props.selectedHair.selectedHair == 9 &&
          <ManHair4
          rotation={[0, 0, 0]}
          position={[0.1, -0.555, -0.525]}
          scale={[4.70, 4.85, 4.70]}
          renderOrder={2}
          color={props.selectedHair.color}
          />
        }


        <Head
          position={[0, -1.0, 0]}
          scale={[0.5, 0.45, 0.45]}
          renderOrder={-1}
        />


    </object3D>
  )
}


// fake component, display nothing
// just used to get the Camera and the renderer used by React-fiber:
let _threeFiber = null
const ThreeGrabber = (props) => {
  _threeFiber = useThree()
  useFrame(ThreeFiberHelper.update_camera.bind(null, props.sizing, _threeFiber.camera))
  return null
}


const compute_sizing = () => {
  // compute  size of the canvas:
  const height = window.innerHeight * 7/10
  const width = window.innerWidth *7/10
  // const width = Math.min(wWidth, height)
  // compute position of the canvas:
  const top = window.innerHeight * 8/100
  const left = window.innerWidth *1.5/10
  return {width, height, top, left}
}


const ARCanvas = (selectedHair) => {

  // init state:
  _expressions = []
  for (let i = 0; i<_maxFacesDetected; ++i){
    _expressions.push({
      mouthOpen: 0,
      mouthSmile: 0,
      eyebrowFrown: 0,
      eyebrowRaised: 0
    })
  }
  const [sizing, setSizing] = useState(compute_sizing())
  const [isInitialized] = useState(true)

  let _timerResize = null
  const handle_resize = () => {
    // do not resize too often:
    if (_timerResize){
      clearTimeout(_timerResize)
    }
    _timerResize = setTimeout(do_resize, 200)
  }


  const do_resize = () => {
    _timerResize = null
    const newSizing = compute_sizing()
    setSizing(newSizing)
  }


  useEffect(() => {
    if (!_timerResize) {
      JEELIZFACEFILTER.resize()
    }
  }, [sizing])


  const callbackReady = (errCode, spec) => {
    if (errCode){
      console.log('AN ERROR HAPPENS. ERR =', errCode)
      return
    }

    console.log('INFO: FACEFILTER IS READY')
    // there is only 1 face to track, so 1 face follower:
    ThreeFiberHelper.init(spec, _faceFollowers, callbackDetect)

  }


  const callbackTrack = (detectStatesArg) => {
    // if 1 face detection, wrap in an array:
    const detectStates = (detectStatesArg.length) ? detectStatesArg : [detectStatesArg]

    // update video and THREE faceFollowers poses:
    ThreeFiberHelper.update(detectStates, _threeFiber.camera)

    // render the video texture on the faceFilter canvas:
    JEELIZFACEFILTER.render_video()

    // get expressions factors:
    detectStates.forEach((detectState, faceIndex) => {
      const exprIn = detectState.expressions
      const expression = _expressions[faceIndex]
      expression.mouthOpen = exprIn[0]
      expression.mouthSmile = exprIn[1]
      expression.eyebrowFrown = exprIn[2] // not used here
      expression.eyebrowRaised = exprIn[3] // not used here
    })
  }


  const callbackDetect = (faceIndex, isDetected) => {
    if (isDetected) {
      console.log('DETECTED')
    } else {
      console.log('LOST')
    }
  }

  const faceFilterCanvasRef = useRef(null)
  useEffect(() => {
    window.addEventListener('resize', handle_resize)
    window.addEventListener('orientationchange', handle_resize)

    JEELIZFACEFILTER.init({
      canvas: faceFilterCanvasRef.current,
      NNC: NN_4EXPR,
      maxFacesDetected: 1,
      followZRot: true,
      callbackReady,
      callbackTrack
    })
    return JEELIZFACEFILTER.destroy
  }, [isInitialized])

  console.log('RENDER ARCanvas component')
  return (
    <div>
      <Suspense fallback={null}>
      {/* Canvas managed by three fiber, for AR: */}
      <Canvas className='mirrorX' style={{
        position: 'fixed',
        zIndex: 2,
        ...sizing
      }}
      gl={{
        preserveDrawingBuffer: true // allow image capture
      }}
      updateDefaultCamera = {false}
      >
        <ambientLight />
        <ThreeGrabber sizing={sizing} />
        <FaceFollower faceIndex={0} expression={_expressions[0]} selectedHair={selectedHair}/>
      </Canvas>



    {/* Canvas managed by FaceFilter, just displaying the video (and used for WebGL computations) */}
      <canvas className='mirrorX' ref={faceFilterCanvasRef} style={{
        position: 'fixed',
        zIndex: 1,
        ...sizing
      }} width = {sizing.width} height = {sizing.height} />
      </Suspense>
      <Loader
        styles={{
          "backgroundColor": 'black',
          "fontSize": "5vw",
        }}
        dataStyles={{
          "fontSize": "1.4vw",
        }}
      />
    </div>
  )
}

export default ARCanvas
