import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * ParishConnect Widget
 */
@customElement('parishconnect-widget')
export class ParishConnectWidget extends LitElement {
  render() {
    return html` <div>ParishConnect Widget</div> `
  }

  static styles = css`
    :host {
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'parishconnect-widget': ParishConnectWidget
  }
}
