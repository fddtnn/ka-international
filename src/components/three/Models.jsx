import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import { FABRICS, LEATHERS, WOODS, MARBLES, METALS } from '../../data/products.js'

const find = (arr, id) => arr.find((o) => o.id === id)

export function resolveMaterials(product, config = {}) {
  const fabric = find(FABRICS, config.fabric)
  const leather = find(LEATHERS, config.leather)
  const wood = find(WOODS, config.wood) || WOODS[0]
  const marble = find(MARBLES, config.marble) || MARBLES[0]
  const metal = find(METALS, config.metal) || METALS[0]
  const hasFabric = !!product?.options?.fabric
  return {
    upholstery: hasFabric ? (fabric?.hex ?? '#EDE8DF') : (leather?.hex ?? '#8B5A33'),
    upholsteryRough: hasFabric ? 0.95 : 0.45,
    accent: leather?.hex ?? '#8B5A33',
    wood: wood.hex,
    marble: marble.hex,
    metal: metal.hex,
    legs: config.legs || 'tapered',
    scale: 1,
  }
}

/* ---------- shared materials ---------- */
const Fab = ({ color, rough = 0.95 }) => (
  <meshStandardMaterial color={color} roughness={rough} metalness={0.02} />
)
const WoodMat = ({ color }) => <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
const MetalMat = ({ color }) => <meshStandardMaterial color={color} roughness={0.28} metalness={0.9} />
const MarbleMat = ({ color }) => <meshStandardMaterial color={color} roughness={0.18} metalness={0.08} />

/* ---------- legs ---------- */
function Legs({ style, positions, height = 0.18, wood, metal }) {
  if (style === 'plinth') {
    const xs = positions.map((p) => p[0])
    const zs = positions.map((p) => p[2])
    const w = Math.max(...xs) - Math.min(...xs) + 0.25
    const d = Math.max(...zs) - Math.min(...zs) + 0.25
    return (
      <RoundedBox args={[w, height, d]} radius={0.02} position={[0, height / 2, 0]} castShadow>
        <WoodMat color={wood} />
      </RoundedBox>
    )
  }
  return positions.map((p, i) =>
    style === 'metal' ? (
      <mesh key={i} position={[p[0], height / 2, p[2]]} castShadow>
        <boxGeometry args={[0.035, height, 0.06]} />
        <MetalMat color={metal} />
      </mesh>
    ) : (
      <mesh key={i} position={[p[0], height / 2, p[2]]} castShadow>
        <cylinderGeometry args={[0.022, 0.04, height, 16]} />
        <WoodMat color={wood} />
      </mesh>
    ),
  )
}

/* Slim splayed cone leg — the sharply tapered dark foot the Meridian stands on. */
function ConeLeg({ x, z, height, wood }) {
  const splay = 0.07
  return (
    <mesh
      position={[x, height / 2, z]}
      rotation={[z > 0 ? -splay : splay, 0, x > 0 ? -splay : splay]}
      castShadow
    >
      <cylinderGeometry args={[0.032, 0.007, height, 20]} />
      <WoodMat color={wood} />
    </mesh>
  )
}

/* ---------- SOFA ---------- */
export function Sofa({ m, sizeScale = 1, layout = 'standard' }) {
  const W = 2.0 * sizeScale
  const D = 0.9
  const legH = 0.26 // tall and thin, so the frame reads as if it floats
  const armW = 0.12 // slim track arm
  const frameY = legH + 0.1
  const seatY = legH + 0.28
  const seats = sizeScale > 1.2 ? 4 : sizeScale > 1.05 ? 3 : 2
  const inner = W - armW * 2 - 0.03
  const seatW = inner / seats
  const chaise = layout === 'chaise' || layout === 'corner'
  const legX = W / 2 - 0.1
  const legZ = D / 2 - 0.12
  const fab = { color: m.upholstery, rough: m.upholsteryRough }

  return (
    <group>
      {m.legs === 'tapered' ? (
        [[-legX, -legZ], [legX, -legZ], [-legX, legZ], [legX, legZ]].map(([x, z], i) => (
          <ConeLeg key={i} x={x} z={z} height={legH} wood={m.wood} />
        ))
      ) : (
        <Legs
          style={m.legs}
          positions={[[-legX, 0, -legZ], [legX, 0, -legZ], [-legX, 0, legZ], [legX, 0, legZ]]}
          height={legH} wood={m.wood} metal={m.metal}
        />
      )}

      {/* frame — a shallow apron, the seat cushions sit proud of it */}
      <RoundedBox args={[W, 0.16, D]} radius={0.03} position={[0, frameY, 0]} castShadow receiveShadow>
        <Fab {...fab} />
      </RoundedBox>

      {/* seat cushions */}
      {Array.from({ length: seats }).map((_, i) => (
        <RoundedBox
          key={i}
          args={[seatW - 0.025, 0.19, D - 0.14]}
          radius={0.06}
          position={[-inner / 2 + seatW / 2 + i * seatW, seatY, 0.04]}
          castShadow
        >
          <Fab {...fab} />
        </RoundedBox>
      ))}

      {/* low back panel */}
      <RoundedBox args={[W, 0.44, 0.13]} radius={0.045} position={[0, legH + 0.42, -D / 2 + 0.065]} rotation={[-0.05, 0, 0]} castShadow>
        <Fab {...fab} />
      </RoundedBox>

      {/* loose back cushions, plump and slightly proud of the frame */}
      {Array.from({ length: seats }).map((_, i) => (
        <RoundedBox
          key={i}
          args={[seatW - 0.045, 0.38, 0.2]}
          radius={0.08}
          position={[-inner / 2 + seatW / 2 + i * seatW, seatY + 0.28, -D / 2 + 0.21]}
          rotation={[-0.1, 0, 0]}
          castShadow
        >
          <Fab {...fab} />
        </RoundedBox>
      ))}

      {/* slim arms, sitting just below the loose back cushions */}
      {[-1, 1].map((s) => (
        <RoundedBox
          key={s}
          args={[armW, 0.37, D]}
          radius={0.04}
          position={[s * (W / 2 - armW / 2), legH + 0.36, 0]}
          castShadow
        >
          <Fab {...fab} />
        </RoundedBox>
      ))}

      {/* bolster cushions lying on the seat against each arm */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * (W / 2 - armW - 0.085), seatY + 0.16, 0.06]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <capsuleGeometry args={[0.076, 0.28, 6, 18]} />
          <Fab {...fab} />
        </mesh>
      ))}

      {/* chaise extension */}
      {chaise && (
        <group position={[W / 2 - 0.45, 0, layout === 'corner' ? 0.95 : 0.85]}>
          <RoundedBox args={[0.86, 0.2, 0.8]} radius={0.035} position={[0, frameY, 0]} castShadow>
            <Fab {...fab} />
          </RoundedBox>
          <RoundedBox args={[0.8, 0.16, 0.72]} radius={0.055} position={[0, seatY, 0]} castShadow>
            <Fab {...fab} />
          </RoundedBox>
          {m.legs === 'tapered' ? (
            [[-0.32, -0.28], [0.32, -0.28], [-0.32, 0.28], [0.32, 0.28]].map(([x, z], i) => (
              <ConeLeg key={i} x={x} z={z} height={legH} wood={m.wood} />
            ))
          ) : (
            <Legs style={m.legs} positions={[[-0.32, 0, -0.28], [0.32, 0, -0.28], [-0.32, 0, 0.28], [0.32, 0, 0.28]]} height={legH} wood={m.wood} metal={m.metal} />
          )}
        </group>
      )}
    </group>
  )
}

/* ---------- ARMCHAIR ---------- */
export function Armchair({ m }) {
  return (
    <group>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.34, 0.12, 32]} />
        <WoodMat color={m.wood} />
      </mesh>
      <RoundedBox args={[0.78, 0.2, 0.74]} radius={0.08} position={[0, 0.28, 0.02]} castShadow>
        <Fab color={m.upholstery} rough={m.upholsteryRough} />
      </RoundedBox>
      {/* wrap-around curved back: three angled segments */}
      <RoundedBox args={[0.72, 0.5, 0.14]} radius={0.07} position={[0, 0.62, -0.3]} rotation={[-0.12, 0, 0]} castShadow>
        <Fab color={m.upholstery} rough={m.upholsteryRough} />
      </RoundedBox>
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[0.16, 0.44, 0.56]} radius={0.07} position={[s * 0.35, 0.5, -0.04]} rotation={[0, s * -0.25, 0]} castShadow>
          <Fab color={m.upholstery} rough={m.upholsteryRough} />
        </RoundedBox>
      ))}
      {/* seat pillow accent */}
      <RoundedBox args={[0.5, 0.1, 0.44]} radius={0.05} position={[0, 0.42, 0.05]} castShadow>
        <Fab color={m.accent} rough={0.55} />
      </RoundedBox>
    </group>
  )
}

/* ---------- COFFEE TABLE ---------- */
export function CoffeeTable({ m }) {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.36, 0.05, 40]} />
        <MetalMat color={m.metal} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.2, 0.3, 32]} />
        <MetalMat color={m.metal} />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.045, 48]} />
        <MarbleMat color={m.marble} />
      </mesh>
      {/* decor: small sphere vase */}
      <mesh position={[0.18, 0.44, 0.1]} castShadow>
        <sphereGeometry args={[0.055, 24, 24]} />
        <MetalMat color={m.metal} />
      </mesh>
    </group>
  )
}

/* ---------- BED ---------- */
export function Bed({ m, sizeScale = 1 }) {
  const W = 1.7 * sizeScale
  return (
    <group>
      <RoundedBox args={[W, 0.16, 2.05]} radius={0.04} position={[0, 0.18, 0.1]} castShadow>
        <WoodMat color={m.wood} />
      </RoundedBox>
      <RoundedBox args={[W - 0.1, 0.22, 1.95]} radius={0.08} position={[0, 0.38, 0.1]} castShadow>
        <Fab color="#F2EFE9" rough={0.9} />
      </RoundedBox>
      {/* duvet */}
      <RoundedBox args={[W - 0.06, 0.1, 1.25]} radius={0.05} position={[0, 0.52, 0.42]} castShadow>
        <Fab color={m.upholstery} rough={m.upholsteryRough} />
      </RoundedBox>
      {/* headboard — wide curved */}
      <RoundedBox args={[W + 0.5, 0.85, 0.12]} radius={0.06} position={[0, 0.7, -0.92]} castShadow>
        <Fab color={m.upholstery} rough={m.upholsteryRough} />
      </RoundedBox>
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[0.3, 0.7, 0.12]} radius={0.06} position={[s * (W / 2 + 0.35), 0.62, -0.86]} rotation={[0, s * 0.35, 0]} castShadow>
          <Fab color={m.upholstery} rough={m.upholsteryRough} />
        </RoundedBox>
      ))}
      {/* pillows */}
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[0.6 * sizeScale, 0.16, 0.4]} radius={0.07} position={[s * W * 0.22, 0.56, -0.6]} rotation={[-0.3, 0, s * 0.03]} castShadow>
          <Fab color="#FAF8F4" rough={0.9} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.5, 0.14, 0.3]} radius={0.06} position={[0, 0.56, -0.45]} rotation={[-0.25, 0, 0]} castShadow>
        <Fab color={m.accent} rough={0.6} />
      </RoundedBox>
    </group>
  )
}

/* ---------- DINING TABLE ---------- */
export function Table({ m, sizeScale = 1 }) {
  const L = 1.9 * sizeScale
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (L / 2 - 0.35), 0, 0]}>
          <RoundedBox args={[0.16, 0.7, 0.7]} radius={0.05} position={[0, 0.35, 0]} castShadow>
            <MarbleMat color={m.marble} />
          </RoundedBox>
        </group>
      ))}
      <RoundedBox args={[L, 0.06, 1.0]} radius={0.02} position={[0, 0.73, 0]} castShadow>
        <MarbleMat color={m.marble} />
      </RoundedBox>
      {/* runner + bowl decor */}
      <mesh position={[0, 0.79, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 0.06, 32]} />
        <MetalMat color={m.metal} />
      </mesh>
    </group>
  )
}

/* ---------- DESK ---------- */
export function Desk({ m }) {
  return (
    <group>
      <RoundedBox args={[1.7, 0.05, 0.8]} radius={0.02} position={[0, 0.72, 0]} castShadow>
        <WoodMat color={m.wood} />
      </RoundedBox>
      {/* leather inlay */}
      <mesh position={[0, 0.752, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.1, 0.55]} />
        <meshStandardMaterial color={m.accent} roughness={0.5} />
      </mesh>
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[0.06, 0.7, 0.74]} radius={0.02} position={[s * 0.8, 0.36, 0]} castShadow>
          <WoodMat color={m.wood} />
        </RoundedBox>
      ))}
      {/* drawer unit */}
      <RoundedBox args={[0.5, 0.5, 0.7]} radius={0.02} position={[0.5, 0.46, 0]} castShadow>
        <WoodMat color={m.wood} />
      </RoundedBox>
      {[0.58, 0.36].map((y, i) => (
        <mesh key={i} position={[0.5, y, 0.36]}>
          <boxGeometry args={[0.34, 0.015, 0.015]} />
          <MetalMat color={m.metal} />
        </mesh>
      ))}
      <RoundedBox args={[1.6, 0.05, 0.1]} radius={0.02} position={[0, 0.2, -0.3]} castShadow>
        <MetalMat color={m.metal} />
      </RoundedBox>
    </group>
  )
}

/* ---------- OUTDOOR LOUNGE CHAIR ---------- */
export function LoungeChair({ m }) {
  return (
    <group>
      {/* teak frame */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.36, 0.3, 0.3]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
            <WoodMat color={m.wood} />
          </mesh>
          <mesh position={[s * 0.36, 0.35, -0.3]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.7, 12]} />
            <WoodMat color={m.wood} />
          </mesh>
          <mesh position={[s * 0.36, 0.45, 0]} rotation={[Math.PI / 2.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.68, 12]} />
            <WoodMat color={m.wood} />
          </mesh>
        </group>
      ))}
      {/* rope back: horizontal strands */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, 0.42 + i * 0.055, -0.3 + i * 0.012]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.72, 10]} />
          <Fab color="#D8D2C4" rough={1} />
        </mesh>
      ))}
      <RoundedBox args={[0.72, 0.12, 0.62]} radius={0.05} position={[0, 0.36, 0.06]} castShadow>
        <Fab color={m.upholstery} rough={m.upholsteryRough} />
      </RoundedBox>
      <RoundedBox args={[0.72, 0.3, 0.1]} radius={0.05} position={[0, 0.56, -0.24]} rotation={[-0.22, 0, 0]} castShadow>
        <Fab color={m.upholstery} rough={m.upholsteryRough} />
      </RoundedBox>
    </group>
  )
}

/* ---------- SIDEBOARD / NIGHTSTAND ---------- */
export function Sideboard({ m, wide = true }) {
  const W = wide ? 1.8 : 0.6
  const H = wide ? 0.7 : 0.5
  const flutes = wide ? 26 : 10
  return (
    <group>
      <Legs style="tapered" positions={[[-W / 2 + 0.1, 0, -0.16], [W / 2 - 0.1, 0, -0.16], [-W / 2 + 0.1, 0, 0.16], [W / 2 - 0.1, 0, 0.16]]} height={0.14} wood={m.wood} metal={m.metal} />
      <RoundedBox args={[W, H, 0.44]} radius={0.02} position={[0, 0.14 + H / 2, 0]} castShadow>
        <WoodMat color={m.wood} />
      </RoundedBox>
      {/* fluted front */}
      {Array.from({ length: flutes }).map((_, i) => (
        <mesh key={i} position={[-W / 2 + (i + 0.5) * (W / flutes), 0.14 + H / 2, 0.225]} castShadow>
          <cylinderGeometry args={[W / flutes / 2.4, W / flutes / 2.4, H - 0.04, 10]} />
          <WoodMat color={m.wood} />
        </mesh>
      ))}
      <RoundedBox args={[W + 0.06, 0.03, 0.5]} radius={0.01} position={[0, 0.14 + H + 0.015, 0]} castShadow>
        <MarbleMat color={m.marble} />
      </RoundedBox>
      {/* brass pulls */}
      {(wide ? [-0.45, 0.45] : [0]).map((x, i) => (
        <mesh key={i} position={[x, 0.14 + H / 2, 0.26]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <MetalMat color={m.metal} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- FLOOR LAMP ---------- */
export function Lamp({ m }) {
  return (
    <group>
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.03, 40]} />
        <MarbleMat color={m.marble} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 1.44, 12]} />
        <MetalMat color={m.metal} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#FFF6E8" emissive="#FFE1B0" emissiveIntensity={1.4} roughness={0.4} />
      </mesh>
    </group>
  )
}

/* ---------- RUG ---------- */
export function Rug({ m }) {
  return (
    <group>
      <RoundedBox args={[1.8, 0.025, 1.2]} radius={0.01} position={[0, 0.0125, 0]} receiveShadow castShadow>
        <Fab color={m.upholstery} rough={1} />
      </RoundedBox>
      <RoundedBox args={[1.5, 0.028, 0.9]} radius={0.01} position={[0, 0.014, 0]} receiveShadow>
        <Fab color={m.accent} rough={1} />
      </RoundedBox>
    </group>
  )
}

/* ---------- factory ---------- */
export function FurnitureModel({ product, config }) {
  const m = useMemo(() => resolveMaterials(product, config), [product, config])
  const sizeOpt = product?.options?.size?.find((s) => s.id === config?.size)
  const sizeScale = sizeOpt?.scale ?? 1
  const layout = config?.layout || 'standard'
  switch (product?.modelType) {
    case 'sofa': return <Sofa m={m} sizeScale={sizeScale} layout={layout} />
    case 'armchair': return <Armchair m={m} />
    case 'coffeeTable': return <CoffeeTable m={m} />
    case 'bed': return <Bed m={m} sizeScale={sizeScale} />
    case 'table': return <Table m={m} sizeScale={sizeScale} />
    case 'desk': return <Desk m={m} />
    case 'loungeChair': return <LoungeChair m={m} />
    case 'sideboard': return <Sideboard m={m} wide={product.id !== 'mirage-nightstand'} />
    case 'lamp': return <Lamp m={m} />
    case 'rug': return <Rug m={m} />
    default: return <Sofa m={m} />
  }
}
