<template>
    <TroisCanvas
        :cameraPosition="[0, 0, 10]"
        :rendererProperties="rendererProperties"
    >
        <!-- menu -->
        <group v-if="loaded" :visible="current === 'menu'" :position-y="2.5">
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
        <Falling v-if="current === 'falling'" @exited="current = 'menu'" />
    </TroisCanvas>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { animate } from 'popmotion'
import TextMesh from './components/TextMesh.vue'
import Falling from './falling/Falling.vue'
import { useTrois } from 'trois-renderer'
const trois = useTrois()

interface Link {
    text: string
    url?: string
}

// PROPERTIES
// =============
const rendererProperties = ref({
    'shadowMap.type': THREE.PCFSoftShadowMap,
    'shadowMap.enabled': true,
})

// MENU
// =============
const current = ref('')
onMounted(() => {
    current.value = window.location.hash?.replace(/^#/, '') || 'menu'
})

// prep links
const links: Link[] = [
    { text: 'Trois Renderer' },
    { text: '' },
    { text: 'falling', url: 'falling' },
]

// update hash on case study change
watch(
    () => current.value,
    (currentEl) => {
        if (currentEl === 'menu') {
            history.pushState(
                '',
                document.title,
                window.location.pathname + window.location.search
            )
        } else {
            window.location.hash = currentEl
        }
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

const fadeInLight = () => {
    // reset camera position/rotation
    trois.camera?.value?.position.set(0, 0, 10)
    trois.camera?.value?.rotation.setFromVector3(new THREE.Vector3(0, 0, 0))

    if (lightAnimation) lightAnimation.stop()
    lightAnimation = animate({
        from: intensity.value,
        to: 1,
        duration: 300,
        onUpdate: (v) => (intensity.value = v),
    })
}
watch(
    () => current.value,
    (newVal) => {
        if (newVal === 'menu') {
            fadeInLight()
        }
    }
)

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
