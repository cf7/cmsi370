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
            var channelsList = "";
            for(index = 0; index < Object.keys(result["channels"]).length; index++) {
                channelsList = channelsList + "<br>" + result["channels"][index].name;
            }            
            document.getElementById("channels-displayarea").innerHTML = channelsList;
        });
    });

    var selectedChannel;

    $("#select-button").click(function () {
        $.getJSON(
            // URL
            "https://slack.com/api/channels.list",
            // parameters
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
            }
        ).done(function (result) {
            console.log(result);
            selectedChannel = $("#channel-input").val();
            document.getElementById("selected-channel-display").innerHTML = selectedChannel;
        });
    });

    $("#post-button").click(function () {
        $.getJSON(
            // URL
            "https://slack.com/api/chat.postMessage",
            //parameters
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                channel: "C0DATPCTD",
                text: $("#post-input").val()
            }
        ).done(function (result) {
            console.log(result);
            var posts = JSON.stringify(result);
            document.getElementById("posts").innerHTML = posts + document.getElementById("posts").innerHTML;
            document.getElementById("post-input").value = "";
        });
    });

});
