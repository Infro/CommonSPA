define(['jquery'], function ($) {
    var webapiRoutes;
    $.getJSON({
        url: 'api/getApi',
        async: false,
        success: function (data) {
            webapiRoutes = data;
        },
        error: function () {
            webapiRoutes = { saveUserSuggestion: 'api/' };
        }
    });
    return webapiRoutes;
});
