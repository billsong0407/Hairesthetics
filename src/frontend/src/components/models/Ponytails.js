/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 scene.gltf --transform
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import url from '../../../public/ponytails-transformed.glb'

export function Ponytails(props) {
  const { nodes, materials } = useGLTF(url)
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_2.geometry} material={materials.lambert6SG} rotation={[-Math.PI / 2, 0, 0]} material-color={props.color}/>
    </group>
  )
}

useGLTF.preload(url)
