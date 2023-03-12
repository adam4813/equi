// TODO: Remove this helper when tga or dds are converted/returned by server correctly.
function fixFileExt(filename) {
  var ret = filename;
  if (filename.indexOf("tga") > 0 || filename.indexOf("dds") > 0) {
    ret = filename.replace(/(.*)\.(.*?)$/, "$1.png");
  }
  return ret;
}

// Preload image files
viewers["TextureInfo"] = function(item, location) {
  var img = $.parseHTML("<img src='img/" + fixFileExt(item.item) + "'/>");
  return img;
};

/* TODO:
|- Hotspot...not used for rendering
|- Shading...unsure what this is used for or how it affects display
|- Specular...unsure what this is used for or how it affects display
*/
viewers["Frame"] = function(item, container) {
  var img = $.parseHTML(
    "<img src='img/" +
      fixFileExt(item.elements["Texture"].valueHolder.value) +
      "'/>"
  );
  $(img)
    .one("load", function() {
      img.initialWidth = img[0].width;
      img.initialHeight = img[0].height;
      var origin = item.elements["Location"].valueHolder;
      var size = item.elements["Size"].valueHolder;
      var width = $(container).width();
      var height = $(container).height();

      // If there isn't a defined width/height we will use the frame's width/height.
      if (width == 0) {
        width = parseInt(size.elements["CX"].valueHolder.value);
      }
      if (height == 0) {
        height = parseInt(size.elements["CY"].valueHolder.value);
      }

      // Determine the scaling factor that needs to be applied to match the width/height.
      var scaleX = width / parseInt(size.elements["CX"].valueHolder.value);
      var scaleY = height / parseInt(size.elements["CY"].valueHolder.value);

      $(img).css({
        position: "absolute",
        left:
          "-" +
          parseInt(origin.elements["X"].valueHolder.value) * scaleX +
          "px",
        top:
          "-" +
          parseInt(origin.elements["Y"].valueHolder.value) * scaleY +
          "px",
        "z-index": "-1",
        "user-select": "none",
        width: img[0].width * scaleX + "px",
        height: img[0].height * scaleY + "px"
      });

      $(container)
        .append(img)
        .width(width)
        .height(height);
      this.updateSize = function() {
        var origin = item.elements["Location"].valueHolder;
        var size = item.elements["Size"].valueHolder;
        var width = $(container).width();
        var height = $(container).height();

        // If there isn't a defined width/height we will use the frame's width/height.
        if (width == 0) {
          width = parseInt(size.elements["CX"].valueHolder.value);
        }
        if (height == 0) {
          height = parseInt(size.elements["CY"].valueHolder.value);
        }

        // Determine the scaling factor that needs to be applied to match the width/height.
        var scaleX = width / parseInt(size.elements["CX"].valueHolder.value);
        var scaleY = height / parseInt(size.elements["CY"].valueHolder.value);

        $(img).css({
          left:
            "-" +
            parseInt(origin.elements["X"].valueHolder.value) * scaleX +
            "px",
          top:
            "-" +
            parseInt(origin.elements["Y"].valueHolder.value) * scaleY +
            "px",
          width: img.initialWidth * scaleX + "px",
          height: img.initialHeight * scaleY + "px"
        });
      };
    })
    .each(function() {
      if (this.complete) $(this).load();
    });
};

/* TODO:
|- Grid...unsure how it affects display, used when Grid == true
|- Vertical...unsure how it affects display, used when Grid == true
|- CellWidth...unsure how it affects display, used when Grid == true
|- CellHeight...unsure how it affects display, used when Grid == true
*/
viewers["Ui2DAnimation"] = function(item, container) {
  var currentFrame = 0;
  var run = setInterval(
    animate,
    item.elements["Frames"].valueHolder[currentFrame].elements["Duration"]
      .valueHolder.value
  );
  var div = $(document.createElement("div"))
    .attr("id", item.item)
    .css({ overflow: "hidden", position: "relative" })
    .width($(container).width())
    .height($(container).height());

  for (frame in item.elements["Frames"].valueHolder) {
    viewers["Frame"](item.elements["Frames"].valueHolder[frame], div);
  }
  div.updateSize = function() {
    div.width($(container).width()).height($(container).height());
    div.children().each(function () {
      if (this.updateSize) {
        this.updateSize();
      }
    });
  };

  $(container).append(div);

  div
    .children()
    .not(":eq(0)")
    .hide();

  function animate() {
    clearInterval(run);
    // This animation is no longer in the DOM so remove the interval.
    if (div.parents().filter("body").length == 0) {
      return;
    }
    currentFrame++;
    if (currentFrame >= item.elements["Frames"].valueHolder.length) {
      if (item.elements["Cycle"].valueHolder.value == true) {
        currentFrame = 0;
      } else {
        // Cycle is false so just loop through once.
        return;
      }
    }
    var frame = item.elements["Frames"].valueHolder[currentFrame];

    div
      .children()
      .filter("img")
      .eq(currentFrame - 1)
      .hide();
    div
      .children()
      .filter("img")
      .eq(currentFrame)
      .show();
    run = setInterval(animate, frame.elements["Duration"].valueHolder.value);
  }
  return div;
};
