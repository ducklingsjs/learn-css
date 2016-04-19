function getHTML() {
  return new Promise(function(resolve, reject) {
    var HTML = '<div>HTML</div>';
    $('.js-task').each(function() {
      var $this = $(this);
      
      HTML += '<h2>' + $this.text() + '</h2>';
      HTML += '<pre><code class="html">';
      HTML += $('#' + $this.data('task'))
                .html()
                .replace('<!-- ################# YOUR HTML STARTS HERE ################# -->', '')
                .replace('<!-- ################# YOUR HTML ENDS HERE ################# -->', '')
                .split('\n').map(function(line) {
                  return line.slice(6);
                }).filter(function(line) {
                  return line.length;
                }).join('\n');;
      HTML += '</pre></code>';
    });
    
    resolve(HTML);
  });
}

function getSASS() {
  return new Promise(function(resolve, reject) {
    var SASS = '<div>SASS</div>';
    SASS += '<pre><code class="scss">';
    
    $.get('style.scss').then(function(data) {
      SASS += data;
      SASS += '</pre></code>';
      resolve(SASS);
    });
  });
}

function getCSS() {
  return new Promise(function(resolve, reject) {
    var CSS = '<div>CSS</div>';
    CSS += '<pre><code class="css">';
    
    $.get('style.css').then(function(data) {
      CSS += data;
      CSS += '</pre></code>';
      resolve(CSS);
    });
  });
}

function populateSidebar() {
  var $content = $('.js-sidebar-content');
  
  Promise.all([
    getHTML(),
    getSASS(),
    getCSS()
  ]).then(function([HTML, SASS, CSS]) {
    $content.html(HTML + SASS + CSS);
    
    $('pre code').each(function(i, block) {
      var $this = $(this);
      $this.html($('<div></div>').text($this.html()));
      hljs.highlightBlock(block);
    });
  });
}

$(function() {
  var $sidebar = $('.js-sidebar');
  
  if ($sidebar.length) {
    populateSidebar();
    
    $('.js-sidebar-hook').on('click', function() {
      $sidebar.toggleClass('__open');
      
      if ($sidebar.hasClass('__open')) {
        populateSidebar();
      }
    });
  }
});
