<template>
    <group>
        <OrbitControlsWrapper
            :options="{ enablePan: true, enableZoom: true }"
        />
        <!-- <pointLight :position-x="-5" :position-y="20" />
    <ambientLight color="#666666" /> -->

        <mesh
            v-for="body in threeBodies"
            :key="body.id"
            :position="[body.position.x, body.position.y, body.position.z]"
            :scale="body.scale"
        >
            <component :is="body.geometry" />
            <meshBasicMaterial :color="body.color" />
        </mesh>
    </group>
</template>

<script lang="ts" setup>
import OrbitControlsWrapper from '../components/OrbitControlsWrapper.vue'
import * as CANNON from 'cannon-es'
import * as Vue from 'vue'
import * as THREE from 'three'
import { addBeforeRender, removeBeforeRender } from 'trois-renderer'
import setupCannon from './setupCannon'
import { getColor } from './colors'

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
const { physicsUpdate, world } = setupCannon()

// WORLD SETUP
// =============
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

// INSTANTIATION
// ===============
const addRandomBody = () => {
    const dice = Math.random()

    // if (dice <= 1) {
    const scale = Math.random() + 0.4
    const sphereBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Sphere(1),
        material: new CANNON.Material({
            restitution: Math.random() * 0.6 + 0.3,
        }),
    })
    const x = Math.random() * 10 - 5
    const y = 10
    sphereBody.position.set(x, y, 0) // m

    addBody(sphereBody, 'sphereGeometry', scale)
    // }
}
Vue.onMounted(async () => {
    for (let i = 0; i < 50; i++) {
        addRandomBody()
        await new Promise((res) => setTimeout(res, Math.random() * 800))
    }
})

// UPDATE FUNCTIONS
// ==============
const update = () => {
    physicsUpdate(() => {
        world.bodies.forEach((body, i) => {
            const threeBody = threeBodies.value.find((v) => v.id === body.id)
            threeBody?.position.copy(body.position as any)
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