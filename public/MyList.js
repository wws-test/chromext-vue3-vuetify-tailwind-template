// MyList.js

class MyList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          /* 样式 */
          ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
  
          li {
            padding: 8px;
            border-bottom: 1px solid #ccc;
          }
        </style>
        <ul>
          <slot></slot>
        </ul>
      `;
    }
  }
  
  customElements.define('my-list', MyList);
  