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
            for (index = 0; index < Object.keys(result["channels"]).length; index++) {
                channelsList = channelsList + "<br>" + result["channels"][index].name;
            }            
            document.getElementById("channels-displayarea").innerHTML = channelsList;
        });
    });

    var selectedChannel;

    var storeMessages = function (result) { //used for select-button and refresh-button
        var chatHistoryString = "";
        for (index = 0; index < result["messages"].length; index++) {
            chatHistoryString = identifyUser(result["messages"][index]) + ": " + result["messages"][index].text + "<br>" + chatHistoryString;
        }
        return chatHistoryString;
    }

    var identifyUser = function (message) {
        if (message["username"] == undefined) {
            $.getJSON(
                // URL
                "https://slack.com/api/users.info",
                //parameters
                {
                    token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                    user: message["user"]
                }
            ).done(function (result) {
                console.log(result);
                return result["user"]["name"];
            });
        } else {
            return message["username"];
        }
    }

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
                var chatHistoryString = storeMessages(result);
                document.getElementById("posts").innerHTML = chatHistoryString;
            });
        });
    });

    $("#refresh-button").click(function () {
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
            var chatHistoryString = storeMessages(result);
            document.getElementById("posts").innerHTML = chatHistoryString;
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
            document.getElementById("posts").innerHTML = document.getElementById("posts").innerHTML + "<br>" + result["message"]["username"] + ": " + result["message"]["text"];
            document.getElementById("post-input").value = "";
        });
    });

});
