/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 manhair2.gltf --transform
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import url from '../../../public/manhair2-transformed.glb'

export function ManHair2(props) {
  const { nodes, materials } = useGLTF(url)
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes['18'].geometry} material-color={props.color} material={materials['07 - Default.004']} position={[0, -3.8, 0]} scale={4.9} />
    </group>
  )
}

useGLTF.preload(url)