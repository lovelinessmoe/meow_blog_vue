<template>
    <avue-crud
            :option="option"
            :table-loading="loading"
            :data="data"
            v-model:page="page"
            v-model="form"
            ref="crud"
            @row-update="rowUpdate"
            @row-save="rowSave"
            @row-del="rowDel"
            @search-change="searchChange"
            @search-reset="searchReset"
            @selection-change="selectionChange"
            @current-change="currentChange"
            @size-change="sizeChange"
            @refresh-change="refreshChange"
            @on-load="onLoad"
    ></avue-crud>
</template>

<script>
    import {add, update, remove, getList} from "@/api/Backstage/user";

    export default {
        name: "UserMan",
        data() {
            return {
                data: [],
                form: {},
                query: {},
                loading: true,
                option: {
                    addBtn: false,
                    height: 'auto',
                    calcHeight: 150,
                    tip: false,
                    searchShow: true,
                    searchMenuSpan: 6,
                    card: true,
                    excelBtn: true,
                    border: true,
                    index: true,
                    viewBtn: false,
                    selection: true,
                    dialogClickModal: false,
                    column: [
                        // {label: '用户ID', prop: 'userId', width: 200,},
                        {label: '用户名', prop: 'userName', search: true},
                        {label: '手机号', prop: 'telephone', width: 200, search: true},
                        {label: '邮箱', prop: 'email', width: 200, search: true},
                        {label: '年龄', prop: 'age', search: true},
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
                    let res = await remove(row.userId);
                    if (res.success) {
                        await this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    }
                }
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
