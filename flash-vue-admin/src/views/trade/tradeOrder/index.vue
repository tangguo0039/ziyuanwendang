<template>
    <div class="app-container">
        <div class="block">
            <el-row  :gutter="20">
                <el-col :span="4">
                    <el-input v-model="listQuery.id" size="mini" placeholder="请输入id"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
                </el-col>
            </el-row>
            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini"  icon="el-icon-plus" @click.native="add" v-permission="['/trade/add']">{{ $t('button.add') }}</el-button>
                    <el-button type="primary" size="mini"  icon="el-icon-edit" @click.native="edit" v-permission="['/trade/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click.native="remove" v-permission="['/trade/delete']">{{ $t('button.delete') }}</el-button>
                </el-col>
            </el-row>
        </div>


        <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
                  @current-change="handleCurrentChange">
            <el-table-column label="hash订单id">
                <template slot-scope="scope">
                    {{scope.row.hash}}
                </template>
            </el-table-column>
            <el-table-column label="订单结果">
                <template slot-scope="scope">
                    {{scope.row.result}}
                </template>
            </el-table-column>
            <el-table-column label="订单提交状态">
                <template slot-scope="scope">
                    {{scope.row.trade_status}}
                </template>
            </el-table-column>
            <el-table-column label="确认的SRs">
                <template slot-scope="scope">
                    {{scope.row.confirmed_srs}}
                </template>
            </el-table-column>
            <el-table-column label="块段">
                <template slot-scope="scope">
                    {{scope.row.block}}
                </template>
            </el-table-column>
            <el-table-column label="块段">
                <template slot-scope="scope">
                    {{scope.row.trade_time}}
                </template>
            </el-table-column>
            <el-table-column label="订单消耗的资源">
                <template slot-scope="scope">
                    {{scope.row.resources_consumed_fees}}
                </template>
            </el-table-column>
            <el-table-column label="from">
                <template slot-scope="scope">
                    {{scope.row.owner_address}}
                </template>
            </el-table-column>
            <el-table-column label="to">
                <template slot-scope="scope">
                    {{scope.row.receiving_address}}
                </template>
            </el-table-column>
            <el-table-column label="资源值">
                <template slot-scope="scope">
                    {{scope.row.value}}
                </template>
            </el-table-column>
            <el-table-column label="交易方法值">
                <template slot-scope="scope">
                    {{scope.row.method_calling}}
                </template>
            </el-table-column>
            <el-table-column label="区块哈希">
                <template slot-scope="scope">
                    {{scope.row.block_hash}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.native="editItem(scope.row)" v-permission="['/trade/update']">{{ $t('button.edit') }}</el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.native="removeItem(scope.row)" v-permission="['/trade/delete']">{{ $t('button.delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100,500]"
                :page-size="listQuery.limit"
                :total="total"
                @size-change="changeSize"
                @current-change="fetchPage"
                @prev-click="fetchPrev"
                @next-click="fetchNext">
        </el-pagination>

        <el-dialog
                :title="formTitle"
                :visible.sync="formVisible"
                width="70%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="hash订单id"  >
                            <el-input v-model="form.hash" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单结果"  >
                            <el-input v-model="form.result" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单提交状态"  >
                            <el-input v-model="form.trade_status" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="确认的SRs"  >
                            <el-input v-model="form.confirmed_srs" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="块段"  >
                            <el-input v-model="form.block" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="块段"  >
                            <el-input v-model="form.trade_time" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单消耗的资源"  >
                            <el-input v-model="form.resources_consumed_fees" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="from"  >
                            <el-input v-model="form.owner_address" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="to"  >
                            <el-input v-model="form.receiving_address" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="资源值"  >
                            <el-input v-model="form.value" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="交易方法值"  >
                            <el-input v-model="form.method_calling" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="区块哈希"  >
                            <el-input v-model="form.block_hash" minlength=1></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script src="./tradeOrder.js"></script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>

