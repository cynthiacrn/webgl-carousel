import { useMemo, useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import planeVertexShader from '../shaders/plane/vertex.glsl'
import planeFragmentShader from '../shaders/plane/fragment.glsl'
import { useTexture } from '@react-three/drei'
import gsap from 'gsap'

export default function Plane({ texture, width, height, active, ...props }) {
  const meshRef = useRef()
  const { viewport } = useThree()
  const tex = useTexture(texture)

  useEffect(() => {
    if (meshRef.current.material) {
      meshRef.current.material.uniforms.uZoomScale.value.x =
        viewport.width / width
      meshRef.current.material.uniforms.uZoomScale.value.y =
        viewport.height / height

      gsap.to(meshRef.current.material.uniforms.uProgress, {
        value: active ? 1 : 0,
        duration: 2.5,
        ease: 'power3.out,'
      })

      gsap.to(meshRef.current.material.uniforms.uRes.value, {
        x: active ? viewport.width : width,
        y: active ? viewport.height : height,
        duration: 2.5,
        ease: 'power3.out,'
      })
    }
  }, [viewport, active])

  useEffect(() => {
    if (meshRef.current.material) {
      meshRef.current.material.uniforms.uRes.value.x = width
      meshRef.current.material.uniforms.uRes.value.y = height
    }
  }, [viewport, width, height])

  const shaderArgs = useMemo(
    () => ({
      vertexShader: planeVertexShader,
      fragmentShader: planeFragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uZoomScale: { value: { x: 1, y: 1 } },
        uTex: { value: tex },
        uRes: { value: { x: 1, y: 1 } },
        uImageRes: {
          value: { x: tex.source.data.width, y: tex.source.data.height }
        }
      },
    }), [tex]
  )

  return (
    <mesh ref={meshRef} {...props}>
      <planeGeometry args={[width, height, 30, 30]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  )
}
