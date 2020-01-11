
$(function() {

  var index = $('#index');
  var search = index.find('.search');
  var empty = index.find('.empty');
  var currentLine = null;

  search.focus();

  search.keyup(function() {

    var q = $(this).val();
    index.find('ul li').each(function() {

      var current = $(this);
      var contents = current.text();
      if (contents.toLowerCase().indexOf(q.toLowerCase()) >= 0) {
        current.css('display', 'block');
      } else {
        current.css('display', 'none');
      }
    });

    if (currentLine && !currentLine.is(':visible')) {
      currentLine.removeClass('active');
      currentLine = null;
    }
    empty.css('display', index.find('ul li:visible').length ? 'none' : 'block');
  });

  search.keydown(function(e) {

    if (e.keyCode == 40) {
      if (!currentLine) {
        currentLine = index.find('ul li:visible').first().addClass('active');
      } else {
        var nextLine = currentLine.next('li:visible');
        if (nextLine.length) {
          currentLine.removeClass('active');
          currentLine = nextLine.addClass('active');
        } else {
          currentLine.removeClass('active');
          currentLine = index.find('ul li:visible').first().addClass('active');
        }
      }
      return false;
    } else if (e.keyCode == 38) {
      if (!currentLine) {
        currentLine = index.find('ul li:visible').last().addClass('active');
      } else {
        var previousLine = currentLine.prev('li:visible');
        if (previousLine.length) {
          currentLine.removeClass('active');
          currentLine = previousLine.addClass('active');
        } else {
          currentLine.removeClass('active');
          currentLine = index.find('ul li:visible').last().addClass('active');
        }
      }
      return false;
    } else if (e.keyCode == 27 && currentLine) {
      currentLine.removeClass('active');
      currentLine = null;
      return false;
    } else if (e.keyCode == 13 && currentLine) {
      window.location = currentLine.find('a').attr('href');
      return false;
    }
  });
});
