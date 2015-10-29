// $(function () {
//     $("#directions-button").click(function () {
//         $.getJSON(
//             // URL
//             "http://localhost:3000/proxy",
//             // parameters
//             {
//                 origin: $("#origin-term").val(),
//                 destination: $("#destination-term").val(),
//                 key: "AIzaSyB9JqZXr0WsP8zPvPZ-YyG3PbAzIyKa-aQ"
//             }
//         ).done(function (result) {
//             console.log(result);
//         });
//     });

// });


$(function () {    
    $("#get-channels").click(function () {
        $.getJSON(
            // URL
            "https://slack.com/api/channels.list",
            // parameters
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
            }
        ).done(function (result) {
            console.log(result);
            var channels = JSON.stringify(result);
            document.getElementById("channels-displayarea").innerHTML = channels;
        });
    });

    $("#post-button").click(function () {
        $.getJSON(
            "https://slack.com/api/chat.postMessage",
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                channel: "C0DATPCTD",
                text: $("#post-input").val()
            }
        ).done(function (result) {
            console.log(result);
        });

    });

});
