<!--评论区的每个-->
<template>
    <div :id="`comment${comment.commentId}`" class="comment">
        <div class="comment-head">
            <div class="user-avatar"><img
                    :src="comment.avatarUrl?comment.avatarUrl:'https://s2.loli.net/2022/04/05/3QmL6UklnaV9EP5.jpg'"
                    alt=""></div>
            <div class="head-right">
                <section-title>
                    <div style="display: flex;align-items: center;justify-content: space-between;">
                        <div>
                            <span class="from-user user-name">{{comment.userName}}</span>
                            <!--<span class="to-user" v-if="comment.toUserId">
                                <span style="margin: 0 5px;">@</span>
                                <span class="user-name">{{comment.toUserName}}</span>
                            </span>-->
                        </div>
                        <div style="font-size: 13px;">
                            <span style="color: #9c9c9c;margin-right: 20px;">{{this.$moment(comment.createTime).format('YYYY-MM-DD')}}</span>
                            <span @click.stop="showCommentEditor=true" style="cursor: pointer;"
                                  v-if="comment.pId === '0'">回复</span>
                        </div>
                    </div>
                </section-title>
            </div>
        </div>
        <div class="comment-body">
            <div class="content-text">
                <!--                <p>{{comment.content}}</p>-->
                <mavon-editor
                        :boxShadow="false"
                        :editable="false"
                        :ishljs="true" :subfield="false"
                        :toolbarsFlag="false" defaultOpen="preview"
                        style="z-index: 0;" v-model="content"
                />
            </div>
            <div @click.stop="" v-if="showCommentEditor">
                <mavon-editor v-model="this.replyComment.content"/>
                <el-button @click="submitReply" circle icon="Check"
                           style="float: right; position: relative;top: -32px;z-index: 999999;"
                           type="success"/>
                <!--                <comment-message-editor :inline="true" buttonText="回复" @submit="submitReply"></comment-message-editor>-->
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import sectionTitle from '@/components/components/SectionTitle'
    import {addComment} from "@/api/comment";
    import {ElNotification} from "element-plus";
    // eslint-disable-next-line no-unused-vars
    // import commentMessageEditor from 'comment-message-editor'

    export default {
        name: "CommentView",
        props: {
            comment: {
                type: Object
            }
        },
        created() {
            this.content = this.comment.content;
        },
        data() {
            return {
                showCommentEditor: false,
                replyComment: {
                    articleId: this.$route.params.id,
                    content: '',
                    level: '0',
                    pid: this.comment.commentId,
                },
                content: '',
            }
        },
        watch: {
            showCommentEditor(value) {
                if (value) {
                    document.body.addEventListener('click', this.close)
                } else {
                    document.body.removeEventListener('click', this.close)
                }
            }
        },
        components: {
            sectionTitle,
            // commentMessageEditor
        },
        methods: {
            reply() {
                // reply(id){
                // const ref = `comment${id}`
            },
            async submitReply() {
                let res = await addComment(this.replyComment);
                if (res.success) {
                    ElNotification({
                        message: '成功',
                        type: 'success'
                    })
                    this.$emit('refreshComment');
                }
            },
            close() {
                this.showCommentEditor = false
            }
        }
    }
</script>

<style lang="less" scoped>
    .comment {
        margin: 20px 0;
    }

    .comment-head {
        display: flex;

        .head-right {
            flex: 1;
        }

        .user-name {
            color: #8fd0cc;
        }
    }

    .comment-body {
        padding-left: 80px;

        .content-text {
            /*padding-bottom: 30px;*/
            margin-bottom: 30px;
            font-size: 14px;
            color: #9c9c9c;
            line-height: 1.3rem;
        }
    }

    .user-avatar {
        width: 50px;
        height: 50px;
        margin-right: 30px;

        img {
            width: 100%;
            height: 100%;
            border-radius: 100%;
        }
    }

    @media (max-width: 600px) {
        .comment-body {
            padding-left: 15px;

            .content-text {
                margin-top: 10px;
            }
        }

        .user-avatar {
            margin-right: 10px;
        }
    }
</style>
