<template>
    <OrbitControlsWrapper :options="{ enablePan: false, enableZoom: true }" />

    <mesh
        v-for="(body, i) in threeBodies"
        :key="i"
        :position="[body.position.x, body.position.y, body.position.z]"
    >
        <component :is="body.geometry" />
        <meshBasicMaterial />
    </mesh>
</template>

<script lang="ts" setup>
import OrbitControlsWrapper from '../components/OrbitControlsWrapper.vue'
import * as CANNON from 'cannon-es'
import * as Vue from 'vue'
import * as THREE from 'three'
import { addBeforeRender, removeBeforeRender } from 'trois-renderer'
import setupCannon from './setupCannon'

// PREP THREE
// ============
interface ThreeBody {
    id: number
    position: THREE.Vector3
    rotation: THREE.Quaternion
    geometry: string
}
const threeBodies = Vue.ref([] as ThreeBody[])

// CANNON WORLD SETUP
// ====================
const { physicsUpdate, world } = setupCannon()

// WORLD SETUP
// =============
// prep adding bodies
const addBody = (body: CANNON.Body, geometry?: string) => {
    world.addBody(body)

    if (geometry) {
        threeBodies.value.push({
            id: body.id,
            position: new THREE.Vector3().copy(body.position as any),
            rotation: new THREE.Quaternion().copy(body.quaternion as any),
            geometry,
        })
    }
}

// INSTANTIATION
// ===============
const radius = 1 // m
const sphereBody = new CANNON.Body({
    mass: 50, // kg
    shape: new CANNON.Sphere(radius),
    material: new CANNON.Material({ restitution: 0.5 }),
})
sphereBody.position.set(0, 2, 0) // m

addBody(sphereBody, 'sphereGeometry')

// UPDATE SETUP
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

// THREE UPDATE
// =================
// const scene = Vue.reactive({
//     positions: [] as THREE.Vector3[],
// })
// const blank = new THREE.Vector3()
// const threeUpdate = () => {
//     bodies.value.forEach((body, i) => {
//         blank.set(body.position.x, body.position.y, body.position.z)
//         scene.positions.splice(i, 1, blank.clone())
//     })
// }
// addBeforeRender(threeUpdate)
</script>