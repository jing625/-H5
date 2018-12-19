var host = "https://api.youbidai.sealgame.cn"
var bmToken = getCookie('bmToken')
// if (!bmToken) {
//     location.href = "index.html"
// }


$.ajaxSetup({
    headers: {
        "X-Client-Id": "173fd104d933432bae87ad8d097441ba",
        "authorization": "Bearer" + " " + bmToken,
    }
})

$('#getHorse').click(() => {

    $.post(host + "/user/mark-baima", null, function (data) {

        if (data.code === 0) {
            location.href = "success.html"
        }
        else if (data.code === 10002 || data.code === 10001 || data.code === 10000) {
            alert(data.message)
            location.href = "index.html"
        }
        else {
            alert(data.message)
        }

    })
})


function getCookie(name) {

    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }


    else {
        return null;
    }


}

function isGrey() {
    $('#getHorse').addClass('grey').prop('disabled',true).text('已领取')
}
