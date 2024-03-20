import { useRef, useState, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import Plane from './Plane.jsx'

export default function CarouselItem({ index, width, height, setActivePlane, activePlane, item }) {
  const rootRef = useRef()
  const [hover, setHover] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isCloseActive, setCloseActive] = useState(false)
  const { viewport } = useThree()
  const timeoutID = useRef()

  useEffect(() => {
    if (activePlane === index) {
      setIsActive(activePlane === index)
      setCloseActive(true)
    } else {
      setIsActive(null)
    }
  }, [activePlane])

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
    setActivePlane(null)
    setHover(false)
    clearTimeout(timeoutID.current)
    timeoutID.current = setTimeout(() => {
      setCloseActive(false)
    }, 1500) // The duration of this timer depends on the duration of the plane's closing animation.
  }

  return (
    <group
      ref={rootRef}
      onClick={() => {
        setActivePlane(index)
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Plane
        width={width}
        height={height}
        texture={item.image}
        active={isActive}
      />

      {isCloseActive ? (
        <mesh position={[0, 0, 0.01]} onClick={handleClose}>
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial transparent={true} opacity={0} color={'red'} />
        </mesh>
      ) : null}
    </group>
  )
}
