# msc-any-fullscreen-popup

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-any-fullscreen-popup) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/25667/branches/806186/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=25667&bid=806186)

Imagine the feature to open a popup window in fullscreen mode. With [window-management](https://developer.chrome.com/articles/window-management/#the-window-management-permission) support, user could directly open a popup window in fullscreen mode in just one click. Once the user has granted the permission, Developers could use [window.open](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) method to do this fullscreen popup action.（For more detail check this page -「[New origin trial for fullscreen popup windows](https://developer.chrome.com/blog/fullscreen-popups-origin-trial/)」）

&lt;msc-any-fullscreen-popup /> is a web component which wrap this feature. Developers could apply it to any element they like. 

<img alt="msc-any-fullscreen-popup" src="https://github.com/meistudioli/msc-any-fullscreen-popup/assets/10822546/6c8b8683-b8e8-443b-9a58-88785a3b0fb7">

## Basic Usage

&lt;msc-any-fullscreen-popup /> is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-any-fullscreen-popup />'s html structure and everything will be all set.


- Required Script

```html
<script
  type="module"
  src="https://your-domain/wc-msc-any-fullscreen-popup.js">        
</script>
```

- Structure

Put &lt;msc-any-fullscreen-popup /> into HTML document. It will have different functions and looks with attribute mutation.

```html
<msc-any-fullscreen-popup>
  <script type="application/json">
    {
      "winwidth": 450,
      "winheight": 300,
      "url": "https://developer.chrome.com/"
    }
  </script>

  <!-- Put any HTML element you like -->
  <button
    type="button"
    class="element-i-like-to-have-fullscreen-popup"
  >
    ...
    ...
    ...
  </button>
</msc-any-fullscreen-popup>
```

Otherwise, developers could also choose remoteconfig to fetch config for &lt;msc-any-fullscreen-popup />.

```html
<msc-any-fullscreen-popup
  remoteconfig="https://your-domain/api-path"
>
  ...
</msc-any-fullscreen-popup>
```

## JavaScript Instantiation

&lt;msc-any-fullscreen-popup /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscAnyFullscreenPopup } from 'https://your-domain/wc-msc-any-fullscreen-popup.js';

const template = document.querySelector('.my-template');

// use DOM api
const nodeA = document.createElement('msc-any-fullscreen-popup');
document.body.appendChild(nodeA);
nodeA.appendChild(template.content.cloneNode(true));
nodeA.url = 'https://developer.chrome.com/';

// new instance with Class
const nodeB = new MscAnyFullscreenPopup();
document.body.appendChild(nodeB);
nodeB.appendChild(template.content.cloneNode(true));
nodeB.winwidth = 450;
nodeB.winheight = 300;
nodeB.url = 'https://developer.chrome.com/';

// new instance with Class & default config
const config = {
  winwidth: 450,
  winheight: 300,
  url: 'https://developer.chrome.com/'
};
const nodeC = new MscAnyFullscreenPopup(config);
document.body.appendChild(nodeC);
nodeC.appendChild(template.content.cloneNode(true));
</script>
```

## Attributes

&lt;msc-any-fullscreen-popup /> supports some attributes to let it become more convenience & useful.

- **winwidth**

Set popup window width. Default is empty string.（Once winwidth & winheight not set, popup window size will be `current viewport` size.)

```html
<msc-any-fullscreen-popup winwidth="450">
  ...
</msc-any-fullscreen-popup>
```

- **winheight**

Set popup window height. Default is is empty string.（Once winwidth & winheight not set, popup window size will be `current viewport` size.)

```html
<msc-any-fullscreen-popup winheight="300">
  ...
</msc-any-fullscreen-popup>
```

- **url**

Set url addess for popup window. Default is is empty string.

```html
<msc-any-fullscreen-popup url="https://developer.chrome.com/">
  ...
</msc-any-fullscreen-popup>
```

## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| winwidth | Number | Getter / Setter for popup window width. Default is empty string.（Once winwidth & winheight not set, popup window size will be current viewport size.) |
| winheight | Number | Getter / Setter for popup window height. Default is empty string.（Once winwidth & winheight not set, popup window size will be current viewport size.) |
| url | String | Getter / Setter url addess for popup window. Default is empty string. |

## Methods

| Method Signature | Description |
| ----------- | ----------- |
| popup() | Popup window.（requires a user gesture） |

## Events

| Event Signature | Description |
| ----------- | ----------- |
| msc-any-fullscreen-popup-click | Fired when &lt;msc-any-fullscreen-popup /> clicked. |
| msc-any-fullscreen-popup-error | Fired when error occured. Developers could get message througn `event.detatil`. |

## Reference

- [New origin trial for fullscreen popup windows](https://developer.chrome.com/blog/fullscreen-popups-origin-trial/)
- [Managing several displays with the Window Management API](https://developer.chrome.com/articles/window-management/)
- [MDN > window.open](https://developer.mozilla.org/en-US/docs/Web/API/Window/open)
- [&lt;msc-any-fullscreen-popup /> demo](https://blog.lalacube.com/mei/webComponent_msc-any-fullscreen-popup.html)
- [YouTube > tutorial](https://youtu.be/Z_uee448gDQ)
