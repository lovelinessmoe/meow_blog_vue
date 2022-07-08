<!--文章展示页面-->
<template>
    <div class="articles">
        <banner :src="this.blog.imgUrl"></banner>
        <div class="site-content animate">
            <!-- 文章目录 -->
            <div id="article-menus">
                <menu-tree :menus="menus" child-label="child"></menu-tree>
            </div>
            <main class="site-main">
                <article class="hentry">
                    <!-- 文章头部 -->
                    <header class="entry-header">
                        <!-- 标题输出 -->
                        <h1 class="entry-title">{{blog.articleTitle}}</h1>
                        <hr>
                        <div class="breadcrumbs">
                            <div id="crumbs">最后更新时间：{{this.$moment(blog.createTime).format('YYYY年MM月DD日')}}</div>
                        </div>
                    </header>
                    <!-- 正文输出 -->
                    <!--                    <div class="entry-content" v-html="blog.articleContent"></div>-->
                    <div class="entry-content">
                        <mavon-editor
                                :boxShadow="false"
                                :editable="false"
                                :ishljs="true" :scrollStyle="true"
                                :subfield="false" :toolbarsFlag="false"
                                defaultOpen="preview" id="mavon_editor"
                                v-model="blog.articleContent"
                        />
                    </div>
                    <!-- 文章底部 -->
                    <section-title>
                        <footer class="post-footer">
                            <!-- 阅读次数 -->
                            <div class="post-like">
                                <i class="iconfont iconeyes"></i>
                                <span class="count">{{blog.viewsCount}}</span>
                            </div>
                            <!-- 分享按钮 -->
                            <!--                        <div class="post-share">-->
                            <!--                            <ul class="sharehidden">-->
                            <!--                                <li><a href="http://qr.liantu.com/api.php?text=https://zhebk.cn/Web/gongan.html"-->
                            <!--                                       onclick="window.open(this.href, 'renren-share', 'width=490,height=700');return false;"-->
                            <!--                                       class="s-weixin" target="_blank" rel="nofollow noopener noreferrer"><img src="https://cdn.zhebk.cn/usr/themes/Akina/images/wechat.png"></a></li>-->
                            <!--                                <li>-->
                            <!--                                    <a href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https://zhebk.cn/Web/gongan.html/&amp;title=公安联网备案记录"-->
                            <!--                                       onclick="window.open(this.href, 'weibo-share', 'width=730,height=500');return false;"-->
                            <!--                                       class="s-qq" target="_blank" rel="nofollow noopener noreferrer"><img src="https://cdn.zhebk.cn/usr/themes/Akina/images/qzone.png"></a></li>-->
                            <!--                                <li>-->
                            <!--                                    <a href="http://service.weibo.com/share/share.php?url=https://zhebk.cn/Web/gongan.html/&amp;title=公安联网备案记录"-->
                            <!--                                       onclick="window.open(this.href, 'weibo-share', 'width=550,height=235');return false;"-->
                            <!--                                       class="s-sina" target="_blank" rel="nofollow noopener noreferrer"><img src="https://cdn.zhebk.cn/usr/themes/Akina/images/sina.png"></a></li>-->
                            <!--                                <li>-->
                            <!--                                    <a href="http://shuo.douban.com/!service/share?https://zhebk.cn/Web/gongan.html/&amp;title=公安联网备案记录"-->
                            <!--                                       onclick="window.open(this.href, 'renren-share', 'width=490,height=600');return false;"-->
                            <!--                                       class="s-douban" target="_blank" rel="nofollow noopener noreferrer"><img src="https://cdn.zhebk.cn/usr/themes/Akina/images/douban.png"></a></li>-->
                            <!--                            </ul>-->
                            <!--                            <i class="iconfont show-share"></i>-->
                            <!--                        </div>-->
                            <!-- 赞助按钮 -->
                            <div @click="showDonate=!showDonate" class="donate">
                                <span>赏</span>
                                <ul :class="{'show':showDonate}" class="donate_inner">
                                    <li class="wedonate">
                                        <img src="http://q1.qlogo.cn/g?b=qq&nk=1695560542&s=640">
                                        <p>微信</p></li>
                                    <li class="alidonate">
                                        <img src="http://q1.qlogo.cn/g?b=qq&nk=1695560542&s=640">
                                        <p>支付宝</p></li>
                                </ul>
                            </div>
                            <!-- 文章标签 -->
                            <div class="post-tags">
                                <i class="iconfont iconcategory"></i>
                                <router-link to="/category/web">Web</router-link>
                            </div>
                        </footer>
                    </section-title>

                    <!--声明-->
                    <div class="open-message">
                        <p>声明：Meow博客|版权所有，违者必究|如未注明，均为原创</p>
                        <p>转载：转载请注明原文链接</p>
                    </div>
                    <!--评论-->
                    <div class="comments" style="text-align: center">
                        <el-button @click="commentEdit=true" type="success" v-if="!commentEdit">
                            留个言吧
                        </el-button>
                        <div v-else>
                            <mavon-editor style="z-index: 0;" v-model="this.replyComment.content"/>
                            <el-button @click="submitReply" circle icon="Check"
                                       style="float: right; position: relative;top: -32px;z-index: 1;"
                                       type="success"/>
                        </div>

                        <comment :comment="item" :key="item.commentId" @refreshComment="this.getComment"
                                 v-for="item in comments">
                            <template v-if="item.children?item.children.length:false">
                                <comment :comment="reply" :key="reply.commentId"
                                         v-for="reply in item.children"/>
                            </template>
                        </comment>
                    </div>
                </article>
            </main>
        </div>
    </div>
</template>

<script>
    import Banner from '@/components/components/BannerView'
    import sectionTitle from '@/components/components/SectionTitle'
    import comment from '@/components/components/CommentView'
    import menuTree from '@/components/components/MenuTree'
    import {getBlogDetail} from "@/api/article";
    import {addComment, getComment} from "@/api/comment";
    import {ElNotification} from "element-plus";

    export default {
        name: 'ArticlesView',
        data() {
            return {
                showDonate: false,
                comments: [],
                menus: [],
                blog: {},
                replyComment: {
                    articleId: this.$route.params.id,
                    content: '',
                    level: '0',
                    pid: '0',
                },
                commentEdit: false
            }
        },
        components: {
            Banner,
            sectionTitle,
            comment,
            menuTree
        },
        methods: {
            async getComment() {
                let res = await getComment(this.$route.params.id);
                this.comments = res.data || [];
            },
            fetchH(arr, left, right) {
                if (right) {
                    return arr.filter(item => item.offsetTop > left && item.offsetTop < right)
                } else {
                    return arr.filter(item => item.offsetTop > left)
                }
            },
            // 生成目录
            createMenus() {
                let arr = []
                for (let i = 6; i > 0; i--) {
                    let temp = []
                    // let e = document.querySelector(".entry-content").querySelectorAll(`h${i}`)
                    let e = document.querySelector(".v-note-show").querySelectorAll(`h${i}`)
                    for (let j = 0; j < e.length; j++) {
                        let child = this.fetchH(arr, e[j].offsetTop, (j + 1 === e.length) ? undefined : e[j + 1].offsetTop)
                        e[j].setAttribute("id", e[j].innerText);
                        temp.push({
                            h: i,
                            title: e[j].innerText,
                            id: e[j].id,
                            offsetTop: e[j].offsetTop,
                            child
                        })
                    }
                    if (temp.length) {
                        arr = temp
                    }
                }
                this.menus = arr
            },
            async getBlog() {
                let res = await getBlogDetail(this.$route.params.id);
                this.blog = res.data;
                this.$nextTick(function () {
                    this.createMenus();
                })
            },
            async submitReply() {
                if (this.$store.state.user) {
                    let res = await addComment(this.replyComment);
                    if (res.success) {
                        ElNotification({
                            message: '成功',
                            type: 'success'
                        })
                        await this.getComment();
                    }
                } else {
                    ElNotification({
                        message: '请登录后操作',
                        type: 'warning'
                    })
                }
            },
        },
        mounted() {
            this.$store.commit('SET_LOADING', false);
        },
        updated() {
        },
        created() {
            this.getBlog();
            this.getComment();
        },
    }
</script>
<style lang="less" scoped>
    .site-content {
        position: relative;

        .site-main {
            /*padding: -300px 0 0 0;*/
        }
    }

    #article-menus {
        position: sticky;
        top: 0;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .1);
        border-radius: 3px;
        padding: 15px;
        width: 200px;
        transform: translateX(-240px) translateY(150px);
        font-size: 14px;
    }

    article.hentry {
        .entry-header {
            .entry-title {
                font-size: 23px;
                font-weight: 600;
                color: #737373;
                margin: 0.67em 0;

                &:before {
                    content: "#";
                    margin-right: 6px;
                    color: #d82e16;
                    font-size: 20px;
                    font-weight: 600;
                }
            }

            hr {
                height: 1px;
                border: 0;
                background: #EFEFEF;
                margin: 15px 0;
            }

            .breadcrumbs {
                font-size: 14px;
                color: #D2D2D2;
                text-decoration: none;
                margin-bottom: 30px;
            }
        }

        .entry-content {
            #mavon_editor {
                z-index: 0;
            }
        }

        footer.post-footer {
            width: 100%;
            padding: 20px 10px;
            margin-top: 30px;
            height: 65px;
            position: relative;

            i {
                font-size: 18px;
                margin-right: 5px;
            }

            .post-like {
                float: right;
                margin: 7px 0 0 20px;
            }

            .post-share {
                float: right;
                list-style: none;
                margin-right: 20px;
            }

            .donate {
                float: left;
                line-height: 36px;
                border-radius: 100%;
                -webkit-border-radius: 100%;
                -moz-border-radius: 100%;
                border: 1px solid #2B2B2B;

                &:hover {
                    border: 1px solid goldenrod;

                    span {
                        color: goldenrod;
                    }
                }

                span {
                    color: #2B2B2B;
                    padding: 10px;
                    position: relative;
                    cursor: pointer;
                }

                .donate_inner {
                    display: none;
                    margin: 0;
                    list-style: none;
                    position: absolute;
                    left: 80px;
                    top: -40px;
                    background: #FFF;
                    padding: 10px;
                    border: 1px solid #ddd;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, .08);
                    border-radius: 3px;

                    &.show {
                        display: block;
                    }

                    li {
                        float: left;
                    }

                    img {
                        width: 100px;
                    }

                    p {
                        text-align: center;
                        font-size: 15px;
                        color: #D2D2D2;
                        line-height: 1rem;
                    }
                }

                .donate_inner:after, .donate_inner:before {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: 45%;
                    margin-left: -8px;
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-right: 8px solid #fff;
                }

                .donate_inner:before {
                    left: -1px;
                    border-right: 8px solid #ddd;
                }

            }

            .post-tags {
                margin: 7px 0 0 20px;
                float: left;
                text-transform: uppercase;

                a:hover {
                    color: #ff6d6d;
                }
            }
        }

        .open-message {
            margin: 50px 0;
            position: relative;
            background: #2B2B2B;
            padding: 10px 30px;
            border-radius: 3px;
            font-size: 14px;
            color: #fff;

            &:after {
                content: "";
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 10px solid #2B2B2B;
                position: absolute;
                top: -8px;
                left: 48%;
            }

            p {
                margin: 10px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            a {
                color: #A0DAD0;
                padding: 0 5px;
            }
        }
    }
</style>
