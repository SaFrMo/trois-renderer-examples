<template>
    <group>
        <OrbitControlsWrapper
            :options="{
                enablePan: false,
                enableZoom: false,
                minAzimuthAngle: -Math.PI * 0.4,
                maxAzimuthAngle: Math.PI * 0.4,
                minPolarAngle: Math.PI * 0.1,
                maxPolarAngle: Math.PI * 0.5,
            }"
        />
        <spotLight
            :shadow-mapSize-height="1024"
            :shadow-mapSize-width="1024"
            :castShadow="true"
            :position-x="0"
            :position-y="1"
            :position-z="5"
            :intensity="spotLightIntensity * 0.3"
            :penumbra="0.5"
            color="#efdede"
        />
        <ambientLight color="#aaaaaa" :intensity="ambientLightIntensity" />

        <!-- floor -->
        <mesh
            :receiveShadow="true"
            :rotation-x="Math.PI * -0.5"
            :position-y="-3"
            :scale="20"
        >
            <planeGeometry />
            <meshStandardMaterial />
        </mesh>
        <!-- back wall -->
        <mesh :receiveShadow="true" :position-z="-1" :scale="20">
            <planeGeometry />
            <meshStandardMaterial />
        </mesh>

        <!-- shapes -->
        <mesh
            v-for="body in threeBodies"
            :key="body.id"
            :position="[body.position.x, body.position.y, body.position.z]"
            :scale="body.scale"
            :castShadow="true"
            :receiveShadow="true"
        >
            <component :is="body.geometry" :args="[1, 4]" />
            <meshPhongMaterial :color="body.color" />
        </mesh>
    </group>
</template>

<script lang="ts" setup>
import OrbitControlsWrapper from '../components/OrbitControlsWrapper.vue'
import * as CANNON from 'cannon-es'
import * as Vue from 'vue'
import { defineEmits } from 'vue'
import * as THREE from 'three'
import { addBeforeRender, removeBeforeRender } from 'trois-renderer'
import setupCannon from './setupCannon'
import { getColor } from './colors'
import { animate } from 'popmotion'

// EXIT
// ====================
const emit =
    defineEmits<{
        (event: 'exited'): void
    }>()
Vue.onMounted(() => {
    window.addEventListener('keydown', leave)
})
Vue.onBeforeUnmount(() => {
    window.removeEventListener('keydown', leave)
})

// LIGHT FADEIN/FADEOUT
// =====================
const introLength = 800
const outroLength = 300
const spotLightIntensity = Vue.ref(0)
const ambientLightIntensity = Vue.ref(0)
let lightAnimation: { stop: () => void }
Vue.onMounted(() => {
    if (lightAnimation) lightAnimation.stop()
    lightAnimation = animate({
        from: 0,
        to: 1,
        duration: introLength,
        onUpdate: (v) => {
            spotLightIntensity.value = v
            ambientLightIntensity.value = v
        },
    })
})
const leave = async (evt: KeyboardEvent) => {
    if (evt.key !== 'Escape') return

    if (lightAnimation) lightAnimation.stop()
    await new Promise<void>((res) => {
        lightAnimation = animate({
            from: spotLightIntensity.value,
            to: 0,
            duration: outroLength,
            onUpdate: (v) => {
                spotLightIntensity.value = v
                ambientLightIntensity.value = v
            },
            onComplete: res,
        })
    })
    emit('exited')
}

// PREP THREE
// ============
interface ThreeBody {
    id: number
    position: THREE.Vector3
    rotation: THREE.Quaternion
    geometry: string
    color: string
    scale: number
}
const threeBodies = Vue.ref([] as ThreeBody[])

// PREP CANNON
// ====================
let { physicsUpdate, world } = setupCannon()

// WORLD SETUP & TEARDOWN
// =========================
const addBody = (body: CANNON.Body, geometry?: string, scale?: number) => {
    world.addBody(body)

    if (geometry && scale) {
        threeBodies.value.push({
            id: body.id,
            position: new THREE.Vector3().copy(body.position as any),
            rotation: new THREE.Quaternion().copy(body.quaternion as any),
            geometry,
            color: getColor(),
            scale,
        })
    }
}
Vue.onBeforeUnmount(() => {
    world.bodies.forEach((body) => {
        world.removeBody(body)
    })
    world = null as any
})

// INSTANTIATION
// ===============
const addRandomBody = () => {
    const scale = Math.random() * 0.25 + 0.2
    const sphereBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Sphere(scale),
        material: new CANNON.Material({
            restitution: Math.random() * 0.6 + 0.3,
        }),
    })
    const x = Math.random() * 10 - 5
    const y = 10
    sphereBody.position.set(x, y, 0) // m

    addBody(sphereBody, 'icosahedronGeometry', scale)
}
Vue.onMounted(async () => {
    await new Promise((res) => setTimeout(res, introLength))
    for (let i = 0; i < 100; i++) {
        addRandomBody()
        await new Promise((res) => setTimeout(res, Math.random() * 800 + 400))
        if (!world) break
    }
})

// UPDATE FUNCTIONS
// ==============
const update = () => {
    physicsUpdate(() => {
        world.bodies.forEach((body, i) => {
            const threeBody = threeBodies.value.find((v) => v.id === body.id)
            threeBody?.position.copy(body.position as any)
            threeBody?.rotation.copy(body.quaternion as any)
        })
    })
}
// Update function...
Vue.onMounted(() => {
    addBeforeRender(update)
})
// ...and teardown
Vue.onBeforeUnmount(() => {
    removeBeforeRender(update)
})
</script>