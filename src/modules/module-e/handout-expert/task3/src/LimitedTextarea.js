class LimitedTextarea extends HTMLElement {
  constructor() {
    super();
    this.maxchars = 500;
    this.shadow = this.attachShadow({ mode: 'closed' });
    this.shadow.innerHTML = `
        <style>
            textarea {
                width: 100%;
                height: 100px;
                resize: none;
                box-sizing: border-box;
            }

            p {
                margin-top: 3px;
                color: #666;
            }

            .charsLeft {
                color: #000;
            }

            .charsLeft.close {
                color: #f0620d;
            }

            .charsLeft.limitReached {
                color: #ea1010;
            }
        </style>

        <div>
            <textarea></textarea>
            <p><span class="charsLeft"></span> characters left</p>
        </div>
    `;

    this.shadow.querySelector('textarea').addEventListener('input', this.onChange.bind(this));
  }

  static get observedAttributes() {
    return ['maxchars'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    this[property] = newValue;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const textareaElement = this.shadow.querySelector('textarea');
    const charsLeftElement = this.shadow.querySelector('.charsLeft');
    const numCharsLeft = this.maxchars - textareaElement.value.length;

    charsLeftElement.textContent = this.maxchars - textareaElement.value.length;
    charsLeftElement.classList.remove('close', 'limitReached');

    if (numCharsLeft <= 0) {
      charsLeftElement.classList.add('limitReached');
    } else if (numCharsLeft <= this.maxchars * 0.1) {
      charsLeftElement.classList.add('close');
    }
  }

  onChange(event) {
    this.render();
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: { value: event.target.value, valid: event.target.value.length <= this.maxchars },
    }));
  }
}

customElements.define('limited-textarea', LimitedTextarea);
