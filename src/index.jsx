import './style.css'
import ReactDOM from 'react-dom/client'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import CarouselItem from './three/CarouselItem'
import Carousel from './three/Carousel.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <Canvas>
    <Suspense fallback={null}>
      <Carousel />
    </Suspense>
  </Canvas>
)
