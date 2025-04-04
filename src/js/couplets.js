import { data } from "./coupletsData.js";

const copyIcon =
  '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path></svg>';
const checkIcon =
  '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>';

/**
 * Shorthand for creating an HTML element.
 * @param {string} tag - The tag name of the element to create.
 * @returns {HTMLElement} - The created HTML element.
 */
const createElement = (tag) => document.createElement(tag);

/**
 * Class responsible for rendering couplets on the page.
 */
class CoupletsRenderer {
  /**
   * Initializes the renderer with the container ID.
   * @param {string} containerId - The ID of the container where couplets will be rendered.
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.lastType = null;
  }

  /**
   * Renders the couplets data into the container.
   */
  render() {
    data.forEach((section) => {
      if (section.type !== this.lastType) {
        this.container.appendChild(this.createHeading(section.type));
        this.lastType = section.type;
      }

      const card = this.createCard(section);
      this.container.appendChild(card);
    });
  }

  /**
   * Creates a heading element based on the type of the section.
   * @param {string} type - The type of the section (e.g., "chaupai" or "dohas").
   * @returns {HTMLElement} - The heading element.
   */
  createHeading(type) {
    const heading = createElement("h4");
    heading.innerHTML = type === "chaupai" ? "।। चौपाई ।।" : "।। दोहा ।।";
    return heading;
  }

  /**
   * Creates a card element for a section.
   * @param {Object} section - The section data containing text and meaning.
   * @param {string[]} section.text - The text of the couplet.
   * @param {string} [section.meaning] - The meaning of the couplet.
   * @returns {HTMLElement} - The card element.
   */
  createCard(section) {
    const card = createElement("div");
    card.className = "card";

    const copyButton = this.createCopyButton(section);
    card.appendChild(copyButton);

    const couplet = this.createCouplet(section.text);
    card.appendChild(couplet);

    if (section.meaning) {
      const meaning = this.createMeaning(section.meaning);
      card.appendChild(meaning);
    }

    return card;
  }

  /**
   * Creates a copy button for a section.
   * @param {Object} section - The section data containing text and meaning.
   * @param {string[]} section.text - The text of the couplet.
   * @param {string} [section.meaning] - The meaning of the couplet.
   * @returns {HTMLElement} - The copy button element.
   */
  createCopyButton(section) {
    const copyButton = createElement("button");
    copyButton.className = "copy-btn";
    copyButton.innerHTML = `<span class="icon">${copyIcon}</span>`;
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText([section.text.join("\n"), section.meaning].join("\n\n")).then(() => {
        copyButton.innerHTML = `<span class="icon">${checkIcon}</span>`;
        copyButton.classList.add("copied");
        setTimeout(() => {
          copyButton.innerHTML = `<span class="icon">${copyIcon}</span>`;
          copyButton.classList.remove("copied");
        }, 800);
      });
    });
    return copyButton;
  }

  /**
   * Creates a couplet element displaying the text.
   * @param {string[]} text - The text of the couplet.
   * @returns {HTMLElement} - The couplet element.
   */
  createCouplet(text) {
    const couplet = createElement("div");
    couplet.className = "couplet";
    couplet.innerHTML = text.join("<br>");
    return couplet;
  }

  /**
   * Creates a meaning element displaying the meaning of the couplet.
   * @param {string} meaningText - The meaning of the couplet.
   * @returns {HTMLElement} - The meaning element.
   */
  createMeaning(meaningText) {
    const meaning = createElement("p");
    meaning.className = "meaning";
    meaning.innerHTML = `<strong>अर्थ:</strong> ${meaningText}`;
    return meaning;
  }
}

// Render the couplets on page load
document.addEventListener("DOMContentLoaded", () => {
  const renderer = new CoupletsRenderer("dynamic-content");
  renderer.render();
});
