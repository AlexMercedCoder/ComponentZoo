class ColorTitle extends StyledWrapper {
    style(props) {
        return `::slotted(h1) {color: ${props.colors};}`;
    }
}

window.customElements.define('color-title', ColorTitle);
