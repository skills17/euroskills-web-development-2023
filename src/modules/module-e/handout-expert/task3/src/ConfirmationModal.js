class ConfirmationModal extends HTMLElement {
  constructor() {
    super();
    this.label = 'Ok';
    this.shadow = this.attachShadow({ mode: 'closed' });
    this.shadow.innerHTML = `
        <style>
            dialog::backdrop {
                background: rgba(0, 0, 0, 0.3);
            }

            .footer {
                margin-top: 10px;
                text-align: right;
            }
        </style>

        <dialog>
            <slot></slot>
            <div class="footer">
                <form method="dialog">
                    <button></button>
                </form>
            </footer>
        </dialog>
    `;

    this.shadow.querySelector('dialog').addEventListener('close', this.onClose.bind(this));
  }

  static get observedAttributes() {
    return ['label'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    this[property] = newValue;
    this.render();
  }

  connectedCallback() {
    this.render();
    this.shadow.querySelector('dialog').showModal();
  }

  render() {
    this.shadow.querySelector('form button').textContent = this.label;
  }

  onClose() {
    this.dispatchEvent(new CustomEvent('confirm', {
      bubbles: true,
      cancelable: false,
      composed: true,
    }));
  }
}

customElements.define('confirmation-modal', ConfirmationModal);
