import { useRef, useState } from 'react'

// Hover-to-magnify, the way the KA shop's product page behaves: the pointer
// acts as a lens over the picture and the view under it is enlarged.
//
// The shop (ElevateZoom) paints the magnified view into a panel beside the
// image. Here the magnification happens inside the frame instead — the product
// pages put copy right next to the gallery, so a side panel would cover it.
export default function ZoomImage({ src, zoomSrc, alt, scale = 2.4, className = '', imgClassName = '' }) {
  const box = useRef(null)
  const [lens, setLens] = useState(null) // {x,y} in percent, null when idle

  // Coarse pointers have no hover, so leave those alone.
  const canZoom = typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches

  function track(e) {
    if (!canZoom || !box.current) return
    const r = box.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    setLens({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) })
  }

  return (
    <div
      ref={box}
      onMouseMove={track}
      onMouseLeave={() => setLens(null)}
      className={`relative overflow-hidden ${canZoom ? 'cursor-zoom-in' : ''} ${className}`}
    >
      <img src={src} alt={alt} className={imgClassName} draggable={false} />
      {lens && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("${zoomSrc || src}")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${scale * 100}%`,
            backgroundPosition: `${lens.x}% ${lens.y}%`,
          }}
        />
      )}
    </div>
  )
}
