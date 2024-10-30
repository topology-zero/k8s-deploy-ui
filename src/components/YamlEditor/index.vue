<template>
    <codemirror v-model="code"
                ref="mycodemirror"
                :autofocus="true"
                :extensions="extensions"
                :indent-with-tab="true"
                @change="handleChange"
                :tab-size="2" />
</template>
<script setup>
import { Codemirror } from 'vue-codemirror'
import { yaml } from '@codemirror/lang-yaml'

const code = defineModel({ type: String })
const extensions = [yaml()]
const handleChange = e => { code.value = e }
</script>

<style lang="scss" scoped>
:deep(.cm-editor) {
    width: 100%;
    height: 300px;
}
</style>
