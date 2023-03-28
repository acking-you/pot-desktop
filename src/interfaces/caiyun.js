import { invoke } from "@tauri-apps/api/tauri";
import { get } from "../global/config";
import { searchWord } from "./dict";

export const info = {
    name: "彩云小译",
    supportLanguage: {
        "auto": "auto",
        "zh-cn": "zh",
        "en": "en",
        "ja": "ja"
    },
    needs: {
        "caiyun_token": "Token"
    }
}

export async function translate(text, from, to) {
    const { supportLanguage } = info;
    const url = "https://api.interpreter.caiyunai.com/v1/translator"
    const token = get('caiyun_token', '')
    if (token == "") {
        return '请先配置token'
    }
    if (!(to in supportLanguage) || !(from in supportLanguage)) {
        return '该接口不支持该语言'
    }
    if (text.split(' ').length == 1) {
        return await searchWord(text);
    } else {
        const body = {
            "source": [text],
            "trans_type": `${supportLanguage[from]}2${supportLanguage[to]}`,
            "request_id": "demo",
            "detect": true,
        }

        const headers = {
            "content-type": "application/json",
            "x-authorization": "token " + token,
        }

        let proxy = get('proxy', '');
        let res = await invoke('http_request', {
            url: url, options: {
                method: 'POST',
                body: JSON.stringify(body),
                headers: [
                    ["content-type", "application/json"],
                    ["x-authorization", "token " + token]
                ],
                proxy: proxy
            }
        })
        let result = JSON.parse(res);
        const { target } = result;

        return target;
    }
}