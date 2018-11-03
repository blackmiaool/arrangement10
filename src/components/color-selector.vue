<template>
    <el-dropdown @command="handleCommand">

        <el-button type="primary" :style="{'background-color':value.bg_color,'color':value.title_color,border:'none'}">
            {{value.title}}
            <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(value,i) in colors" :key="i" :style="{'background-color':value.bg_color,'color':value.title_color}" :command="value">
                <span>
                    {{value.title}}
                </span>
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>

</template>

<script>
export default {
    name: "color-selector",
    data() {
        return {};
    },
    props: ["title", "value", "colors"],
    computed: {},
    methods: {
        handleCommand(command) {
            this.$emit("input", command);
        }
    },
    components: {}
};
</script>

<style>
</style>
