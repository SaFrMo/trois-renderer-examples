<template>
    <group>
        <!-- click area -->
        <mesh
            @pointerEnter="hovering = true"
            @pointerLeave="hovering = false"
            @click="onClick"
            :scale-x="5"
            :scale-y="0.5"
            :position-x="2.5"
            :position-y="0.25"
            v-if="hasLink"
        >
            <planeGeometry />
            <meshBasicMaterial color="blue" :transparent="true" :opacity="1" />
        </mesh>

        <!-- text -->
        <mesh>
            <textGeometry :args="[text, { font, ...options }]" />
            <meshBasicMaterial :color="textColor" />
        </mesh>
    </group>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, withDefaults } from 'vue'
import * as THREE from 'three'

const props = withDefaults(
    defineProps<{
        text: string
        font: THREE.Font | null
        options?: object
        url?: string
    }>(),
    {
        options: () => ({ size: 0.5, height: 0.02 }),
    }
)

const hasLink = computed(() => props.url)

const hovering = ref(false)

const textColor = computed(() => {
    if (!hasLink.value) return 'white'
    return hovering.value ? 'tomato' : 'white'
})

const onClick = () => {
    if (hasLink.value) {
        console.log('TODO', props.url)
    }
}
</script>
