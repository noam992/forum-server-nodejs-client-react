import React from 'react';

export function getCookie(name :string) {

    let dc = document.cookie;
    let prefix = name + "=";
    let begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
} 


export function saveCookie(name :string, value :any) {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);

    document.cookie = `${name}=${value}; expires=` + d.toUTCString();
}


export function getCookieValue(cookieName :string) {
    // cv=my-cv.pdf; color=green; language=he
    const allCookies = document.cookie.split("; "); // ["cv=my-cv.pdf", "color=green", "language=he"]
    for(const oneCookie of allCookies) { // oneCookie = "cv=my-cv.pdf"
        const pairArr = oneCookie.split("="); // ["cv", "my-cv.pdf"]
        if(pairArr[0] === cookieName) {
            return pairArr[1];
        }
    }
    return "";
}
