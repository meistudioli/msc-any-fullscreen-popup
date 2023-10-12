import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

/*
 reference:
 - https://developer.chrome.com/blog/fullscreen-popups-origin-trial/
 - https://developer.mozilla.org/en-US/docs/Web/API/Window/open
*/

const defaults = {
  winwidth: '',
  winheight: '',
  url: ''
};
const booleanAttrs = []; // booleanAttrs default should be false
const objectAttrs = [];
const custumEvents = {
  click: 'msc-any-fullscreen-popup-click'
};
let snackbar, popupWin;

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host{position:relative;display:block;}
.main{position:relative;inline-size:100%;outline:0 none;}

.main__slot{position:relative;inline-size:100%;display:block;}
.main__slot::slotted(*){max-inline-size:100%;}
</style>

<div class="main" ontouchstart="" tabindex="0" role="button">
  <slot class="main__slot"></slot>
</div>
`;

export class MscAnyFullscreenPopup extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: ''
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      main: this.shadowRoot.querySelector('.main')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscAnyFullscreenPopup(config)
    };

    // evts
    this._onClick = this._onClick.bind(this);
  }

  async connectedCallback() {
    const { config, error } = await _wcl.getWCConfig(this);
    const { main } = this.#nodes;

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this.#upgradeProperty(key));

    // remove script[type=application/json]
    Array.from(this.querySelectorAll('script[type="application/json"]')).forEach((script) => script.remove());

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    main.addEventListener('click', this._onClick, { signal });
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  #format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'winwidth':
        case 'winheight':
          this.#config[attrName] = _wcl.isNumeric(newValue) ? parseFloat(newValue) : defaults[attrName];
          break;

        case 'url':
          this.#config[attrName] = newValue;
          break;
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscAnyFullscreenPopup.observedAttributes.includes(attrName)) {
      return;
    }

    this.#format(attrName, oldValue, newValue);

    switch (attrName) {
      default:
        break;
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscAnyFullscreenPopup.observedAttributes
  }

  static get supportedEvents() {
    return Object.keys(custumEvents).map(
      (key) => {
        return custumEvents[key];
      }
    );
  }

  #upgradeProperty(prop) {
    let value;

    if (MscAnyFullscreenPopup.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set winwidth(value) {
    if (value) {
      this.setAttribute('winwidth', value);
    } else {
      this.removeAttribute('winwidth');
    }
  }

  get winwidth() {
    const { width } = this.getBoundingClientRect();
    return this.#config.winwidth !== 0 ? this.#config.winwidth : width;
  }

  set winheight(value) {
    if (value) {
      this.setAttribute('winheight', value);
    } else {
      this.removeAttribute('winheight');
    }
  }

  get winheight() {
    const { height } = this.getBoundingClientRect();
    return this.#config.winheight !== 0 ? this.#config.winheight : height;
  }

  set url(value) {
    if (value) {
      this.setAttribute('url', value);
    } else {
      this.removeAttribute('url');
    }
  }

  get url() {
    return this.#config.url;
  }

  #fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  #popup() {
    const { availWidth, availHeight } = window.screen;
    const url = this.url;

    let params = {
      popup: 1,
      fullscreen: 1
    };
    
    if (!url) {
      return;
    }

    if (this.winwidth || this.winheight) {
      let width = this.winwidth || 300;
      let height = this.winheight || 150;

      if (width >= availWidth) {
        width = availWidth;
      }

      if (height >= availHeight) {
        height = availHeight;
      }

      params = {
        ...params,
        left: Math.floor((availWidth - width) / 2),
        top: Math.floor((availHeight - height) / 2),
        width,
        height
      };
    } else {
      const { width, height } = _wcl.getViewportSize();

      params = {
        ...params,
        left: Math.floor((availWidth - width) / 2),
        top: Math.floor((availHeight - height) / 2),
        width,
        height
      };
    }

    const windowFeatures = Object.keys(params)
      .map(
        (key) => {
          return `${key}=${params[key]}`;
        }
      )
      .join();

    popupWin?.close();
    popupWin = window.open(url, '_blank', windowFeatures);
  }

  async popup() {
    this._onClick();
  }

  async _onClick() {
    try {
      const { state } = await window.navigator.permissions.query({ name:'window-management' });
      
      if (state === 'denied') {
        throw new Error('Please allow the Window Management permission for <msc-any-fullscreen-popup /> functionality.');
      } else if (state !== 'granted') {
        await window.getScreenDetails();
      }
    } catch(err) {
      // other browser might not support Window Management permission
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
    }

    this.#fireEvent(custumEvents.click);
    this.#popup();
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscAnyFullscreenPopup');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscAnyFullscreenPopup'), MscAnyFullscreenPopup);
}