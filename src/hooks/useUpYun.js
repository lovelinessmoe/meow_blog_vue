import request from "@/utils/request";
import {useStore} from "vuex";

export default function () {
    function upLoadUpImg(file, uri) {
        let formData = new FormData();
        //所有字段都append进去
        formData.append('uri', uri);
        formData.append('file', file);
        return request({
            url: 'upYun/uploadFile',
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: formData
        })
    }

    const store = useStore(); // 使用useStore方法

    async function uploadAvatarImg(file) {
        let email = store.state.user.email
        let uri = "/userImg/avatar_" + email + ".png";
        return upLoadUpImg(file, uri);
    }

    async function uploadArticleImg(file, article_id) {
        let uri = "/articleImg/article_" + article_id + ".png";
        return upLoadUpImg(file, uri);
    }

    return {uploadAvatarImg, uploadArticleImg}
}

