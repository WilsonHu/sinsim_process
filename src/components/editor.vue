<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div>
        <div ref="editor" style="text-align:left"></div>
    </div>
</template>

<script>
    import E from 'wangeditor'
    var editor;
    var _this;

    export default {
        name: 'editor',
        data () {
            _this = this;
            return {

            }
        },
        props: ["editorContent","disabled"],
        methods: {
            getContent: function () {
                alert(this.editorContent)
            }
        },
        mounted() {
            editor = new E(this.$refs.editor)
            editor.customConfig.onchange = (html) => {
                this.editorContent = html;
                this.$emit('editorChanged', html);
            }
            editor.create();
            editor.txt.clear();
            //加轮训检查是为了mount时候，父组件传递给子组件的属性（editable）还没有定义，
            // 所以异步等待，获取到值以后渲染UI
            if(isUndefined(_this.editorContent) || _this.editorContent == null ) {
                let count = 0;
                let intrValID = window.setInterval(()=>{
                    if(!isUndefined(_this.editorContent)) {
                        editor.txt.html(_this.editorContent);
                        window.clearInterval(intrValID);
                    } else {
                        ++count;
                        //最多等待10秒，10秒后取消等待
                        if(count > 1000) {
                            window.clearInterval(intrValID);
                        }
                    }
                    console.log("interVal:" + count);
                },10);
            } else {
                editor.txt.html(_this.editorContent);
            }
        },
        watch: {
            // 如果 `question` 发生改变，这个函数就会运行
            editorContent: function (newQuestion, oldQuestion) {
                if(editor.txt != null || !isUndefined(editor.txt)) {
                    editor.txt.html(this.editorContent);
                }
            },
            disabled:function () {
                if(this.disabled) {
                    editor.$textElem.attr('contenteditable', false)
                }else {
                    editor.$textElem.attr('contenteditable', true)
                }
            }
        },
    }
</script>

<style scoped>
</style>