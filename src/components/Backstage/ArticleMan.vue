<!--文章管理-->
<template>
    <div class="animate" style="margin-top: 80px;padding: 20px;">

        <avue-crud
                :before-open="beforeOpen"
                :data="data"
                :option="option"
                :table-loading="loading"
                @current-change="currentChange"
                @on-load="onLoad"
                @refresh-change="refreshChange"
                @row-del="rowDel"
                @row-save="rowSave"
                @row-update="rowUpdate"
                @search-change="searchChange"
                @search-reset="searchReset"
                @selection-change="selectionChange"
                @size-change="sizeChange"
                ref="crud"
                v-model="form"
                v-model:page="page">

            <!--            上栏插槽-->
            <template #menu-left="">
                <el-button @click.stop="addRow()"
                           icon="el-icon-plus"
                           plain
                           size="small"
                           type="danger">新增
                </el-button>
                <el-button @click="delSelection" text type="danger">
                    删除{{selectionList.length}}篇文章
                </el-button>
            </template>
            <!--            操作插槽-->
            <template #menu="{row,index}">
                <el-button @click.stop="editRow(row,index)" icon="el-icon-edit"
                           plain
                           size="default"
                           text
                           type="primary">编辑
                </el-button>
                <el-button @click.stop="viewRow(row,index)" icon="el-icon-view"
                           plain
                           size="default"
                           text
                           type="primary">查看
                </el-button>
                <el-button @click.stop="viewComment(row,index)" icon="chat-line-round"
                           plain
                           size="default"
                           text
                           type="primary">查看评论
                </el-button>
            </template>
            <!--            自定义列-->
            <template #isTop="{row}">
                <el-switch @change="switchTopStat(row.articleId)" v-model="row.isTop"/>
            </template>
        </avue-crud>


        <ArticleEdit @close="editVisible=false;this.onLoad(this.page);"
                     v-bind:articleId="form.articleId" v-bind:articleTitleDisable="articleTitleDisable"
                     v-if="editVisible"/>

        <!-- 评论管理弹窗 -->
        <el-dialog
                fullscreen="fullscreen"
                title="查看评论"
                v-if="commentModel"
                v-model="commentModel">

            <CommentMan :articleId="articleId"></CommentMan>
        </el-dialog>

    </div>
</template>

<script>
    import {add, update, remove, getList, getDetail, removeMany, switchTop} from "@/api/Backstage/article";
    import ArticleEdit from "@/components/Backstage/ArticleEdit";
    import CommentMan from "@/components/Backstage/CommentMan";

    export default {
        name: "articleMan",
        components: {CommentMan, ArticleEdit},
        // components: {QuillEditor},
        data() {
            return {
                data: [],
                form: {},
                query: {},
                loading: true,
                option: {
                    addBtn: false,
                    editBtn: false,
                    viewBtn: false,
                    height: 'auto',
                    calcHeight: 145,
                    tip: false,
                    searchShow: true,
                    searchMenuSpan: 6,
                    card: true,
                    excelBtn: true,
                    border: true,
                    index: true,
                    selection: true,
                    dialogClickModal: false,
                    column: [
                        {label: '文章id', prop: 'articleId', search: true},
                        {label: '文章标题', prop: 'articleTitle', width: 200, search: true},
                        {label: '文章简介', prop: 'articleShort', search: true},
                        {
                            label: '创建时间', prop: 'createTime', width: 200, addDisplay: false,
                            editDisplay: false,
                            formatter: (val) => {
                                return this.$moment(val.createTime).format('YYYY-MM-DD HH:mm:ss');
                            }
                        },
                        {label: '查看人数', prop: 'viewsCount',},
                        {label: '评论人数', prop: 'commentsCount',},
                        {label: '置顶', prop: 'isTop',},
                        // {label: '文章内容', prop: 'articleContent', showColumn: false, hide: true,},
                        /*{
                            label: '类型', prop: 'type', showColumn: false, hide: true,
                            addDisplay: false, editDisplay: false
                        },*/
                    ]
                },
                currentStartIndex: 0,
                currentEndIndex: 20,
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                selectionList: [],
                editVisible: false,
                articleTitleDisable: false,
                commentModel: false,
                //查看评论时使用的查询条件
                articleId: '',
            };
        },
        directives: {},
        computed: {},
        methods: {
            async switchTopStat(articleId) {
                let res = switchTop(articleId);
                if (res.success) {
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }
            },
            async delSelection() {
                if (this.selectionList.length !== 0) {
                    let r = await this.$confirm("确定将选择数据删除?", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    if (r === 'confirm') {
                        let res = await removeMany(this.selectionList);
                        if (res.success) {
                            await this.onLoad(this.page);
                            this.$message({
                                type: "success",
                                message: "操作成功!"
                            });
                        }
                    }
                } else {
                    this.$message.error('未选中任何项')
                }
            },
            async editRow(row) {
                this.articleTitleDisable = true;
                this.editVisible = false;
                this.$nextTick(() => {
                    this.form = row;
                    this.editVisible = true;
                })
            },
            async viewRow(row) {
                await this.$router.push("/blog/article/" + row.articleId);
            },
            async viewComment(row) {
                this.articleId = row.articleId;
                this.commentModel = true;
            },
            addRow() {
                this.articleTitleDisable = false;
                this.editVisible = false;
                this.$nextTick(() => {
                    this.form = {};
                    this.editVisible = true;
                })
            },
            async rowSave(row, done, loading) {
                try {
                    await add(row)
                    await this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                    done();
                } catch (e) {
                    loading();
                    console.log(e);
                }
            },
            async rowUpdate(row, index, done, loading) {
                try {
                    await update(row)
                    await this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                    done();
                } catch (e) {
                    loading();
                    console.log(e);
                }
            },
            async rowDel(row) {
                let r = await this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                if (r === 'confirm') {
                    let res = await remove(row.articleId);
                    if (res.success) {
                        await this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    }
                }
            },
            beforeOpen(done, type) {
                if (["edit", "view"].includes(type)) {
                    getDetail(this.form.articleId).then(res => {
                        this.form = res.data;
                    });
                }
                done();
            },
            searchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params, done) {
                this.query = params;
                this.page.currentPage = 1;
                this.onLoad(this.page, params);
                done();
            },
            selectionChange(list) {
                this.selectionList = list;
            },
            selectionClear() {
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
            },
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            refreshChange() {
                this.onLoad(this.page, this.query);
            },
            async onLoad(page, params = {}) {
                this.loading = true;
                let res = await getList(page.currentPage, page.pageSize, Object.assign(params, this.query))
                const data = res.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
                this.selectionClear();
            }
        },
        mounted() {
            this.$store.commit('SET_LOADING', false);
        },
    }
</script>

<style scoped>

</style>
