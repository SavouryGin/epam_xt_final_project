$(document).ready(onReady);

function onReady() {
    $('#loginButton').click(logIn);
    $('#registrationButton').click(register);
    $('#logoutButton').click(logOut);
}

function register() {
    $.post("/Pages/processSingIn.cshtml",
        {
            Login: $('#login').val(),
            Password: $.md5($('#password').val())
        }, function (data) {
            $('#result').html(data);
        });
}

function logIn() {
    $.post("/Pages/processLogIn.cshtml",
        {
            Login: $('#login').val(),
            Password: $.md5($('#password').val())
        }, function (data) {
            if (data == "")
                window.location.href = "/";
            else
                $('#result').html(data);
        });
}

function logOut() {
    window.location.href = "logout.cshtml";
}