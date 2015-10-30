$(function () {

    $("#find-users").click(function () {
        $.getJSON(
            // URL
            "https://slack.com/api/users.list",
            // parameters
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
            }
        ).done(function (result) {
            console.log(result);
            $("#users-display").append(result["members"][0].name);
        });
    });

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
            $("#channels-displayarea").append(channelsList);
        });
    });

    var selectedChannel;

    var storeMessages = function (result) { //used for select-button and refresh-button
        var chatHistoryString = "";
        for (index = 0; index < result["messages"].length; index++) {
            chatHistoryString = identifyUser(result["messages"][index]) + ": " + result["messages"][index].text + "\n" + chatHistoryString;
        }
        return chatHistoryString;
    }

    var identifyUser = function (message) {
        if (message["username"] == undefined) {
            var username = "";
            $.getJSON(
                // URL
                "https://slack.com/api/users.info",
                //parameters
                {
                    token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                    user: "U0DAVKJKZ"
                }
            ).done(function (result) {
                console.log(result);
                username = result["user"].name;
            });
            return username;
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
            $("#selected-channel-display").append(selectedChannelString);
            $("#channel-input").val("");

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
                $("#posts").append(chatHistoryString);
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
            $("#posts").val(chatHistoryString);
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
            $("#posts").append( 
                "\n" + result["message"]["username"] + 
                ": " + result["message"]["text"]
                );
           $("#post-input").val("");
        });
    });

});
