<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <!-- menu -->
        <group v-if="loaded && current === 'menu'" :position-y="2.5">
            <pointLight :position-z="5" :intensity="intensity" />

            <!-- intro text -->
            <group name="links">
                <TextMesh
                    :font="font"
                    v-for="(link, i) in links"
                    :key="i"
                    :text="link.text"
                    :position-y="i * -0.65"
                    :url="link.url"
                    @linkClicked="onClick"
                />
            </group>
        </group>

        <!-- case studies -->
        <Falling v-if="current === 'falling'" />
    </TroisCanvas>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import * as THREE from 'three'
import { animate } from 'popmotion'
import TextMesh from './components/TextMesh.vue'
import Falling from './falling/Falling.vue'

interface Link {
    text: string
    url?: string
}

// MENU
// =============
const current = ref('menu')

// prep links
const links: Link[] = [
    { text: 'Trois Renderer' },
    { text: '' },
    { text: 'falling', url: 'falling' },
]

watch(
    () => current.value,
    (currentEl) => {
        window.location.hash = currentEl === 'menu' ? '' : currentEl
    }
)

// FONT
// ===============
// load font
const loaded = computed(() => font.value)
const font = ref(null as null | THREE.Font)
const loader = new THREE.FontLoader()
loader.load('/easley.json', (loadedFont) => {
    font.value = loadedFont
})

// LIGHT ANIMATION
// =================
// light intensity
const intensity = ref(1)
let lightAnimation: { stop: () => void }

// click event
const onClick = async (url: string) => {
    if (lightAnimation) lightAnimation.stop()

    await new Promise<void>((onComplete) => {
        lightAnimation = animate({
            from: intensity.value,
            to: 0,
            duration: 200,
            onUpdate: (v) => (intensity.value = v),
            onComplete,
        })
    })
    current.value = url
}
</script>
