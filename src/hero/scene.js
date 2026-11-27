import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator'
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent'
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData'
import { VertexBuffer } from '@babylonjs/core/Buffers/buffer'
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture'
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial'
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem'
import '@babylonjs/core/Particles/particleSystemComponent'

function randomGenerator(seed) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function createStoneTexture(scene, base, seed) {
  const size = 256
  const texture = new DynamicTexture('hand-carved-stone', { width: size, height: size }, scene, true)
  const ctx = texture.getContext()
  const image = ctx.createImageData(size, size)
  const random = randomGenerator(seed)
  const color = Color3.FromHexString(base)
  const baseR = color.r * 255
  const baseG = color.g * 255
  const baseB = color.b * 255

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4
      const broad = Math.sin(x * 0.055 + Math.sin(y * 0.035) * 2.2) * 4
      const grain = (random() - 0.5) * 15
      const pore = random() > 0.986 ? -25 : 0
      image.data[index] = baseR + broad + grain + pore
      image.data[index + 1] = baseG + broad + grain + pore
      image.data[index + 2] = baseB + broad + grain + pore
      image.data[index + 3] = 255
    }
  }

  ctx.putImageData(image, 0, 0)
  ctx.globalAlpha = 0.12
  ctx.strokeStyle = '#fff4df'
  ctx.lineWidth = 0.65
  for (let i = 0; i < 24; i++) {
    const y = random() * size
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(size * 0.3, y + random() * 9, size * 0.7, y - random() * 8, size, y + 3)
    ctx.stroke()
  }
  texture.update()
  texture.wrapU = 1
  texture.wrapV = 1
  texture.uScale = 1.6
  texture.vScale = 1.6
  return texture
}

function createStoneMaterial(scene, name, color, seed, roughness = 0.84) {
  const material = new PBRMaterial(name, scene)
  const texture = createStoneTexture(scene, color, seed)
  material.albedoColor = Color3.White()
  material.albedoTexture = texture
  material.bumpTexture = texture
  material.bumpTexture.level = 0.32
  material.roughness = roughness
  material.metallic = 0
  material.ambientColor = Color3.FromHexString(color).scale(0.3)
  material.emissiveColor = Color3.FromHexString(color).scale(0.025)
  return material
}

function createLeafMaterial(scene, name, color) {
  const material = new PBRMaterial(name, scene)
  material.albedoColor = Color3.FromHexString(color)
  material.roughness = 0.64
  material.metallic = 0
  material.ambientColor = Color3.FromHexString(color).scale(0.4)
  material.emissiveColor = Color3.FromHexString(color).scale(0.045)
  material.backFaceCulling = false
  return material
}

function softenGeometry(mesh, amount, phase) {
  const positions = mesh.getVerticesData(VertexBuffer.PositionKind)
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]
    const z = positions[i + 2]
    const displacement =
      1 +
      Math.sin(x * 2.7 + y * 1.9 + phase) * amount +
      Math.cos(z * 3.4 - x * 1.3 + phase) * amount * 0.55
    positions[i] = x * displacement
    positions[i + 1] = y * displacement
    positions[i + 2] = z * displacement
  }
  const normals = new Float32Array(positions.length)
  VertexData.ComputeNormals(positions, mesh.getIndices(), normals)
  mesh.updateVerticesData(VertexBuffer.PositionKind, positions)
  mesh.updateVerticesData(VertexBuffer.NormalKind, normals)
  return mesh
}

function createPebble(scene, material, name, scale, position, rotation, phase) {
  const pebble = MeshBuilder.CreateSphere(name, { diameter: 2, segments: 28 }, scene)
  softenGeometry(pebble, 0.065, phase)
  pebble.material = material
  pebble.scaling.copyFromFloats(...scale)
  pebble.position.copyFromFloats(...position)
  pebble.rotation.copyFromFloats(...rotation)
  pebble.isPickable = false
  pebble.receiveShadows = true
  return pebble
}

function createLeaf(scene, material, veinMaterial, { length = 1, width = 0.28, bend = 0.16 } = {}) {
  const group = new TransformNode('curved-leaf', scene)
  const rows = 14
  const columns = 6
  const positions = []
  const uvs = []
  const indices = []

  for (let row = 0; row <= rows; row++) {
    const t = row / rows
    const taper = Math.pow(Math.sin(Math.PI * t), 0.78) * (1 - t * 0.12)
    for (let column = 0; column <= columns; column++) {
      const side = (column / columns) * 2 - 1
      positions.push(
        side * width * taper,
        t * length,
        bend * Math.sin(Math.PI * t) + Math.abs(side) * 0.055 * taper,
      )
      uvs.push(column / columns, t)
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const a = row * (columns + 1) + column
      const b = a + columns + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const normals = []
  VertexData.ComputeNormals(positions, indices, normals)
  const vertexData = new VertexData()
  vertexData.positions = positions
  vertexData.indices = indices
  vertexData.normals = normals
  vertexData.uvs = uvs
  const leaf = new Mesh('botanical-leaf', scene)
  vertexData.applyToMesh(leaf)
  leaf.material = material
  leaf.parent = group
  leaf.isPickable = false

  const veinPath = []
  for (let i = 0; i <= 12; i++) {
    const t = i / 12
    veinPath.push(new Vector3(0, t * length, bend * Math.sin(Math.PI * t) + 0.009))
  }
  const vein = MeshBuilder.CreateTube('leaf-midrib', {
    path: veinPath,
    radius: 0.007,
    tessellation: 5,
  }, scene)
  vein.material = veinMaterial
  vein.parent = group
  vein.isPickable = false
  return group
}

function createSprig(scene, leafMaterial, veinMaterial, stemMaterial, leafCount = 6) {
  const group = new TransformNode('botanical-sprig', scene)
  const stemPath = []
  for (let i = 0; i <= 18; i++) {
    const t = i / 18
    stemPath.push(new Vector3(Math.sin(t * Math.PI) * 0.1, t * 1.8, Math.sin(t * 3.4) * 0.1))
  }
  const stem = MeshBuilder.CreateTube('sprig-stem', {
    path: stemPath,
    radius: 0.018,
    tessellation: 7,
  }, scene)
  stem.material = stemMaterial
  stem.parent = group
  stem.isPickable = false

  for (let i = 0; i < leafCount; i++) {
    const t = 0.16 + (i / leafCount) * 0.72
    const side = i % 2 === 0 ? -1 : 1
    const leaf = createLeaf(scene, leafMaterial, veinMaterial, {
      length: 0.72 + (1 - t) * 0.34,
      width: 0.2 + (1 - t) * 0.07,
      bend: 0.12 + t * 0.09,
    })
    leaf.position.set(Math.sin(t * Math.PI) * 0.1, t * 1.8, Math.sin(t * 3.4) * 0.1)
    leaf.rotation.set(side * 0.12, side * 0.28, side * (0.82 + t * 0.28))
    leaf.parent = group
  }
  return group
}

function createGlowTexture(scene) {
  const texture = new DynamicTexture('dust-texture', { width: 32, height: 32 }, scene, false)
  const ctx = texture.getContext()
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  gradient.addColorStop(0, 'rgba(255,239,205,0.9)')
  gradient.addColorStop(0.3, 'rgba(238,207,159,0.42)')
  gradient.addColorStop(1, 'rgba(220,185,133,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 32, 32)
  texture.update()
  texture.hasAlpha = true
  return texture
}

export function createHeroScene(canvas, { progressRef, onReady } = {}) {
  if (!Engine.isSupported()) return null

  const isSmall = window.innerWidth < 900
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, isSmall ? 1.35 : 1.65)
  const baseRadius = isSmall ? 9.8 : 8.4
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: false,
    stencil: false,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  engine.setHardwareScalingLevel(1 / dpr)

  const scene = new Scene(engine)
  scene.clearColor = new Color4(0, 0, 0, 0)
  scene.skipPointerMovePicking = true
  scene.ambientColor = new Color3(0.28, 0.3, 0.25)

  const camera = new ArcRotateCamera(
    'garden-camera',
    -Math.PI / 2,
    Math.PI / 2.12,
    baseRadius,
    new Vector3(0, 0, 0),
    scene,
  )
  camera.fov = isSmall ? 0.88 : 0.84
  camera.minZ = 0.1
  camera.maxZ = 50

  const ambient = new HemisphericLight('soft-sky', new Vector3(0.1, 1, -0.4), scene)
  ambient.intensity = 0.72
  ambient.diffuse = Color3.FromHexString('#f3e4ca')
  ambient.groundColor = Color3.FromHexString('#26382c')

  const key = new DirectionalLight('late-afternoon-light', new Vector3(0.55, -1, 0.65), scene)
  key.position = new Vector3(-5, 7, -5)
  key.intensity = 3.4
  key.diffuse = Color3.FromHexString('#ffd9a6')
  key.specular = Color3.FromHexString('#ffe4bd')
  key.shadowMinZ = 0.5
  key.shadowMaxZ = 24

  const fill = new DirectionalLight('forest-fill', new Vector3(-0.8, -0.25, 0.5), scene)
  fill.position = new Vector3(5, 2, -3)
  fill.intensity = 1.15
  fill.diffuse = Color3.FromHexString('#a9bea4')
  fill.specular = Color3.FromHexString('#c5d0b9')

  const limestone = createStoneMaterial(scene, 'warm-limestone', '#a79c84', 19)
  const paleStone = createStoneMaterial(scene, 'pale-river-stone', '#c1b49a', 37)
  const darkStone = createStoneMaterial(scene, 'dark-river-stone', '#596459', 53)
  const clay = createStoneMaterial(scene, 'hand-worked-clay', '#92654c', 71, 0.9)
  const leafMaterial = createLeafMaterial(scene, 'banana-leaf', '#425f45')
  const leafLightMaterial = createLeafMaterial(scene, 'young-leaf', '#65795a')
  const veinMaterial = createLeafMaterial(scene, 'leaf-veins', '#8a946b')
  const stemMaterial = createLeafMaterial(scene, 'botanical-stems', '#4b5138')

  const world = new TransformNode('quiet-stone-garden', scene)
  const shadows = new ShadowGenerator(isSmall ? 512 : 1024, key)
  shadows.useBlurExponentialShadowMap = true
  shadows.blurKernel = isSmall ? 24 : 38
  shadows.darkness = 0.42
  shadows.bias = 0.0008

  const ring = MeshBuilder.CreateTorus('carved-open-form', {
    diameter: 2.65,
    thickness: 0.48,
    tessellation: isSmall ? 72 : 112,
  }, scene)
  softenGeometry(ring, 0.025, 1.4)
  ring.material = limestone
  ring.parent = world
  ring.position.set(isSmall ? 1.55 : 3.65, isSmall ? 1.5 : 0.35, 0.45)
  ring.rotation.set(Math.PI / 2 + 0.12, -0.2, 0.22)
  ring.scaling.setAll(isSmall ? 0.76 : 1.12)
  ring.receiveShadows = true
  ring.isPickable = false
  shadows.addShadowCaster(ring)

  const stones = new TransformNode('stacked-river-stones', scene)
  stones.parent = world
  stones.position.set(isSmall ? -0.3 : 0.8, isSmall ? -2.75 : -1.95, 0.25)
  stones.scaling.setAll(isSmall ? 0.58 : 0.9)
  const stoneBottom = createPebble(scene, darkStone, 'river-stone-bottom', [1.25, 0.34, 0.72], [0, 0, 0], [0.06, 0.12, -0.04], 0.4)
  const stoneMiddle = createPebble(scene, paleStone, 'river-stone-middle', [0.93, 0.31, 0.64], [0.08, 0.55, 0], [-0.04, -0.15, 0.09], 1.9)
  const stoneTop = createPebble(scene, clay, 'river-stone-top', [0.59, 0.42, 0.5], [-0.02, 1.1, 0.02], [0.1, 0.2, -0.12], 3.2)
  ;[stoneBottom, stoneMiddle, stoneTop].forEach((stone) => {
    stone.parent = stones
    shadows.addShadowCaster(stone)
  })

  const tallPebble = createPebble(scene, limestone, 'standing-seed-form', [0.55, 1.28, 0.48], [isSmall ? -1.35 : 1.05, isSmall ? 2.4 : 1.55, 1.1], [0.08, 0.15, -0.22], 4.1)
  tallPebble.parent = world
  tallPebble.scaling.scaleInPlace(isSmall ? 0.52 : 0.72)
  shadows.addShadowCaster(tallPebble)

  const clayDish = createPebble(scene, clay, 'resting-clay-form', [1.15, 0.24, 0.72], [isSmall ? 1.15 : 3.15, isSmall ? -2.8 : -2.15, 0.35], [0, -0.18, 0.08], 2.6)
  clayDish.parent = world
  clayDish.scaling.scaleInPlace(isSmall ? 0.62 : 0.85)
  shadows.addShadowCaster(clayDish)

  const ground = MeshBuilder.CreateGround('soft-contact-shadows', { width: 24, height: 18 }, scene)
  const groundMaterial = new PBRMaterial('transparent-shadows', scene)
  groundMaterial.albedoColor = Color3.FromHexString('#111a14')
  groundMaterial.roughness = 1
  groundMaterial.metallic = 0
  groundMaterial.alpha = 0.09
  ground.material = groundMaterial
  ground.position.y = -2.48
  ground.receiveShadows = true
  ground.isPickable = false

  const leftSprig = createSprig(scene, leafMaterial, veinMaterial, stemMaterial, isSmall ? 5 : 7)
  leftSprig.parent = world
  leftSprig.position.set(isSmall ? -1.65 : -5.8, isSmall ? -2.8 : -2.5, -0.15)
  leftSprig.rotation.set(0.12, -0.25, -0.38)
  leftSprig.scaling.setAll(isSmall ? 0.65 : 1.05)

  const rightSprig = createSprig(scene, leafLightMaterial, veinMaterial, stemMaterial, isSmall ? 4 : 6)
  rightSprig.parent = world
  rightSprig.position.set(isSmall ? 1.35 : 4.95, isSmall ? -2.8 : -1.75, 0.8)
  rightSprig.rotation.set(-0.18, 0.35, 0.42)
  rightSprig.scaling.setAll(isSmall ? 0.7 : 1.05)

  const floatingLeaves = []
  const leafPlacements = isSmall
    ? [[-1.25, 0.3, 0.7, 0.48], [1.2, -0.25, 1.2, 0.4], [0.7, 2.75, 0.1, 0.35]]
    : [[-4.6, 2.15, 0.3, 0.72], [4.85, 2.35, -0.4, 0.66], [-2.9, -2.25, 1.1, 0.52], [2.1, 2.75, 0.8, 0.46], [5.1, -0.9, 1.4, 0.54]]
  leafPlacements.forEach(([x, y, z, scale], index) => {
    const leaf = createLeaf(scene, index % 2 ? leafLightMaterial : leafMaterial, veinMaterial, {
      length: 1.1,
      width: 0.3,
      bend: 0.2,
    })
    leaf.parent = world
    leaf.position.set(x, y, z)
    leaf.rotation.set(0.25 + index * 0.17, index * 0.62, -0.8 + index * 0.7)
    leaf.scaling.setAll(scale)
    floatingLeaves.push({ leaf, y, zRotation: leaf.rotation.z, phase: index * 1.7 })
  })

  const particles = new ParticleSystem('warm-air-motes', isSmall ? 45 : 110, scene)
  particles.particleTexture = createGlowTexture(scene)
  particles.emitter = new Vector3(0, 0, 0)
  particles.minEmitBox = new Vector3(-5.5, -2.6, -1.8)
  particles.maxEmitBox = new Vector3(5.5, 3.1, 1.8)
  particles.color1 = new Color4(0.9, 0.78, 0.56, 0.34)
  particles.color2 = new Color4(0.74, 0.82, 0.65, 0.2)
  particles.colorDead = new Color4(0.7, 0.62, 0.45, 0)
  particles.minSize = 0.015
  particles.maxSize = 0.045
  particles.minLifeTime = 7
  particles.maxLifeTime = 14
  particles.emitRate = reduceMotion ? 0 : (isSmall ? 5 : 10)
  particles.blendMode = ParticleSystem.BLENDMODE_STANDARD
  particles.gravity = new Vector3(0, 0.012, 0)
  particles.direction1 = new Vector3(-0.035, 0.025, -0.02)
  particles.direction2 = new Vector3(0.035, 0.075, 0.02)
  particles.minEmitPower = 0.04
  particles.maxEmitPower = 0.12
  particles.updateSpeed = 0.012
  if (!reduceMotion) particles.start()

  let pointerX = 0
  let pointerY = 0
  const onPointerMove = (event) => {
    pointerX = (event.clientX / window.innerWidth) * 2 - 1
    pointerY = (event.clientY / window.innerHeight) * 2 - 1
  }
  const onPointerLeave = () => {
    pointerX = 0
    pointerY = 0
  }
  if (!reduceMotion && finePointer) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
  }

  let elapsed = 0
  let smoothProgress = 0
  let alive = true
  let heroVisible = true
  let lastFrame = 0
  const frameInterval = 1000 / (isSmall ? 30 : 45)
  const ringBaseZ = ring.rotation.z
  const stonesBaseY = stones.position.y
  const tallPebbleBaseY = tallPebble.position.y

  scene.registerBeforeRender(() => {
    const delta = Math.min(engine.getDeltaTime() / 1000, 0.05)
    if (!reduceMotion) elapsed += delta
    const progress = reduceMotion ? 0 : (progressRef?.current ?? 0)
    smoothProgress += (progress - smoothProgress) * 0.045

    const targetAlpha = -Math.PI / 2 + pointerX * 0.055
    const targetBeta = Math.PI / 2.12 - pointerY * 0.035
    camera.alpha += (targetAlpha - camera.alpha) * 0.035
    camera.beta += (targetBeta - camera.beta) * 0.035
    camera.radius += (baseRadius - smoothProgress * 0.48 - camera.radius) * 0.035

    world.position.y = smoothProgress * 0.42
    world.rotation.y = pointerX * 0.035 + smoothProgress * 0.08
    world.rotation.x = pointerY * 0.018

    ring.rotation.z = ringBaseZ + Math.sin(elapsed * 0.16) * 0.018 + smoothProgress * 0.12
    ring.rotation.y = -0.2 + pointerX * 0.04
    stones.position.y = stonesBaseY + Math.sin(elapsed * 0.28) * 0.018
    tallPebble.position.y = tallPebbleBaseY + Math.sin(elapsed * 0.22 + 1.2) * 0.025
    leftSprig.rotation.z = -0.38 + Math.sin(elapsed * 0.2) * 0.012
    rightSprig.rotation.z = 0.42 + Math.sin(elapsed * 0.18 + 2) * 0.014

    floatingLeaves.forEach(({ leaf, y, zRotation, phase }) => {
      leaf.position.y = y + Math.sin(elapsed * 0.24 + phase) * 0.055
      leaf.rotation.z = zRotation + Math.sin(elapsed * 0.18 + phase) * 0.025
    })
  })

  const render = (now) => {
    if (!alive || document.hidden || !heroVisible) return
    if (now - lastFrame < frameInterval) return
    lastFrame = now
    scene.render()
  }
  const startRendering = () => {
    engine.stopRenderLoop()
    engine.runRenderLoop(render)
  }
  const onVisibility = () => {
    if (document.hidden || !heroVisible) engine.stopRenderLoop()
    else startRendering()
  }
  const onResize = () => engine.resize()
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('resize', onResize)

  let observer = null
  const heroZone = document.querySelector('#hero-zone')
  if (heroZone && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting
      onVisibility()
    }, { rootMargin: '100px 0px' })
    observer.observe(heroZone)
  }

  scene.render()
  startRendering()
  onReady?.()

  return () => {
    alive = false
    observer?.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onPointerMove)
    document.documentElement.removeEventListener('pointerleave', onPointerLeave)
    particles.dispose()
    shadows.dispose()
    scene.dispose()
    engine.dispose()
  }
}
