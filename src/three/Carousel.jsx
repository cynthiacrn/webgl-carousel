import { useEffect, useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { usePrevious } from 'react-use'
import gsap from 'gsap'
import images from '../data/images'

const planeSettings = {
  width: 1,
  height: 2.5,
  gap: 0.1
}

gsap.defaults({
  duration: 2.5,
  ease: 'power3.out'
})

export default function Carousel() {
  const [root, setRoot] = useState()

  const [activePlane, setActivePlane] = useState(null)
  const prevActivePlane = usePrevious(activePlane)
  const { viewport } = useThree()
  const progress = useRef(0)
  const startX = useRef(0)
  const isDown = useRef(false)
  const speedWheel = 0.02
  const speedDrag = -0.3
  const items = useMemo(() => {
    if (root) return root.children
  }, [root])
  const displayItems = (item, index, active) => {
    gsap.to(item.position, {
      x: (index - active) * (planeSettings.width + planeSettings.gap),
      y: 0
    })
  }

  useFrame(() => {
    progress.current = Math.max(0, Math.min(progress.current, 100))

    const active = Math.floor((progress.current / 100) * (items.length - 1))
    items.forEach((item, index) => displayItems(item, index, active))
  })
}
