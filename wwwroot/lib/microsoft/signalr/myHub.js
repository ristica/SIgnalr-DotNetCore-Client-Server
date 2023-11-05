"use strict";

// establishes connection to the hub on load
var connection = new signalR.HubConnectionBuilder().withUrl("/myHub").build();

// jquery post file to controller
document.getElementById("btnUpload")
        .addEventListener("click", function (event) {

    $("#success").hide();
    $("#error").hide();

    var data = new FormData();
    data.append("formFile", $("#uploadFile")[0].files[0]);

    $.ajax({
        type: 'post',
        url: "/home/savefileondisk",
        data: data,
        processData: false,
        contentType: false
    })
    .done(function (result) {
        if (result.status === "success") {
            $("#success").show();
            $("#error").show();

            $("#success").html("File uploaded successfully");
            $("#fileNameSpan").html(result.fileName);
            $("#fileSizeSpan").html(result.fileSize);

            try {
                connection.invoke("BroadcastMessage", result.filePath);
            } catch (err) {
                console.log(err);
            }

        } else if (result.status === "error") {
            $("#error").html("File upload failed");
            $("#fileNameSpan").html("");
            $("#fileSizeSpan").html("");
        } else {
            $("#error").html("Error !!!");
            $("#fileNameSpan").html("");
            $("#fileSizeSpan").html("");
        }
    });
        });  

// client - listening ...
connection.on(
    "ReceiveMessage", // message id 
    function (file) {
        $("#receivedFileNameSpan").html(file);
});

// client - subscribe to notifications
document.getElementById("btnConnect")
        .addEventListener("click", function (event) {

        connection.start()
            .then(function () {
                $("#connectionStatusSpan").html("Successfully connected to hub!");
            })
            .catch(function (err) {
                $("#connectionStatusSpan").html("Not connected!");
            });
       
    });  