$(function () {

    $("#search-button").click(function () {
        $.getJSON(
            // URL
            "http://maps.googleapis.com/maps/api/geocode",
            //"https://www.google.com/maps/embed/v1/search",
            // parameters
            {
                q: $("#search-term").val(),
                // api_key: 
                key: "AIzaSyAdvUf9o7si6d0ls4XDuFECGXHIoduhnZM"
            }

        ).done(function (result) {
            console.log(result);
        });
    });

});