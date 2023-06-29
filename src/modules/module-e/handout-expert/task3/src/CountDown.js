class CountDown extends HTMLElement {
  constructor() {
    super();
    this.date = '';
    this.message = '';
    this.shadow = this.attachShadow({ mode: 'closed' });
    this.shadow.innerHTML = `
        <p class="countdown"></p>
    `;
  }

  static get observedAttributes() {
    return ['date', 'message'];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    this[property] = newValue;
    this.render();
  }

  connectedCallback() {
    this.render();
    this.interval = setInterval(this.render.bind(this), 1000);
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }

  getRemainingTime(a, b) {
    let diff = Math.abs(a.getTime() - b.getTime()) / 1000;

    const days = Math.floor(diff / (24 * 60 * 60));
    diff -= days * 24 * 60 * 60;

    const hours = Math.floor(diff / (60 * 60));
    diff -= hours * 60 * 60;

    const minutes = Math.floor(diff / 60);
    diff -= minutes * 60;

    const seconds = Math.floor(diff);

    return `${days} days ${`${hours}`.padStart(2, '0')}:${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')} left`;
  }

  render() {
    const target = new Date(this.date);
    const now = new Date();
    const countdownElement = this.shadow.querySelector('.countdown');

    if (target.getTime() <= now.getTime()) {
      countdownElement.textContent = this.message;
    } else {
      countdownElement.textContent = this.getRemainingTime(target, now);
    }
  }
}

customElements.define('count-down', CountDown);
