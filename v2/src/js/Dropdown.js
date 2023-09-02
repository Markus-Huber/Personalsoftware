function Dropdown(_config) {
  var children = _config["data"];
  var placeholder = _config["placeholder"];
  var _metaName = "";
  var m_ChangeListeners = [];
  var parent = document.createElement("div");
  var noValue = true;
  var currentValue;
  parent.classList.add("combobox");

  var isSmall = false;

  var timeOut;
  var input = document.createElement("input");
  input.addEventListener("change", function (event) {
    if(isEmpty(this.value)){
      currentValue = undefined;
    }

    if (!isEmpty(timeOut)) {
      window.clearTimeout(timeOut);
    }
    timeOut = window.setTimeout(() => {
      let item = {};
      item[self.getValue()] = Object.values(children)[self.getValue()];

      for (var i = 0; i < m_ChangeListeners.length; i++) {
        m_ChangeListeners[i](event, item);
      }
    }, 100);
  });
  if (!isEmpty(placeholder)) {
    input.placeholder = placeholder;
  }
  var options = document.createElement("div");
  options.classList.add("dropdownlist");

  for (let [key, value] of Object.entries(children)) {
    var p = document.createElement("p");
    p.innerHTML = value;
    p.id = "ID_" + key;
    options.appendChild(p);
  }

  parent.appendChild(input);

  var pick = document.createElement("span");
  pick.classList.add("dropdown-Open-Button");

  let img = document.createElement("img");
  img.src = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e";
  img.style.height = "16px";
  img.style.width = "12px";
  pick.appendChild(img);

  input.parentNode.appendChild(pick);

  parent.appendChild(options);

  // Items Container
  this.dropdownlist = input.parentElement.getElementsByClassName("dropdownlist")[0];
  // Current Item
  this.currentitem = options.children.length > 0 ? options.children[0] : null;
  if (this.currentitem != null) {
    this.currentitem.classList.add("light");
  }
  // Current Item Index
  this.currentitemindex = 0;
  // Visible Items Count
  this.visiblecount = 2;
  var self = this;
  var enableListener = false;
  var notFound = document.createElement("p");
  notFound.innerHTML = "Keine Ergebnisse";

  function toggleDropdown() {
    if (self.dropdownlist.classList.contains("combobox-open")) {
      setVisible(false);
    } else {
      setVisible(true);
      input.focus();
    }
  }

  pick.onclick = () => toggleDropdown();
  input.onclick = () => setVisible(true);
  input.onkeyup = () => setVisible(true);

  function setVisible(visible) {
    if (visible) {
      var elems = document.getElementsByClassName("dropdownlist");
      for (var i = 0; i < elems.length; i++) {
        elems[i].classList.remove("combobox-open");
      }

      pick.style.transform = "rotate(90deg)";
      self.dropdownlist.classList.add("combobox-open");
      hideOnOutsideClick(input.parentElement);
      enableListener = true;
      self.dropdownlist.scrollIntoView(false);

      self.dropdownlist.style.width = self.dropdownlist.parentElement.offsetWidth - 2;
    } else {
      self.dropdownlist.classList.remove("combobox-open");
      self.dropdownlist.classList.add("combobox-close");

      setTimeout(() => {
        self.dropdownlist.classList.remove("combobox-close");
      }, 290);
      pick.style.transform = null;
      enableListener = false;
      if (isEmpty(input.value)) {
        for (var j = 0; j < self.listitems.length; j++) {
          self.listitems[j].removeAttribute("data-attribute");
        }
      }
    }
  }

  function hideOnOutsideClick(el) {
    const outsideClickListener = event => {
      if (!el.contains(event.target) && isVisible(el)) {
        removeClickListener();
        setVisible(false);
      }
    }

    const removeClickListener = () => {
      document.removeEventListener('click', outsideClickListener)
    }
    document.addEventListener('click', outsideClickListener)
  }

  // Get Items
  this.listitems = this.dropdownlist.getElementsByTagName('p');
  for (var i = 0; i < this.listitems.length; i++) {
    // Binding Click Event
    this.listitems[i].onclick = function () {
      currentValue = this.id.replace("ID_", "");
      var upv = this.innerHTML;
      upv = upv.replace(/\<b\>/ig, '');
      upv = upv.replace(/\<\/b\>/ig, '');
      input.value = upv;

      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      input.dispatchEvent(evt);
      noValue = false;

      setVisible(false);
      for (var j = 0; j < self.listitems.length; j++) {
        self.listitems[j].removeAttribute("data-attribute");
      }

      if (!isEmpty(self._metaName)) {
        this.setAttribute("data-attribute", self._metaName);
      }
      return false;
    };
    // Binding OnMouseOver Event
    this.listitems[i].onmouseover = function (e) {
      for (var i = 0; i < self.listitems.length; i++) {
        if (this === self.listitems[i]) {
          if (self.currentitem) {
            self.currentitem.className = self.currentitem.className.replace(
              /light/g,
              ''
            );
          }
          self.currentitem = self.listitems[i];
          self.currentitemindex = i;
          self.currentitem.className += ' light';
        }
      }
    }
  }

  this.build = function () {
    if (isSmall) {
      setTimeout(() => {
        options.style.width = input.offsetWidth - 1 + "px";
      }, 100);
    }
    return parent;
  }

  this.setValue = function (key) {
    noValue = isEmpty(key);

    for (var i = 0; i < self.listitems.length; i++) {
      if (self.listitems[i].id == "ID_" + key) {
        self.listitems[i].click();
        self.currentitem = self.listitems[i];
      }
    }
    return this;
  }

  this.metaName = function (_name) {
    if (!isEmpty(_name)) {
      this._metaName = _name;
      if (!isEmpty(self.currentitem)) {
        self.currentitem.setAttribute("data-attribute", _name);
      }
    }
    return this;
  }

  this.isSmallSize = function (_isSmall) {
    if (_isSmall) {
      parent.classList.add("combobox-small");
    }
    isSmall = _isSmall;
    return this;
  }

  this.changeListener = function (changeListener) {
    if (!isEmpty(changeListener)) {
      m_ChangeListeners.push(changeListener);
    }
    return this;
  }

  this.getValue = function () {
    if(noValue){
      return null;
    }
    if (!isEmpty(currentValue)) {
      return currentValue;
    }
    return null;
  }

  this.getValueEx = function () {
    if (!isEmpty(self.getValue())) {
      let item = {};
      item[self.getValue()] = Object.values(children)[self.getValue()];
      return item;
    }
    return null;
  }

  document.addEventListener('keyup', (e) => {
    if (!enableListener) {
      return;
    }
    // Binding OnKeyDown Event
    e = e || window.event;

    // enter
    if (e.keyCode === 13) {
      let findNextMatching = () => {
        for (let counter = 0; counter < self.listitems.length; counter++) {
          if (self.listitems[counter].style.display == "block") {
            var upv = self.listitems[counter].innerHTML;
            upv = upv.replace(/\<b\>/ig, '');
            upv = upv.replace(/\<\/b\>/ig, '');
            input.value = upv;
            currentValue = self.listitems[counter].id.replace("ID_", "");
            break;
          }
        }
      }

      if (!isEmpty(self.currentitem)) {
        if (self.currentitem.style.display != "none") {
          var upv = self.currentitem.innerHTML;
          upv = upv.replace(/\<b\>/ig, '');
          upv = upv.replace(/\<\/b\>/ig, '');
          input.value = upv;
          currentValue = self.currentitem.id.replace("ID_", "");
        } else {
          findNextMatching();
        }
      } else {
        findNextMatching();
      }

      setVisible(false);
      e.cancelBubble = true;
      return false;
    } else {
      if (e.keyCode === 38) {
        // Move Selection Up
        if (self.visiblecount > 0) {
          if (self.visiblecount === 1) {
            self.currentitemindex = self.listitems.length - 1;
          }
          do {
            self.currentitemindex--;
          }
          while (self.currentitemindex > 0 && self.listitems[self.currentitemindex].style.display === 'none');
          if (self.currentitemindex < 0) {
            self.currentitemindex = self.listitems.length - 1;
          }

          if (self.currentitem) {
            self.currentitem.className = self.currentitem.className.replace(
              /light/g,
              ''
            )
          }
          self.currentitem = self.listitems[self.currentitemindex];
          self.currentitem.className += ' light';
          self.currentitem.scrollIntoView(false);
        }
        e.cancelBubble = true;
        if (navigator.appName !== 'Microsoft Internet Explorer') {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      // Move Selection Down
      else if (e.keyCode === 40) {
        // down
        if (self.visiblecount > 0) {
          if (self.currentitemindex == null) {
            self.currentitemindex = 0;
          } else {
            do {
              self.currentitemindex++;
            }
            while (self.currentitemindex < self.listitems.length && self.listitems[self.currentitemindex].style.display === 'none');
          }
          if (self.currentitemindex >= self.listitems.length) {
            self.currentitemindex = 0;
          }

          if (self.currentitem) {
            self.currentitem.className = self.currentitem.className.replace(
              /light/g,
              ''
            )
          }
          self.currentitem = self.listitems[self.currentitemindex];
          self.currentitem.className += ' light';
          self.currentitem.scrollIntoView(false);
        }
        e.cancelBubble = true;
        if (navigator.appName != 'Microsoft Internet Explorer') {
          e.preventDefault();
          e.stopPropagation();
        }
      }


      if (isEmpty(input.value)) {
        for (let counter = 0; counter < self.listitems.length; counter++) {
          self.listitems[counter].style.display = '';
          var upv = self.listitems[counter].innerHTML;
          upv = upv.replace(/\<b\>/ig, '');
          upv = upv.replace(/\<\/b\>/ig, '');
          self.listitems[counter].innerHTML = upv;
        }
        return;
      }

      setVisible(true);
      self.visiblecount = 0;
      try {
        self.dropdownlist.removeChild(notFound);
      } catch (error) {}

      if (input.value === '') {
        for (var i = 0; i < self.listitems.length; i++) {
          self.listitems[i].style.display = 'block';
          self.visiblecount++;
          var pv = self.listitems[i].innerHTML;
          pv = pv.replace(/\<b\>/ig, '');
          self.listitems[i].innerHTML = pv.replace(/\<\/b\>/ig, '');
        }
      } else {
        var re = new RegExp('(' + input.value + ')', "i");
        var atLeastOne = false;
        for (var i = 0; i < self.listitems.length; i++) {
          var pv = self.listitems[i].innerHTML;
          pv = pv.replace(/\<b\>/ig, '');
          pv = pv.replace(/\<\/b\>/ig, '');
          if (re.test(pv)) {
            self.listitems[i].style.display = 'block';
            self.visiblecount++;
            self.listitems[i].innerHTML = pv.replace(re, '<b>$1</b>');
            atLeastOne = true;
          } else {
            self.listitems[i].style.display = 'none';
          }
        }
        if (!atLeastOne) {
          self.dropdownlist.appendChild(notFound);
        }
      }
    }
  });
};