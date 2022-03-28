<template>
    <div class="animate" style="margin-top: 80px;padding: 20px;">

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

            <template #menu-left="">
                <el-button type="danger"
                           icon="el-icon-plus"
                           size="small"
                           plain
                           @click.stop="addRow()">新增
                </el-button>
                <el-button type="text" @click="delSelection">
                    删除{{selectionList.length}}篇文章
                </el-button>
            </template>

            <template #menu="{row,index}">
                <el-button type="text"
                           icon="el-icon-edit"
                           size="default"
                           plain
                           @click.stop="editRow(row,index)">编辑
                </el-button>
                <el-button type="text"
                           icon="el-icon-view"
                           size="default"
                           plain
                           @click.stop="viewRow(row,index)">查看
                </el-button>
            </template>

        </avue-crud>
        <el-button type="danger" @click="editVisible=false" v-if="editVisible">Close</el-button>
        <ArticleEdit v-bind:articleId="form.articleId" v-if="editVisible"/>
    </div>
</template>

<script>
    import '@vueup/vue-quill/dist/vue-quill.snow.css';
    import {add, update, remove, getList, getDetail, removeMany} from "@/api/Backstage/article";
    import ArticleEdit from "@/components/Backstage/ArticleEdit";

    export default {
        name: "articleMan",
        components: {ArticleEdit},
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
                editorOption: {
                    placeholder: '说些什么吧...',
                    modules: {
                        toolbar: {
                            container: [
                                ['bold', 'italic', 'underline'], //加粗，斜体，下划线，删除线
                                ['code-block'], //引用，代码块
                                [{
                                    'header': 1
                                }, {
                                    'header': 2
                                }], // 标题，键值对的形式；1、2表示字体大小
                                [{
                                    'header': [1, 2, 3, 4, 5, 6, false]
                                }], //几级标题
                                [{
                                    'color': []
                                }, {
                                    'background': []
                                }], // 字体颜色，字体背景颜色
                                [{
                                    'align': []
                                }], //对齐方式
                                ['clean'], //清除字体样式
                                ['link', 'image', 'video'] //上传图片、上传视频
                            ],
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        // 触发input框选择图片文件
                                        document.querySelector(".quill-img input").click();
                                    } else {
                                        this.quill.format("image", false);
                                    }
                                }
                            }
                        },
                    }
                },
                editVisible: false,
            };
        },
        directives: {},
        computed: {},
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
                this.form = row;
                this.editVisible = true;
            },
            async viewRow(row) {
                await this.$router.push("/blog/article/" + row.articleId);
            },
            addRow() {
                this.form = {};
                this.editVisible = true;
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
        }
    }
</script>

<style scoped>

</style>
