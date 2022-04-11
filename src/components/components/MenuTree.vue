<!--文章的列表-->
<template>
    <ul class="menus">
        <li v-for="item in menus" :key="item.id">
            <span style="cursor: pointer;" @click="goAnchor('#'+item.id)">#{{item.title}}</span>
            <ul v-if="item[childLabel]" class="child">
                <menu-tree :menus="item[childLabel]" :child-label="childLabel"></menu-tree>
            </ul>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "MenuTree",
        props: {
            menus: {
                type: [Object, Array],
                required: true
            },
            childLabel: {
                type: String,
                default: 'child'
            }
        },
        data() {
            return {}
        },
        methods: {
            goAnchor(selector) {
                document.querySelector(selector).scrollIntoView(true);
            }
        }
    }
</script>

<style scoped lang="less">
    .menus {
        line-height: 1.7em;
    }

    .child {
        padding-left: 15px;
    }
</style>
