<template>
    <TroisCanvas :cameraPosition="[0, 0, 10]">
        <group name="links" v-if="loaded">
            <TextMesh
                :font="font"
                v-for="(link, i) in links"
                :key="i"
                :text="link.text"
                :position-y="-i"
                :url="link.url"
            />
        </group>
    </TroisCanvas>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import * as THREE from 'three'
import TextMesh from './components/TextMesh.vue'

interface Link {
    text: string
    url?: string
}

// prep links
const links: Link[] = [
    { text: 'Test' },
    { text: 'Test 2' },
    { text: 'Test', url: '/test' },
    { text: 'Test 2', url: '/test2' },
    { text: 'Test', url: '/test' },
    { text: 'Test 2', url: '/test2' },
    { text: 'Test', url: '/test' },
    { text: 'Test 2', url: '/test2' },
]

// load font
const loaded = computed(() => font.value)
const font = ref(null as null | THREE.Font)
const loader = new THREE.FontLoader()
loader.load('/easley.json', (loadedFont) => {
    font.value = loadedFont
})

// click event
const onClick = (link: Link) => {
    console.log(link)
}
</script>
