viewers["FrameTemplateOld"] = function (item, location, titleBar) {
  var topImageDiv, leftImageDiv, rightImageDiv, bottomImageDiv, middleImageDiv, bottomDiv, topDiv;
  var top = $($.parseHTML("<div />")).addClass("section").attr("id", "Top");
  if (items[item.elements["TopLeft"].valueHolder.value]) {
    var topLeftdiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "TopLeft");
    viewers["Ui2DAnimation"](items[item.elements["TopLeft"].valueHolder.value], topLeftdiv);
  }

  if (items[item.elements["TopRight"].valueHolder.value]) {
    var topRightdiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "TopRight");
    viewers["Ui2DAnimation"](items[item.elements["TopRight"].valueHolder.value], topRightdiv);
  }

  if (items[item.elements["Top"].valueHolder.value]) {
    var capWidth = $(topLeftdiv).children().width() + $(topRightdiv).children().width();
    //if (titleBar === undefined) {
      topDiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "TopMiddle").width($(location).width() - capWidth);
    //}
    //else {
    //  topDiv = titleBar;
    //}
    topImageDiv = viewers["Ui2DAnimation"](items[item.elements["Top"].valueHolder.value], topDiv);
  }
  $(top).append(topLeftdiv).append(topDiv).append(topRightdiv);

  var bottom = $($.parseHTML("<div />")).addClass("section").attr("id", "Bottom");
  if (items[item.elements["BottomLeft"].valueHolder.value]) {
    var bottomLeftdiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "BottomLeft");
    viewers["Ui2DAnimation"](items[item.elements["BottomLeft"].valueHolder.value], bottomLeftdiv);
  }

  if (items[item.elements["BottomRight"].valueHolder.value]) {
    var bottomRightdiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "BottomRight");
    viewers["Ui2DAnimation"](items[item.elements["BottomRight"].valueHolder.value], bottomRightdiv);
  }

  if (items[item.elements["Bottom"].valueHolder.value]) {
    var capWidth = $(bottomLeftdiv).children().width() + $(bottomRightdiv).children().width();
    bottomDiv = $($.parseHTML("<div/>")).addClass("piece").attr("id", "BottomMiddle").width($(location).width() - capWidth);
    bottomImageDiv = viewers["Ui2DAnimation"](items[item.elements["Bottom"].valueHolder.value], bottomDiv);
  }
  $(bottom).append(bottomLeftdiv).append(bottomDiv).append(bottomRightdiv);

  var topBottomHeight = $(top).children().children().height() + $(bottom).children().children().height();
  var middle = $($.parseHTML("<div/>")).addClass("section").attr("id", "Middle").height($(location).height() - topBottomHeight);
  var left = $($.parseHTML("<div />")).addClass("piece").attr("id", "Left");
  if (items[item.elements["LeftTop"].valueHolder.value]) {
    var leftTopdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "LeftTop");
    viewers["Ui2DAnimation"](items[item.elements["LeftTop"].valueHolder.value], leftTopdiv);
  }

  if (items[item.elements["LeftBottom"].valueHolder.value]) {
    var leftBottomdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "LeftBottom");
    viewers["Ui2DAnimation"](items[item.elements["LeftBottom"].valueHolder.value], leftBottomdiv);
  }

  if (items[item.elements["Left"].valueHolder.value]) {
    var capHeight = $(leftTopdiv).children().height() + $(leftBottomdiv).children().height();
    leftDiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "LeftMiddle").height($(middle).height() - capHeight);
    var leftImageDiv = viewers["Ui2DAnimation"](items[item.elements["Left"].valueHolder.value], leftDiv);
  }
  $(left).append(leftTopdiv).append(leftDiv).append(leftBottomdiv);

  var right = $($.parseHTML("<div />")).addClass("piece").attr("id", "Right");
  if (items[item.elements["RightTop"].valueHolder.value]) {
    var rightTopdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "RightTop");
    viewers["Ui2DAnimation"](items[item.elements["RightTop"].valueHolder.value], rightTopdiv);
  }

  if (items[item.elements["RightBottom"].valueHolder.value]) {
    var rightBottomdiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "RightBottom");
    viewers["Ui2DAnimation"](items[item.elements["RightBottom"].valueHolder.value], rightBottomdiv);
  }

  if (items[item.elements["Right"].valueHolder.value]) {
    var capHeight = $(rightTopdiv).children().height() + $(rightBottomdiv).children().height();
    rightDiv = $($.parseHTML("<div/>")).addClass("vpiece").attr("id", "RightMiddle").height($(middle).height() - capHeight);
    var rightImageDiv = viewers["Ui2DAnimation"](items[item.elements["Right"].valueHolder.value], rightDiv);
  }
  $(right).append(rightTopdiv).append(rightDiv).append(rightBottomdiv);

  var middleEnds = ($(left).children().children().width() + $(right).children().children().width());

  var middleMiddle = $($.parseHTML("<div/>")).addClass("piece").attr("id", "MiddleMiddle")
    .width($(location).width() - middleEnds).height($(middle).height());

  if (titleBar != undefined) {
    titleBar.updateSize(middleMiddle.width(), null);
  }
  $(middleMiddle).append(titleBar);
  if (items[item.elements["Middle"].valueHolder.value]) {
    var div = $($.parseHTML("<div/>")).addClass("piece").attr("id", "MiddleMiddle")
      .width($(middleMiddle).width()).height($(middleMiddle).height());
    middleImageDiv = viewers["Ui2DAnimation"](items[item.elements["Middle"].valueHolder.value], div);
    $(middleMiddle).append(div);
  }
  $(middle).append(left).append(middleMiddle).append(right);

  $(location).append(top).append(middle).append(bottom);

  location.updateSize = function () {
    var capWidth = $(topLeftdiv).children().width() + $(topRightdiv).children().width();
    $(topDiv).width($(location).width() - capWidth);
    topImageDiv.updateSize();

    var capWidth = $(bottomLeftdiv).children().width() + $(bottomRightdiv).children().width();
    $(bottomDiv).width($(location).width() - capWidth);
    bottomImageDiv.updateSize();
    var topBottomHeight = $(top).children().children().height() + $(bottom).children().children().height();

    $(middle).height($(location).height() - topBottomHeight);
    $(middleMiddle)
      .width($(location).width() - middleEnds).height($(middle).height());
    if (middleImageDiv !== undefined) {
      middleImageDiv.updateSize();
    }

    $(left).height($(location).height() - topBottomHeight);
    var capHeight = $(leftTopdiv).children().height() + $(leftBottomdiv).children().height();
    $(leftDiv).height($(middle).height() - capHeight);
    leftImageDiv.updateSize();

    $(right).height($(location).height() - topBottomHeight);
    var capHeight = $(rightTopdiv).children().height() + $(rightBottomdiv).children().height();
    $(rightDiv).height($(middle).height() - capHeight);
    rightImageDiv.updateSize();
  }
}
