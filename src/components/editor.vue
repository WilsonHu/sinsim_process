<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div>
        <div ref="editor" style="text-align:left"></div>
    </div>
</template>

<script>
    import E from 'wangeditor'
    var editor;
    export default {
        name: 'editor',
        data () {
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