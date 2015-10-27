$(function () {
    $("#directions-button").click(function () {
        $.getJSON(
            // URL
            //"http://maps.googleapis.com/maps/api/geocode",
            //"https://www.google.com/maps/embed/v1/search",
            "https://maps.googleapis.com/maps/api/directions",
            // parameters
            {
                origin: $("#origin-term").val(),
                destination: $("#destination-term").val(),
                // api_key: 
                key: "AIzaSyDdA23PKfT8jDq6v00Y-G1uT7pzRmNn9B8"
            },
            function () {
                alert("Clicked!");
            }

        ).done(function (result) {
            console.log(result);
        });
    });

});