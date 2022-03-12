<template>
    <div>
        <el-card class="box-card">
            <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "HomePage",
    }
</script>

<style scoped>

</style>
