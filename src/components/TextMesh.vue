<template>
    <group>
        <mesh
            @pointerEnter="textColor = 'tomato'"
            @pointerLeave="textColor = 'white'"
            @click="onClick"
            :position-x="5"
        >
            <planeGeometry />
            <meshBasicMaterial :transparent="true" :opacity="1" />
        </mesh>

        <mesh>
            <!-- text -->
            <mesh>
                <textGeometry :args="[text, { font, ...options }]" />
                <meshBasicMaterial :color="textColor" />
            </mesh>
        </mesh>
    </group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as THREE from 'three'

export default defineComponent({
    props: {
        text: { type: String, required: true },
        font: { type: THREE.Font, required: true },
        options: { type: Object, default: () => ({ size: 0.5, height: 0.02 }) },
        url: { type: String, default: '' },
    },
    data() {
        return {
            textColor: 'white',
        }
    },
    methods: {
        onClick() {
            if (this.url) {
                console.log(this.url)
            }
        },
    },
})
</script>
