<template>
    <avue-crud
            :option="option"
            :table-loading="loading"
            :data="data"
            v-model:page="page"
            v-model="form"
            ref="crud"
            :before-open="beforeOpen"
            @row-update="rowUpdate"
            @row-save="rowSave"
            @row-del="rowDel"
            @search-change="searchChange"
            @search-reset="searchReset"
            @selection-change="selectionChange"
            @current-change="currentChange"
            @size-change="sizeChange"
            @refresh-change="refreshChange"
            @on-load="onLoad">
        <template #articleContentForm="{type,disabled}">
            <el-tag>窗口类型:{{type=='add'?'新增':'修改'}}</el-tag>
            <el-tag>{{form.articleContent?form.articleContent:'暂时没有内容'}}</el-tag>
            <el-input :disabled="disabled" v-model="form.articleContent"></el-input>
        </template>
    </avue-crud>
</template>

<script>
    import {add, update, remove, getList, getDetail} from "@/api/Backstage/article";

    export default {
        name: "articleMan",
        data() {
            return {
                data: [],
                form: {},
                query: {},
                loading: true,
                option: {
                    addBtn: true,
                    height: 'auto',
                    calcHeight: 145,
                    tip: false,
                    searchShow: true,
                    searchMenuSpan: 6,
                    card: true,
                    excelBtn: true,
                    border: true,
                    index: true,
                    viewBtn: true,
                    selection: true,
                    dialogClickModal: false,
                    column: [
                        {label: '文章id', prop: 'articleId', search: true},
                        {label: '文章标题', prop: 'articleTitle', width: 200, search: true},
                        {label: '文章简介', prop: 'articleShort', search: true},
                        {
                            label: '创建时间', prop: 'createTime', width: 200, addDisplay: false,
                            editDisplay: false,
                            format: "yyyy-MM-dd hh:mm:ss", valueFormat: "yyyy-MM-dd HH:mm:ss"
                        },
                        {label: '文章内容', prop: 'articleContent', showColumn: false, hide: true,},
                        {
                            label: '类型', prop: 'type', showColumn: false, hide: true,
                            addDisplay: false, editDisplay: false
                        },
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
            };
        },
        directives: {},
        created() {
        },
        computed: {},
        methods: {
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
        }
    }
</script>

<style scoped>

</style>
