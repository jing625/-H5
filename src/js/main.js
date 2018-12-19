clearPhone()
judgePhone()

$('input[name=phoneNumber]').bind('input propertychange', judgePhone)

jQuery.fn.serializeObject = function () {
    var results = {},
        arr = this.serializeArray();
    for (var i = 0, len = arr.length; i < len; i++) {
        obj = arr[i];
        //Check if results have a property with given name
        if (results.hasOwnProperty(obj.name)) {
            //Check if given object is an array
            if (!results[obj.name].push) {
                results[obj.name] = [results[obj.name]];
            }
            results[obj.name].push(obj.value || '');
        } else {
            results[obj.name] = obj.value || '';
        }
    }
    return results;
}

var host = "https://api.youbidai.sealgame.cn";
$.ajaxSetup({
    headers: {
        "X-Client-Id": "173fd104d933432bae87ad8d097441ba",
    }
});

var counter

$('#getCaptchaButton').click(getCaptcha)

$('form').submit(function (e) {

    e.preventDefault();
    var data = $(this).serializeObject()


    $.post(host + "/auth/login-by-phone-number", data, function (data) {
        data.message && alert(data.message)
        if (data.code === 0) {
            setCookie('bmToken', data.data.token)
            location.href = "receive.html"
        } else {
            $('#getCaptchaButton').text('获取验证码').prop("disabled", false)
            clearInterval(counter);
        }
    });


})

function judgePhone() {
    var phoneNumber = $('input[name=phoneNumber]').val();
    if (phoneNumber){
        $('#clear').show()
    } else {
        $('#clear').hide()
    }
}

function clearPhone() {
    $('#clear').click(() => {
        $('input[name=phoneNumber]'
        ).val('')
        judgePhone()
    })
}

function setCookie(name, value) {
    document.cookie = name + "=" + escape(value)

}


function getCaptcha() {
    var phoneNumber = $('input[name=phoneNumber]').val();

    if (!phoneNumber) {

        alert('请输入手机号码');

        $(['input[name=phoneNumber]']).focus();
        return
    }


    if (!aliyunCaptchaResult) {

        alert('请先进行滑动验证')
        return
    }

    var count = 60;
    $('#getCaptchaButton').prop("disabled", true).text(count + 's')
    counter = setInterval(function () {
        count--;
        $('#getCaptchaButton').text(count + 's')

        if (count <= 0) {
            $('#getCaptchaButton').text('获取验证码').prop("disabled", false)
            clearInterval(counter);
        }
    }, 1000)


    var data = {phoneNumber: phoneNumber}
    data.aliyunCaptchaSessionId = aliyunCaptchaResult.csessionid
    data.aliyunCaptchaSig = aliyunCaptchaResult.sig
    data.aliyunCaptchaNCToken = nc_token
    data.aliyunCaptchaScene = "nc_register_h5"


    $.get(host + "/sms/baima", data, function (data) {
        data.message && alert(data.message)
        if (data.code === 0) {
            setTimeout(function () {
                nc.reset();//请务必确保这里调用一次reset()方法
                aliyunCaptchaResult = ''
            },60000)

        } else {
            $('#getCaptchaButton').text('获取验证码').prop("disabled", false)
            clearInterval(counter);
            nc.reset();//请务必确保这里调用一次reset()方法
            aliyunCaptchaResult = ''
        }

    })

}

