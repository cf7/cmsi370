$(function () {

    $.getJSON(
        // URL
        "https://slack.com/api/channels.list",
        // parameters
        {
            token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
        }
    ).done(function (result) {
        console.log(result);
        var channelsList = new Array(result["channels"].length);
        for (index = 0; index < result["channels"].length; index++) {
            channelsList[index] = result["channels"][index].name;
        }
        $("#channels-displayarea").html(""); // .val("") wasn't working for some reason
        for (index = 0; index < channelsList.length; index++) {
            $("#channels-displayarea").append(
                '<br>'
                + '<input type="checkbox" name="channel-checkbox" value='
                + channelsList[index] + '> ' + channelsList[index]
                );
        }
    });

    var storeMessages = function (result) { //used for submit-button and refresh-button
        var chatHistoryString = "";
        for (index = 0; index < result["messages"].length; index++) {
            chatHistoryString = identifyUser(result["messages"][index]) + ": " + result["messages"][index].text + "\n" + chatHistoryString;
        }
        return chatHistoryString;
    }

    var identifyUser = function (message) {
        if (message["user"] != undefined) {
            return $.getJSON(
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
            return "bot";
        }
    }


    $("#submit-button").click(function () {
        var selectedBoxes = $("input[name=channel-checkbox]:checked").map(function () {
            return this.value;
        });
        //document.write(selectedBoxes);
        for (index = 0; index < selectedBoxes.length; index++) {
            $("#selected-channel-display").append(
                $('<div></div>').addClass("col-sm-4").append(
                $('<br>'),
                $('<label></label>').html(selectedBoxes[index]),
                $('<textarea rows="10" class="form-control"></textarea>').attr("id", selectedBoxes[index] + "-channel"),
                $('<button class="btn btn-default"></button>').attr("id", selectedBoxes[index] + "-refresh").html("Refresh"),
                $('<br>'),
                $('<br>'),
                $('<label></label>').html("Type your message here"),
                $('<input type="text" class="form-control">').attr("id", selectedBoxes[index] + "-input"),
                $('<button class="btn btn-default"></button>').attr("id", selectedBoxes[index] + "-button").html("Post Message")
                )
            );  
        }
        
        $.getJSON(
            // URL
            "https://slack.com/api/channels.list",
            // parameters
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
            }
        ).done(function (result) {
            console.log(result);
            var selectedChannels = new Array(selectedBoxes.length);
            var scIndex = 0;

            for (index = 0; index < result["channels"].length; index++) {
                if ($.inArray(result["channels"][index].name, selectedBoxes) > -1) {
                    selectedChannels[scIndex] = result["channels"][index];
                    scIndex++;
                }
            }
            for (index = 0; index < selectedChannels.length; index++) {
                console.log("outside " + index);
                (function (i) {
                var id = "#" + selectedChannels[i].name + "-channel";
                $.getJSON(
                    // URL
                    "https://slack.com/api/channels.history",
                    // parameters
                    {
                        token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                        channel: selectedChannels[i]["id"]
                    }
                ).done(function (result) {
                        console.log("inside " + index);
                        console.log("inside i " + i);
                        console.log(selectedChannels[i].name);
                        var chatHistoryString = storeMessages(result);
                        $(id).html("");
                        $(id).append(chatHistoryString);
                        $(id).scrollTop(
                            $(id).prop("scrollHeight")
                            );
                    });
            })(index);
            }
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
            $("#posts").scrollTop($("#posts").prop("scrollHeight"));
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
           $("#posts").scrollTop($("#posts").prop("scrollHeight"));
        });
    });

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
            $("#users-display").html("");
            $("#users-display").append(result["members"][0].name);
        });
    });

});
