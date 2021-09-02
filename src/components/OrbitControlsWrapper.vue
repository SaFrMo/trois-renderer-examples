<template>
    <OrbitControls
        ref="controls"
        v-if="orbitArgs.length === 2"
        :args="orbitArgs"
        :enableDamping="true"
        :dampingFactor="0.1"
        v-bind="options"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useTrois, addBeforeRender, removeBeforeRender } from 'trois-renderer'
const trois = useTrois()

export default defineComponent({
    props: {
        options: {
            type: Object,
            default: () => ({}),
        },
    },
    mounted() {
        addBeforeRender(this.update)
    },
    computed: {
        orbitArgs() {
            const { camera, renderer } = trois
            return [camera.value, renderer.value?.domElement].filter(Boolean)
        },
    },
    beforeUnmount() {
        removeBeforeRender(this.update)
    },
    methods: {
        update() {
            ;(this.$refs.controls as any)?.$el?.instance?.update()
        },
    },
})
</script>
