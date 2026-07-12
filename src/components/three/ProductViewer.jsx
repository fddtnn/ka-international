import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Float } from '@react-three/drei'
import { FurnitureModel } from './Models.jsx'
import { useLang } from '../../i18n.jsx'

function Rig({ children }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#f0ead8" />
      <directionalLight position={[0, 2, -6]} intensity={0.35} color="#dde4d2" />
      {children}
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={8} blur={2.4} far={2.2} resolution={512} />
    </>
  )
}

function Exporter({ onReady }) {
  const { scene } = useThree()
  useEffect(() => { onReady?.(scene) }, [scene, onReady])
  return null
}

/** Renders only when scrolled into view (deferred 3D loading). */
export function useInView(margin = '200px') {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, inView]
}

export default function ProductViewer({
  product, config, autoRotate = true, float = false,
  camera = [2.6, 1.6, 3.2], targetY = 0.45, className = '',
  showControls = true, minDistance = 1.6, maxDistance = 6,
  enableZoom = true,
}) {
  const { t } = useLang()
  const wrapRef = useRef(null)
  const sceneRef = useRef(null)
  const [wrapInViewRef, inView] = useInView()
  const [fs, setFs] = useState(false)

  const toggleFullscreen = () => {
    const el = wrapRef.current
    if (!document.fullscreenElement) {
      el?.requestFullscreen?.()
      setFs(true)
    } else {
      document.exitFullscreen?.()
      setFs(false)
    }
  }
  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const downloadGLB = async () => {
    if (!sceneRef.current) return
    const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js')
    new GLTFExporter().parse(
      sceneRef.current,
      (result) => {
        const blob = new Blob([result], { type: 'model/gltf-binary' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `${product?.id || 'ka-model'}.glb`
        a.click()
        URL.revokeObjectURL(a.href)
      },
      () => {},
      { binary: true },
    )
  }

  const model = (
    <group position={[0, 0, 0]}>
      <FurnitureModel product={product} config={config} />
    </group>
  )

  return (
    <div
      ref={(el) => { wrapRef.current = el; wrapInViewRef.current = el }}
      className={`relative bg-sand rounded-luxe overflow-hidden ${className}`}
    >
      {inView ? (
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: camera, fov: 32 }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
          style={{ touchAction: 'none' }}
        >
          <Suspense fallback={null}>
            <Rig>
              {float ? (
                <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.35} floatingRange={[0, 0.08]}>
                  {model}
                </Float>
              ) : model}
            </Rig>
            <Exporter onReady={(s) => (sceneRef.current = s)} />
          </Suspense>
          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={enableZoom}
            autoRotate={autoRotate}
            autoRotateSpeed={0.7}
            minDistance={minDistance}
            maxDistance={maxDistance}
            minPolarAngle={0.35}
            maxPolarAngle={Math.PI / 2.05}
            target={[0, targetY, 0]}
          />
        </Canvas>
      ) : (
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
      )}

      {showControls && inView && (
        <>
          <p className="pointer-events-none absolute bottom-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 text-[11px] tracking-[0.18em] uppercase text-charcoal/45 whitespace-nowrap">
            {enableZoom ? t.product.dragHint : t.product.dragHint.split('·')[0].trim()}
          </p>
          <div className="absolute top-3 end-3 flex flex-col gap-2">
            <button
              onClick={toggleFullscreen}
              aria-label={t.product.fullscreen}
              className="glass rounded-full p-2.5 text-charcoal hover:text-olive transition-colors duration-200 cursor-pointer shadow-card"
            >
              {fs ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6"/></svg>
              )}
            </button>
            <button
              onClick={downloadGLB}
              aria-label={t.product.downloadModel}
              title={t.product.downloadModel}
              className="glass rounded-full p-2.5 text-charcoal hover:text-olive transition-colors duration-200 cursor-pointer shadow-card"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
