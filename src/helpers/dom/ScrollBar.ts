let w = window;
let d = document;
var raf = w.requestAnimationFrame || w.setImmediate || function(c) { return setTimeout(c, 0); };


class Scrollbar {
  static initEl(el) {
    if (el.hasOwnProperty('data-simple-scrollbar')) return;
    Object.defineProperty(el, 'data-simple-scrollbar', new  Scrollbar(el));
  }

  // Mouse drag handler
  dragDealer(el, context) {
    var lastPageY;

    el.addEventListener('mousedown', function(e) {
      lastPageY = e.pageY;
      el.classList.add('cc-scrollbar-grabbed');
      d.body.classList.add('cc-scrollbar-grabbed');

      d.addEventListener('mousemove', drag);
      d.addEventListener('mouseup', stop);

      return false;
    });

    function drag(e) {
      var delta = e.pageY - lastPageY;
      lastPageY = e.pageY;

      raf(function() {
        context.el.scrollTop += delta / context.scrollRatio;
      });
    }

    function stop() {
      el.classList.remove('cc-scrollbar-grabbed');
      d.body.classList.remove('cc-scrollbar-grabbed');
      d.removeEventListener('mousemove', drag);
      d.removeEventListener('mouseup', stop);
    }
  }
  target;
  bar;
  wrapper;
  el;
  scrollRatio;

  // Constructor
  constructor(el) {
    this.target = el;

    this.bar = '<div class="cc-scrollbar-scroll">';

    this.wrapper = d.createElement('div');
    this.wrapper.setAttribute('class', 'cc-scrollbar-wrapper');

    this.el = d.createElement('div');
    this.el.setAttribute('class', 'cc-scrollbar-content');

    this.wrapper.appendChild(this.el);

    while (this.target.firstChild) {
      this.el.appendChild(this.target.firstChild);
    }
    this.target.appendChild(this.wrapper);

    this.target.insertAdjacentHTML('beforeend', this.bar);
    this.bar = this.target.lastChild;

    this.dragDealer(this.bar, this);
    this.moveBar(null);

    this.el.addEventListener('scroll', this.moveBar.bind(this));
    this.el.addEventListener('mouseenter', this.moveBar.bind(this));

    this.target.classList.add('cc-scrollbar-container');

    var css = window.getComputedStyle(el);
    if (css['height'] === '0px' && css['max-height'] !== '0px') {
      el.style.height = css['max-height'];
    }
  }


  moveBar(e) {
    var totalHeight = this.el.scrollHeight,
        ownHeight = this.el.clientHeight,
        _this : Scrollbar = this;

    this.scrollRatio = ownHeight / totalHeight;

    raf(function() {
      // Hide scrollbar if no scrolling is possible
      if(_this.scrollRatio >= 1) {
        _this.bar.classList.add('cc-scrollbar-hidden')
      } else {
        _this.bar.classList.remove('cc-scrollbar-hidden')
        _this.bar.style.cssText = 'height:' + (_this.scrollRatio) * 100 + '%; top:' + (_this.el.scrollTop / totalHeight ) * 100 + '%;right:-' + (_this.target.clientWidth - _this.bar.clientWidth) + 'px;';
      }
    });
  }

  static initAll() {
    (window as any).ccsdkDebug ?console.log("init scrollbar called"):'';
    var nodes = d.querySelectorAll('*[cc-scrollbar-container]');

    for (var i = 0; i < nodes.length; i++) {
      Scrollbar.initEl(nodes[i]);
    }
  }
}


d.addEventListener('DOMContentLoaded',  Scrollbar.initAll);

// (<any>w) Scrollbar = Scrollbar;


export {  Scrollbar };
