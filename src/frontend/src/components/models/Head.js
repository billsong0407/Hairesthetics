/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 head.gltf --transform
Author: Alexander Antipov (https://sketchfab.com/Dessen)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/male-head-0247a25a04ba46b99629130277fe39b7
Title: Male Head
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import url from "../../../public/head-transformed.glb"

export function Head(props) {
  const { nodes, materials } = useGLTF(url)
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_2.geometry} material={materials['Scene_-_Root']} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload(url)
