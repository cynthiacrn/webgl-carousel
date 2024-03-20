import { useRef, useState, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import Plane from './Plane.jsx'

export default function CarouselItem() {
  const rootRef = useRef()
  const [hover, setHover] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const { viewport } = useThree()

  useEffect(() => {
    gsap.killTweensOf(rootRef.current.position)
    gsap.to(rootRef.current.position, {
      z: isActive ? 0 : -0.01,
      duration: 0.2,
      ease: 'power3.out',
      delay: isActive ? 0 : 2
    })
  }, [isActive])

  useEffect(() => {
    const hoverScale = hover && !isActive ? 1.1 : 1
    gsap.to(rootRef.current.scale, {
      x: hoverScale,
      y: hoverScale,
      duration: 0.5,
      ease: 'power3.out'
    })
  }, [hover, isActive])

  const handleClose = (e) => {
    e.stopPropagation()
    if (!isActive) return
    setIsActive(false)
  }

  return (
    <group
      ref={rootRef}
      onClick={() => {
        setIsActive(true)
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Plane
        width={1}
        height={2.5}
        texture={
          'https://raw.githubusercontent.com/supahfunk/webgl-carousel/main/public/img/1.jpg'
        }
        active={isActive}
      />

      {isActive ? (
        <mesh position={[0, 0, 0.01]} onClick={handleClose}>
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial transparent={true} opacity={0} color={'red'} />
        </mesh>
      ) : null}
    </group>
  )
}
