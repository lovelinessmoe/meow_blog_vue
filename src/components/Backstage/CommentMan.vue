<template>
    <div class="animate">

        <avue-crud
                :data="data"
                :option="option"
                :table-loading="loading"
                @on-load="onLoad"
                @refresh-change="refreshChange"
                @row-del="rowDel"
                @selection-change="selectionChange"
                ref="crud"
                v-model="form">

            <!--            上栏插槽-->
            <template #menu-left="">
                <el-button @click="delSelection" text type="danger">
                    删除{{selectionList.length}}篇文章
                </el-button>
            </template>

            <!--            自定义列-->
            <template #content="{row}">
                <mavon-editor
                        :boxShadow="false"
                        :editable="false"
                        :ishljs="true" :subfield="false"
                        :toolbarsFlag="false" defaultOpen="preview"
                        style="z-index: 0;" v-model="row.content"
                />
                <!--                        :scrollStyle="true"-->
            </template>

        </avue-crud>

    </div>
</template>

<script>
    import {getComment, remove, removeMany} from "@/api/Backstage/comment";

    export default {
        name: "CommentMan",
        props: ['articleId'],
        data() {
            return {
                data: [],
                form: {},
                loading: true,
                option: {
                    rowKey: 'commentId',
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
                        {label: '评论id', prop: 'commentId', showColumn: false, hide: true,},
                        {label: '评论人', prop: 'userName', width: 200},
                        {label: '评论内容', prop: 'content'},
                        {label: '评论人id', prop: 'userId', showColumn: false, hide: true,},
                        {
                            label: '创建时间', prop: 'createTime', width: 200, addDisplay: false,
                            editDisplay: false,
                            formatter: (val) => {
                                return this.$moment(val.createTime).format('YYYY-MM-DD HH:mm:ss');
                            }
                        },
                    ]
                },
                currentStartIndex: 0,
                currentEndIndex: 20,
                selectionList: [],
                editVisible: false,
                articleTitleDisable: false,
            };
        },
        methods: {
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
                            await this.onLoad();
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
            async viewComment() {

            },
            async rowDel(row) {
                let r = await this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                if (r === 'confirm') {
                    console.dir(row)
                    let res = await remove(row.commentId);
                    if (res.success) {
                        await this.onLoad();
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    }
                }
            },
            selectionChange(list) {
                this.selectionList = list;
            },
            selectionClear() {
                this.selectionList = [];
                this.$refs.crud.toggleSelection();
            },
            refreshChange() {
                this.onLoad();
            },
            async onLoad() {
                this.loading = true;
                let res = await getComment(this.articleId);
                const data = res.data;
                this.data = data;
                this.loading = false;
                this.selectionClear();
            }
        },
    }
</script>

<style scoped>

</style>
