<template>
    <OrbitControlsWrapper :options="{ enablePan: false, enableZoom: true }" />

    <mesh
        v-for="(body, i) in bodies"
        :key="i"
        :position="[body.position.x, body.position.y, body.position.z]"
    >
        <sphereGeometry />
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

// WORLD SETUP
// =============
const { addBody, bodies, update, world } = setupCannon()
// Update function...
Vue.onMounted(() => {
    addBeforeRender(update)
})
// ...and teardown
Vue.onBeforeUnmount(() => {
    removeBeforeRender(update)
})

const radius = 1 // m
const sphereBody = new CANNON.Body({
    mass: 50, // kg
    shape: new CANNON.Sphere(radius),
})
sphereBody.position.set(0, 2, 0) // m

addBody(sphereBody)

setTimeout(() => {
    const s2 = new CANNON.Body({
        mass: 50, // kg
        shape: new CANNON.Sphere(radius),
    })
    s2.position.set(2, 2, 0) // m
    addBody(s2)
}, 2000)
Vue.watch(() => bodies.value, console.log, { deep: true })

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