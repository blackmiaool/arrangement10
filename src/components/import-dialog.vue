
<template>
    <el-dialog title="导入" :visible.sync="dialogVisible" width="90%">
        <div style="overflow:auto;">
            <div class="input-area" contenteditable="contenteditable" ref="input" @input="onInput">

            </div>
        </div>
        <div>
            负责人:<span>{{author}}</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="importHtml">确认</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: "ImportDialog",
    data() {
        return {
            dialogVisible: false,
            html: "",
            author:'',
        };
    },
    methods: {
        onInput(e){
            let match;
            let param;
            try{
                match=this.$refs.input.innerHTML.match(/data=([\s\S]+?)"/);
                param=JSON.parse(decodeURIComponent(match[1]));
            }catch(e){
                console.log(e); 
                alert('无法解析导入的内容，请联系开发者');
            }
            if(param){
                this.author=param.config.name;
            }                        
            console.log(param);
        },
        importHtml(){
            this.dialogVisible = false;
            
        },
        show() {
            this.dialogVisible = true;
        }
    }
};
</script>
<style scoped>
table,
th,
td {
    border: 1px solid #ebeef5;
}
.input-area {
    height: 100px;
    background-color: #efefef;
}
</style>
