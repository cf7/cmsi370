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
            //console.log(result);
            var channelsList = "";
            for (index = 0; index < Object.keys(result["channels"]).length; index++) {
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
            //console.log(result);
            var selectedChannelString = $("#channel-input").val();
            for (index = 0; index < Object.keys(result["channels"]).length; index++) {
                if (result["channels"][index].name == selectedChannelString) {
                    selectedChannel = result["channels"][index];
                }
            }
            document.getElementById("selected-channel-display").innerHTML = selectedChannelString;
            document.getElementById("channel-input").value = "";

            $.getJSON(
                // URL
                "https://slack.com/api/channels.history",
                // parameters
                {
                    token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                    channel: selectedChannel["id"]
                }
            ).done(function (result) {
                console.log(result);
                var chatHistoryString = "";
                for (index = 0; index < Object.keys(result["messages"]).length; index++) {
                    chatHistoryString = chatHistoryString + "<br>" + result["messages"][index].username + ": " + result["messages"][index].text;
                }
                document.getElementById("posts").innerHTML = chatHistoryString;
            });
        });
    });

    $("#refresh-button").click(function () {
        $.getJSON(
            // URL
            "https://slack.com/api/channels.list",
            // parameters
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
            }
        ).done(function (result) { 
            console.log(result);
        });
    });

    $("#post-button").click(function () {
        $.getJSON(
            // URL
            "https://slack.com/api/chat.postMessage",
            //parameters
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                channel: selectedChannel["id"],
                text: $("#post-input").val()
            }
        ).done(function (result) {
            console.log(result);
            document.getElementById("posts").innerHTML = document.getElementById("posts").innerHTML + "<br>" + result["message"]["text"];
            document.getElementById("post-input").value = "";
        });
    });

});
