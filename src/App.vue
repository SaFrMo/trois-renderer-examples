<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <group name="links" v-if="loaded">
            <mesh name="link">
                <textGeometry
                    :args="['Test', { font, size: 0.5, height: 0.02 }]"
                />
                <meshBasicMaterial :color="white" />
            </mesh>
        </group>
    </TroisCanvas>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import * as THREE from 'three'

export default defineComponent({
    setup() {
        const loaded = ref(false)
        const font = ref(null as null | THREE.Font)

        const loader = new THREE.FontLoader()
        loader.load('/easley.json', (loadedFont) => {
            loaded.value = true
            font.value = loadedFont
        })

        return {
            font,
            loaded,
        }
    },
})
</script>
