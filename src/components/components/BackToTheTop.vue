<!--回到顶端-->
<template>
    <transition name="slide-fade">
        <div @click.stop="getTop" class="back-top" v-show="show">
            <img alt="" class="img1" src="@/assets/img/_tortoise.svg">
            <img alt="" class="img2" src="@/assets/img/tortoise.svg">
            <p>Top</p>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "BackToTheTop",
        data() {
            return {
                show: false
            }
        },
        methods: {
            scroll() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                if (scrollTop > 150) {
                    this.show = true
                } else {
                    this.show = false
                }
            },
            getTop() {
                let timer = setInterval(() => {
                    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                    let speed = Math.ceil(scrollTop / 5)
                    document.documentElement.scrollTop = scrollTop - speed
                    if (scrollTop === 0) {
                        clearInterval(timer)
                    }
                }, 20)
            }
        },
        mounted() {
            window.addEventListener('scroll', this.scroll)
        },
        beforeUnmount() {
            window.removeEventListener('scroll', this.scroll)
        }
    }
</script>

<style lang="less" scoped>
    .back-top {
        background-color: #FFFFFF;
        position: fixed;
        right: 3rem;
        bottom: 8rem;
        border-radius: 25px;
        cursor: pointer;
        opacity: .3;
        transition: .3s;
        text-align: center;
        z-index: 99;

        img {
            width: 60px;
            height: 60px;
        }

        .img2 {
            display: none;
        }

        &:hover img.img1 {
            display: none;
        }

        &:hover img.img2 {
            display: unset;
        }
    }

    @media (max-width: 600px) {
        .back-top {
            display: none;
        }
    }
</style>
