const Cookie={
    setCookie(name, value, days){//设置Cookie
        let date = new Date();
        date.setDate(date.getDate() + days);
        document.cookie = name + "=" + value + ";expires=" + date;
    },
    getCookie(name){//根据name读取cookie
        let arr = document.cookie.replace(/\s/g, "").split(";");
        for (let i = 0; i < arr.length; i++) {
                let tempArr = arr[i].split("=");
                if (tempArr[0] == name) {
                    return decodeURIComponent(tempArr[1]);
                }
        }
        return "";
    },
    removeCookie(name){//根据name删除cookie
        // 设置已过期，系统会立刻删除cookie
        this.setCookie(name, '1', -1);
    }
};
export default Cookie;
