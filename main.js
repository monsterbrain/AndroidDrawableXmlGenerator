if (window.FileReader) {
  var drop;
  addEventHandler(window, "load", function () {
    var status = document.getElementById("status");
    drop = document.getElementsByClassName("dropArea");
    var list = document.getElementById("list");

    var srcSet = { default: "", pressed: "" };
    var nameSet = { default: "", pressed: "" };

    function cancel(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      return false;
    }

    $(".finalPreview").click((e) => {
      $(".finalPreview")[0].src = srcSet.pressed;
      setTimeout(() => {
        $(".finalPreview")[0].src = srcSet.default;
      }, 200);
      console.log("final click");
    });

    //   $('.dropArea').each(function (i) {
    //       var dropArea = this;
    //     addEventHandler(dropArea, 'dragover', cancel);
    //     addEventHandler(dropArea, 'dragenter', cancel);
    //     addEventHandler(dropArea, 'drop', onDrop);
    //   })

    $("#generateBtn").click(function () {
        console.log("clicked");
        let xmlDataString = '<?xml version="1.0" encoding="utf-8"?>\n';
        xmlDataString += '<selector xmlns:android="http://schemas.android.com/apk/res/android">\n';
        xmlDataString += '    <item android:state_pressed="true" android:drawable="@drawable/'+nameSet.pressed+'"/>\n';
        xmlDataString += '    <item android:drawable="@drawable/'+nameSet.default+'"/>\n';
        xmlDataString += '</selector>';
      
        var blob = new Blob([xmlDataString], { type: "text/plain;charset=utf-8" });
        saveAs(blob, $('#fileNameInput').val());
      });

    for (let i = 0; i < drop.length; i++) {
      const dropArea = drop[i];

      // Tells the browser that we *can* drop on this target
      addEventHandler(dropArea, "dragover", cancel);
      addEventHandler(dropArea, "dragenter", cancel);

      addEventHandler(dropArea, "drop", function (e) {
        e = e || window.event; // get window.event if e argument missing (in IE)
        if (e.preventDefault) {
          e.preventDefault();
        } // stops the browser from redirecting off to the image.

        var previewImg = $(e.currentTarget).find(".preview")[0];

        var dt = e.dataTransfer;
        var files = dt.files;
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var reader = new FileReader();

          //attach event handlers here...

          reader.readAsDataURL(file);
          addEventHandler(
            reader,
            "loadend",
            function (e, file) {
              var bin = this.result;
              // var newFile = document.createElement('div');
              // newFile.innerHTML = 'Loaded : ' + file.name + ' size ' + file.size + ' B';
              // list.appendChild(newFile);
              // var fileNumber = list.getElementsByTagName('div').length;
              // status.innerHTML = fileNumber < files.length ?
              //   'Loaded 100% of file ' + fileNumber + ' of ' + files.length + '...' :
              //   'Done loading. processed ' + fileNumber + ' files.';

              previewImg.file = file;
              previewImg.src = bin;

              if ($(previewImg).hasClass("default")) {
                srcSet.default = bin;
                nameSet.default = file.name.substr(0, file.name.indexOf('.'));
                $(".finalPreview")[0].src = srcSet.default;
                $('#fileNameInput').val(nameSet.default +'.xml');
              } else if ($(previewImg).hasClass("pressed")) {
                srcSet.pressed = bin;
                nameSet.pressed = file.name.substr(0, file.name.indexOf('.'));
              }
            }.bindToEventHandler(file)
          );
        }
        return false;
      });
    } // drop for loop

    Function.prototype.bindToEventHandler = function bindToEventHandler() {
      var handler = this;
      var boundParameters = Array.prototype.slice.call(arguments);
      console.log(boundParameters);
      //create closure
      return function (e) {
        e = e || window.event; // get window.event if e argument missing (in IE)
        boundParameters.unshift(e);
        handler.apply(this, boundParameters);
      };
    };
  });
} else {
  document.getElementById("status").innerHTML =
    "Your browser does not support the HTML5 FileReader.";
}

function addEventHandler(obj, evt, handler) {
  if (obj.addEventListener) {
    // W3C method
    obj.addEventListener(evt, handler, false);
  } else if (obj.attachEvent) {
    // IE method.
    obj.attachEvent("on" + evt, handler);
  } else {
    // Old school method.
    obj["on" + evt] = handler;
  }
}
