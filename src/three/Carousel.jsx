import { useEffect, useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { usePrevious } from 'react-use'
import gsap from 'gsap'
import CarouselItem from './CarouselItem.jsx'
import PostProcessing from './PostProcessing.jsx'
import { lerp, getPiramidalIndex } from '../utils'
import images from '../data/images'

const planeSettings = {
  width: 1,
  height: 2.5,
  gap: 0.2
}

gsap.defaults({
  duration: 2.5,
  ease: 'power3.out'
})

export default function Carousel() {
  const [root, setRoot] = useState()
  const postRef = useRef()

  const [activePlane, setActivePlane] = useState(null)
  const prevActivePlane = usePrevious(activePlane)
  const { viewport } = useThree()

  const progress = useRef(0)
  const startX = useRef(0)
  const isDown = useRef(false)
  const speedWheel = 0.02
  const speedDrag = -0.3
  const oldProgress = useRef(0)
  const speed = useRef(0)
  const items = useMemo(() => {
    if (root) return root.children
  }, [root])
  const displayItems = (item, index, active) => {
    const piramidalIndex = getPiramidalIndex(items, active)[index]
    gsap.to(item.position, {
      x: (index - active) * (planeSettings.width + planeSettings.gap),
      y: items.length * -0.1 + piramidalIndex * 0.1
    })
  }

  useFrame(() => {
    progress.current = Math.max(0, Math.min(progress.current, 100))

    const active = Math.floor((progress.current / 100) * (items.length - 1))
    items.forEach((item, index) => displayItems(item, index, active))
    speed.current = lerp(
      speed.current,
      Math.abs(oldProgress.current - progress.current),
      0.1
    )

    oldProgress.current = lerp(oldProgress.current, progress.current, 0.1)

    if (postRef.current) {
      postRef.current.thickness = speed.current
    }
  })

  const handleWheel = (e) => {
    if (activePlane !== null) return
    const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
    const wheelProgress = isVerticalScroll ? e.deltaY : e.deltaX
    progress.current = progress.current + wheelProgress * speedWheel
  }

  const handleDown = (e) => {
    if (activePlane !== null) return
    isDown.current = true
    startX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0
  }

  const handleUp = () => {
    isDown.current = false
  }

  const handleMove = (e) => {
    if (activePlane !== null || !isDown.current) return
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
    const mouseProgress = (x - startX.current) * speedDrag
    progress.current = progress.current + mouseProgress
    startX.current = x
  }

  useEffect(() => {
    if (!items) return
    if (activePlane !== null && prevActivePlane === null) {
      progress.current = (activePlane / (items.length - 1)) * 100
    }
  }, [activePlane, items])

  const renderPlaneEvents = () => {
    return (
      <mesh
        position={[0, 0, -0.01]}
        onWheel={handleWheel}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerMove={handleMove}
        onPointerLeave={handleUp}
        onPointerCancel={handleUp}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial transparent={true} opacity={0} />
      </mesh>
    )
  }

  const renderSlider = () => {
    return (
      <group ref={setRoot}>
        {images.map((item, index) => (
          <CarouselItem
            width={planeSettings.width}
            height={planeSettings.height}
            setActivePlane={setActivePlane}
            activePlane={activePlane}
            key={item.image}
            item={item}
            index={index}
          />
        ))}
      </group>
    )
  }

  return (
    <group>
      {renderPlaneEvents()}
      {renderSlider()}
      <PostProcessing ref={postRef} />
    </group>
  )
}
