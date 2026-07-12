import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { useLang } from '../i18n.jsx'
import { getProduct, defaultConfig } from '../data/products.js'
import { FurnitureModel } from '../components/three/Models.jsx'
import SEO from '../components/SEO.jsx'
import { Page, Icon } from '../components/ui.jsx'

/**
 * "View in Your Room" — camera passthrough with the 3D model overlaid.
 * Drag to move, wheel / pinch to scale, slider to rotate.
 * Falls back to a studio backdrop when camera access is unavailable.
 */
export default function ARView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const product = getProduct(id)
  const videoRef = useRef(null)
  const [camState, setCamState] = useState('idle') // idle | on | denied
  const [pos, setPos] = useState({ x: 0, y: 18 }) // % offsets
  const [scale, setScale] = useState(1)
  const [rot, setRot] = useState(0.6)
  const drag = useRef(null)
  const pinch = useRef(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCamState('on')
    } catch {
      setCamState('denied')
    }
  }

  useEffect(() => () => {
    const stream = videoRef.current?.srcObject
    stream?.getTracks?.().forEach((t) => t.stop())
  }, [])

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }
  }
  const onPointerMove = (e) => {
    if (!drag.current) return
    const dx = ((e.clientX - drag.current.x) / window.innerWidth) * 100
    const dy = ((e.clientY - drag.current.y) / window.innerHeight) * 100
    setPos({ x: Math.max(-38, Math.min(38, drag.current.px + dx)), y: Math.max(-20, Math.min(38, drag.current.py + dy)) })
  }
  const onPointerUp = () => { drag.current = null }
  const onWheel = (e) => setScale((s) => Math.max(0.4, Math.min(2.2, s - e.deltaY * 0.001)))

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      pinch.current = { d, s: scale }
    }
  }
  const onTouchMove = (e) => {
    if (e.touches.length === 2 && pinch.current) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      setScale(Math.max(0.4, Math.min(2.2, pinch.current.s * (d / pinch.current.d))))
    }
  }

  if (!product) return <Page className="pt-40 text-center"><p>{t.common.notFound}</p></Page>

  return (
    <Page className="fixed inset-0 bg-charcoal-deep z-[80] overflow-hidden">
      <SEO title={`${t.ar_mode.title} — ${product.name.en}`} />

      {/* camera / fallback backdrop */}
      <video ref={videoRef} playsInline muted className={`absolute inset-0 w-full h-full object-cover ${camState === 'on' ? '' : 'hidden'}`} />
      {camState !== 'on' && (
        <div className="absolute inset-0 bg-[radial-gradient(90%_75%_at_50%_25%,#4a5053_0%,#2F3336_55%,#1d1f21_100%)]">
          {/* faux floor line for scale reference */}
          <div className="absolute inset-x-0 bottom-[22%] h-px bg-white/10" />
          <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-black/35 to-transparent" />
        </div>
      )}

      {/* 3D model layer */}
      <div
        className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
        onWheel={onWheel} onTouchStart={onTouchStart} onTouchMove={onTouchMove}
        style={{ transform: `translate(${pos.x}%, ${pos.y}%) scale(${scale})`, transition: drag.current ? 'none' : 'transform 0.15s ease-out' }}
      >
        <Canvas shadows dpr={[1, 1.75]} camera={{ position: [2.6, 1.4, 3.2], fov: 30 }} style={{ pointerEvents: 'none' }}>
          <ambientLight intensity={0.65} />
          <directionalLight position={[4, 6, 4]} intensity={1.5} castShadow />
          <directionalLight position={[-4, 3, -3]} intensity={0.5} />
          <group rotation={[0, rot, 0]}>
            <FurnitureModel product={product} config={defaultConfig(product)} />
            {/* soft ground shadow disc */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
              <circleGeometry args={[1.8, 48]} />
              <shadowMaterial opacity={0.35} />
            </mesh>
          </group>
        </Canvas>
      </div>

      {/* top bar */}
      <div className="absolute top-0 inset-x-0 p-5 flex items-center justify-between z-10">
        <button onClick={() => navigate(`/product/${id}`)}
          className="glass-dark text-white rounded-full px-5 py-3 text-sm flex items-center gap-2 cursor-pointer hover:text-olive-light transition-colors duration-200">
          <Icon.X size={15} /> {t.ar_mode.back}
        </button>
        <span className="glass-dark text-white/80 rounded-full px-5 py-3 text-sm flex items-center gap-2">
          <Icon.AR size={15} className="text-olive-light" /> {product.name.en}
        </span>
      </div>

      {/* intro overlay */}
      {camState === 'idle' && (
        <div className="absolute inset-0 z-20 bg-charcoal-deep/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="glass rounded-luxe shadow-luxe max-w-sm w-full p-8 text-center">
            <Icon.Camera size={34} className="mx-auto text-olive mb-5" />
            <h1 className="font-display text-2xl">{t.ar_mode.title}</h1>
            <p className="text-sm text-charcoal/60 mt-3 leading-relaxed">{t.ar_mode.intro}</p>
            <button onClick={startCamera} className="btn-primary w-full mt-7">{t.ar_mode.start}</button>
            <button onClick={() => setCamState('denied')} className="text-sm text-stone hover:text-olive mt-4 cursor-pointer transition-colors duration-200">
              {t.ar_mode.noCamera}
            </button>
          </div>
        </div>
      )}

      {/* bottom controls */}
      <div className="absolute bottom-0 inset-x-0 p-5 z-10">
        <p className="text-center text-white/50 text-xs tracking-[0.18em] uppercase mb-4">{t.ar_mode.hint}</p>
        <div className="glass-dark rounded-luxe p-5 max-w-md mx-auto grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="ar-scale" className="text-[11px] uppercase tracking-[0.2em] text-white/50 flex items-center gap-2 mb-2.5">
              <Icon.AR size={13} /> {t.ar_mode.scale}
            </label>
            <input id="ar-scale" type="range" min="0.4" max="2.2" step="0.01" value={scale}
              onChange={(e) => setScale(+e.target.value)} className="w-full accent-[#556B2F] cursor-pointer" />
          </div>
          <div>
            <label htmlFor="ar-rot" className="text-[11px] uppercase tracking-[0.2em] text-white/50 flex items-center gap-2 mb-2.5">
              <Icon.Rotate size={13} /> {t.ar_mode.rotate}
            </label>
            <input id="ar-rot" type="range" min="0" max="6.28" step="0.01" value={rot}
              onChange={(e) => setRot(+e.target.value)} className="w-full accent-[#556B2F] cursor-pointer" />
          </div>
        </div>
      </div>
    </Page>
  )
}
