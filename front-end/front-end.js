$(function () {
    $(document).restructure(); // JD 1211: 2
    
    $.getJSON(
        // JD: 6
        "https://slack.com/api/channels.list",
        // JD: 6
        {
            token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
        }
    ).done(function (result) {
        console.log(result);
        // JD: 7
        var channelsList = result["channels"].map(function (channel) { // JD: 8
            return channel.name;
        });

        $("#channels-displayarea").empty();

        channelsList.map(function (channel) { // JD: 8
            $("#channels-displayarea").append(
                '<br>'
                + '<label><input type="checkbox" name="channel-checkbox" value='
                + channel + '> ' + channel + '</label>'
            );
        });
    });

    var storeMessages = function (result) { //used for submit-button and refresh-button
        var chatHistoryString = "";
        result["messages"].map(function (message) { // JD: 9 //reduce as in "reduce code" right?
            // JD: 10 (Was this supposed to be JD: 11 ?)
            chatHistoryString = identifyUser(message) 
                                + ": " + message.text + "\n" + chatHistoryString;
        });
        return chatHistoryString;
    }

    var identifyUser = function (message) {
        if ("user" in message && message["user"] !== undefined) { // JD: 10
            $.getJSON(
                // JD: 6
                "https://slack.com/api/users.info",
                // JD: 6
                {
                    token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                    user: message["user"]
                }
            ).done(function (result) {
                console.log(result);
                console.log(result["user"]["name"]);
                $("#storage").html(result["user"]["name"]); // JD: 12
            });
            return $("#storage").html();
        } else {
            return "bot";
        }
    }


    $("#submit-button").click(function () {
        if ($("input[name=channel-checkbox]:checked").length === 0) { // JD: 10
            $("#settings-status-display")
                .empty() // JD: 13
                .append("* Please select channels to open *"); // JD: 14
        } else {
            $("#settings-status-display, #refresh-status, #post-status-display").empty(); // JD: 15
            $("#post-status-display").append("Refresh every so often to see new messages");

            var selectedBoxes = $("input[name=channel-checkbox]:checked").map(function () {
                return this.value;
            });

            $("#selected-channel-display, #open-channels").empty(); // JD: 13, 15
            $("html, body").animate({scrollTop: 500}, 1000);

            $.map(selectedBoxes, function (selectedBox) {
                $("#selected-channel-display").append(
                    $('<div></div>').addClass("col-sm-4").append(
                    $('<br>'),
                    $('<label></label>').html(selectedBox),
                    $('<textarea rows="10" class="form-control" name="channel-textarea"></textarea>').attr("id", 
                        selectedBox + "-channel"),
                    $('<br>')
                    )
                );
                $("#open-channels").append(
                    '<br>'
                    + '<label><input type="radio" name="open-channel-button" value='
                    + selectedBox + '> ' + selectedBox + '</label>'
                    );
                      
            });
            
            $.getJSON(
                // JD: 6
                "https://slack.com/api/channels.list",
                // JD: 6
                {
                    token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                }
            ).done(function (result) {
                // JD: 16
                console.log(result);
                var selectedChannels = $.map(result["channels"], function (channel) {
                    if ($.inArray(channel.name, selectedBoxes) > -1) {
                        return channel;
                    }
                });

                selectedChannels.forEach(function (channel) {
                    var id = "#" + channel.name + "-channel";
                    $.getJSON(
                        
                        "https://slack.com/api/channels.history",
                        
                        {
                            token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                            channel: channel["id"]
                        }
                    ).done(function (result) {
                        console.log(result) // JD: 17
                        var chatHistoryString = storeMessages(result);
                        $(id)
                            .empty()
                            .append(chatHistoryString); // JD: 14
                        $(id).scrollTop(
                            $(id).prop("scrollHeight")
                            );
                    });
                }); // JD: 18 
            });
        }
    });
    
    $("#refresh-button").click(function () {
        if ($("input[name=channel-checkbox]:checked").length === 0) { // JD: 10
            $("#refresh-status")
                .empty()
                .append("* Please submit channels to open *");
        } else if ($.trim($("#selected-channel-display").html()) === "") { // JD: 10
            $("#refresh-status")
                .empty()
                .append("* Submit first *");
        } else {
            $("#refresh-status").empty();
            $("#post-status-display")
                .empty()
                .append("Refresh every so often to see new messages");

            $("#refresh-status-temporary")
                .show() // JD: 19
                .hide();
                
            var selectedBoxes = $("input[name=channel-checkbox]:checked").map(function () {
                return this.value;
            });

            $.getJSON(
                
                "https://slack.com/api/channels.list",
                
                {
                    token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
                }
            ).done(function(result) {
                var selectedChannels = $.map(result["channels"], function (channel) {
                    if ($.inArray(channel.name, selectedBoxes) > -1) {
                        return channel;
                    }
                });

                selectedChannels.forEach(function (channel) {
                    var postId = "#" + channel.name + "-button";
                    $.getJSON(
                        
                        "https://slack.com/api/channels.history",
                        
                        {
                            token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                            channel: channel["id"]
                        }
                    ).done(function (result) {
                        console.log(result);
                        var chatHistoryString = storeMessages(result);
                        $(postId)
                            .val(chatHistoryString)
                            .scrollTop($(postId).prop("scrollHeight"));
                    });
                });
            }); 
        }
    });


    $("#post-input").keypress(function(event) {
        if (event.keyCode === 13) {
            $("#post-button").click();
        }
    });

    $("#post-button").click(function () {
        if ($("input[name=open-channel-button]:checked").length === 0) {
            $("#post-status-display")
                .empty()
                .append("* Please select an open channel to post to *");
        } else {
            $("#post-status-display")
                .empty()
                .append("Refresh every so often to see new messages");

            var selectedButtons = $("input[name=open-channel-button]:checked").map(function () {
                return this.value;
            });

            $.getJSON(
                
                "https://slack.com/api/channels.list",
                
                {
                    token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
                }
            ).done(function(result) {

                var selectedChannels = $.map(result["channels"], function (channel) {
                    if ($.inArray(channel.name, selectedButtons) > -1) {
                        return channel;
                    }
                });
            
                selectedChannels.forEach(function (channel) {
                    var postId = "#" + channel.name + "-channel";
                    $.getJSON(
                        
                        "https://slack.com/api/chat.postMessage",
                        
                        {
                            token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                            channel: channel["id"],
                            text: $("#post-input").val()
                        }
                    ).done(function (result) {
                        console.log(result);
                        $(postId)
                            .append("\n" + result["message"]["username"] + ": " + result["message"]["text"])
                            .scrollTop($(postId).prop("scrollHeight"));
                        $("#post-input").val("");
                    });
                });
            });
        }
    });

    $("#find-users").click(function () {
        $.getJSON(
            
            "https://slack.com/api/users.list",
            
            {
                token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
            }
        ).done(function (result) {
            console.log(result);
            $("#users-display").empty();
            result["members"].forEach(function (member) {
                $("#users-display").append(
                    '<br>'
                    + '<label><input type="radio" name="users-checkbox" value='
                    + member.name + '> ' + member.name + '</label>'
                );
            });
        });
    });

    $("#invite-button").click(function () {
        if ($("input[name=open-channel-button]:checked").length === 0) {
            $("#invite-status-display")
                .empty()
                .append("* Please select an open channel to invite to *");
        } else if ($.trim($("#users-display").html()) === "") {
            $("#invite-status-display")
                .empty()
                .append('* Click "Find Users" to see a list of teammates *');
        } else if ($("input[name=users-checkbox]:checked").length === 0) {
            $("#invite-status-display")
                .empty()
                .append("* Please select a teammate to invite *");
        } else {
            $("#invite-status-display").empty();
            var selectedButton = $("input[name=open-channel-button]:checked").val();
                $.getJSON(
                    
                    "https://slack.com/api/channels.list",
                    
                    {
                        token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
                    }
                ).done(function(result) {
                    var selectedChannel;

                    result["channels"].forEach(function (channel) {
                        if (channel.name === selectedButton) {
                            selectedChannel = channel;
                        }
                    });
                    var selectedUser = $("input[name=users-checkbox]:checked").val();
                    $.getJSON(
                        
                        "https://slack.com/api/users.list",
                        
                        {
                            token: "xoxp-13367929653-13369664679-13372846530-65fb442f55"
                        }
                    ).done(function (result) { // JD: 20
                        console.log(result);
                        result["members"].forEach(function (member) {
                            if (member.name === selectedUser) {
                                selectedUser = member;
                            }
                        });
                        if ($('input[name=open-channel-button]:checked').length === 0) {
                            alert("Please select an Open Channel to invite to.");
                        } else {
                            $.getJSON(
                                
                                "https://slack.com/api/channels.invite",
                                
                                {
                                    token: "xoxp-13367929653-13369664679-13372846530-65fb442f55",
                                    channel: selectedChannel["id"],
                                    user: selectedUser["id"]
                                }
                            ).done(function (result) {
                                console.log(result);
                                if (!result["ok"]) {
                                    if (result["error"] === "cant_invite_self") {
                                        $("#invite-status-display")
                                            .empty()
                                            .html("Users cannot invite themselves.");
                                    } else if (result["error"] === "already_in_channel") {
                                        $("#invite-status-display")
                                            .empty()
                                            .html("This user is already in the channel.");
                                    }
                                } else {
                                    $("#invite-display").append(
                                        $("<p></p>").html(selectedUser["name"] 
                                            + " has been invited to " + result["channel"]["name"])
                                    );
                                }
                            });
                        }
                    });
                });
        }
    });

});
