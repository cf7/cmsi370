$(function () {

    $.getJSON(
        // URL
        "https://slack.com/api/channels.list",
        // parameters
        {
            token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
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

        $("#selected-channel-display").html("");

        for (index = 0; index < selectedBoxes.length; index++) {
            $("#selected-channel-display").append(
                $('<div></div>').addClass("col-sm-4").append(
                $('<br>'),
                $('<label></label>').html(selectedBoxes[index]),
                $('<textarea rows="10" class="form-control" name="channel-textarea"></textarea>').attr("id", selectedBoxes[index] + "-channel"),
                $('<br>')
                )
            );
            $("#open-channels").append(
                '<br>'
                + '<input type="radio" name="open-channel-button" value='
                + selectedBoxes[index] + '> ' + selectedBoxes[index]
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
        var selectedBoxes = $("input[name=channel-checkbox]:checked").map(function () {
            return this.value;
        });

        $.getJSON(
             // URL
            "https://slack.com/api/channels.list",
            // parameters
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
            }
        ).done(function(result) {
            var selectedChannels = new Array(selectedBoxes.length);
            var scIndex = 0;

            for (index = 0; index < result["channels"].length; index++) {
                if ($.inArray(result["channels"][index].name, selectedBoxes) > -1) {
                    selectedChannels[scIndex] = result["channels"][index];
                    scIndex++;
                }
            }

            for (index = 0; index < selectedChannels.length; index++) {
                (function (i) {
                    var postId = "#" + selectedChannels[i].name + "-button";
                    $.getJSON(
                        // URL
                        "https://slack.com/api/channels.history",
                        // parameters
                        {
                            token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                            channel: selectedChannels[i]["id"]
                        }
                    ).done(function (result) {
                        console.log(result);
                        var chatHistoryString = storeMessages(result);
                        $(postId).val(chatHistoryString);
                        $(postId).scrollTop($(postId).prop("scrollHeight"));
                    });
                })(index);
            }
        }); 
    });


    // var selectedBoxes = $("input[name=channel-checkbox]:checked").map(function () {
    //         return this.value;
    // });

    // var selectedChannels = new Array(selectedBoxes.length);
    // var scIndex = 0;

    // for (index = 0; index < result["channels"].length; index++) {
    //     if ($.inArray(result["channels"][index].name, selectedBoxes) > -1) {
    //         selectedChannels[scIndex] = result["channels"][index];
    //         scIndex++;
    //     }
    // }

    $("#post-button").click(function () {
        var selectedButtons = $("input[name=open-channel-button]:checked").map(function () {
            return this.value;
        });

        $.getJSON(
             // URL
            "https://slack.com/api/channels.list",
            // parameters
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
            }
            ).done(function(result) {
                var selectedChannels = new Array(selectedButtons.length);
                var scIndex = 0;

                for (index = 0; index < result["channels"].length; index++) {
                    if ($.inArray(result["channels"][index].name, selectedButtons) > -1) {
                        selectedChannels[scIndex] = result["channels"][index];
                        scIndex++;
                    }
                }

                for (index = 0; index < selectedChannels.length; index++) {
                    (function (i) {
                        var postId = "#" + selectedChannels[i].name + "-channel";
                        $.getJSON(
                            // URL
                            "https://slack.com/api/chat.postMessage",
                            //parameters
                            {
                                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                                channel: selectedChannels[i]["id"],
                                text: $("#post-input").val()
                            }
                        ).done(function (result) {
                            console.log(result);
                            $(postId).append( 
                                "\n" + result["message"]["username"] + 
                                ": " + result["message"]["text"]
                                );
                           $("#post-input").val("");
                           $(postId).scrollTop($(postId).prop("scrollHeight"));
                        });
                    })(index);
                }
            });
    });
    
    $("#find-users").click(function () {
        $.getJSON(
            // URL
            "https://slack.com/api/users.list",
            // parameters
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
            }
        ).done(function (result) {
            console.log(result);
            for (index = 0; index < result["members"].length; index++) {
                $("#users-display").html("");
                $("#users-display").append(
                    '<br>'
                    + '<input type="radio" name="users-checkbox" value='
                    + result["members"][index].name + '> ' + result["members"][index].name
                );
            }
        });
    });

    // $('input[name=users-checkbox]:checked').map( function () {
    //     return this.value();
    // });
    
    $("#invite-button").click(function () {
        var selectedButton = $("input[name=open-channel-button]:checked").val();
        $.getJSON(
             // URL
            "https://slack.com/api/channels.list",
            // parameters
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
            }
        ).done(function(result) {
            var selectedChannel;

            for (index = 0; index < result["channels"].length; index++) {
                if (result["channels"][index].name == selectedButton) {
                    selectedChannel = result["channels"][index];
                }
            }
            var selectedUser = $("input[name=users-checkbox]:checked").val();
            $.getJSON(
                // URL
                "https://slack.com/api/users.list",
                // parameters
                {
                    token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
                }
            ).done(function (result) {
                console.log(result);
                for (index = 0; index < result["members"].length; index++) {
                    if (result["members"][index].name == selectedUser) {
                        selectedUser = result["members"][index];
                    }
                }
                if ($('input[name=open-channel-button]:checked').length == 0) {
                    alert("Please select an Open Channel to invite to.");
                } else {
                    $.getJSON(
                        // URL
                        "https://slack.com/api/channels.invite",
                        // parameters
                        {
                            token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                            channel: selectedChannel["id"],
                            user: selectedUser["id"]
                        }
                    ).done(function (result) {
                        console.log(result);
                        if (!result["ok"]) {
                            if (result["error"] == "cant_invite_self") {
                                alert("Users cannot invite themselves to a channel.");
                            } else if (result["error"] == "already_in_channel") {
                                alert("This user is already in the channel.");
                            }
                        } else {
                            $("#invite-display").append(
                                $("<p></p>").html(selectedUser["name"] + " has been invited to " + result["channel"]["name"])
                            );
                        }
                    });
                }
            });
        });
    });

});
