<!--文章的列表-->
<template>
    <ul class="menus">
        <li :key="item.id" v-for="item in menus">
            <span @click="goAnchor('#'+item.id)" style="cursor: pointer;">#{{item.title}}</span>
            <ul class="child" v-if="item[childLabel]">
                <menu-tree :child-label="childLabel" :menus="item[childLabel]"></menu-tree>
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

<style lang="less" scoped>
    .menus {
        line-height: 1.7em;
    }

    .child {
        padding-left: 15px;
    }

    ol, ul {
        list-style: none;
    }
</style>
