import data from "../data/data.json";

const copyIcon =
  '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path></svg>';
const checkIcon =
  '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>';
const closeIcon =
  '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>';

/**
 * Shorthand for creating an HTML element.
 * @param {string} tag - The tag name of the element to create.
 * @returns {HTMLElement} - The created HTML element.
 */
const createElement = (tag) => document.createElement(tag);

/**
 * Formats the text by wrapping certain parts in strong tags.
 * This is used to highlight specific parts of the text.
 *
 * @param {string} text - The text to format.
 * @returns {string} - The formatted text with strong tags.
 */
const formatText = (text) =>
  text.replace(/(‘[^’]*’|“[^”]*”)/g, (match) => `<span class="font-semibold">${match}</span>`);

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
    const heading = createElement("h2");
    heading.innerHTML = type === "chaupai" ? "।। चौपाई ।।" : "।। दोहा ।।";
    return heading;
  }

  /**
   * Creates a card element for a section.
   * @param {Object} section - The section data containing text, meaning, and deepMeaning.
   * @param {string[]} section.text - The text of the couplet.
   * @param {string} [section.meaning] - The meaning of the couplet.
   * @param {string} [section.deepMeaning] - The deep meaning of the couplet.
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

    if (section.deepMeaning) {
      const deepMeaningButton = this.createDeepMeaningButton(section);
      card.appendChild(deepMeaningButton);
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
    copyButton.className = "btn copy-btn";
    copyButton.setAttribute("aria-label", "Copy couplet text and meaning");

    const copyHTML = `<span class="icon">${copyIcon}</span><span class="sr-only">Copy couplet text and meaning</span>`;
    const copiedHTML = `<span class="icon">${checkIcon}</span><span class="sr-only">Copied</span>`;

    copyButton.innerHTML = copyHTML;
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText([section.text.join("\n"), `अनुवाद: ${section.meaning}`].join("\n\n")).then(() => {
        copyButton.innerHTML = copiedHTML;
        copyButton.classList.add("copied");
        setTimeout(() => {
          copyButton.innerHTML = copyHTML;
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
    meaning.innerHTML = `<strong>अनुवाद:</strong> ${formatText(meaningText)}`;
    return meaning;
  }

  /**
   * Creates a "Read Deep Meaning" button for a section.
   * @param {Object} section - The section data containing text and deepMeaning.
   * @param {string[]} section.text - The text of the couplet.
   * @param {string} [section.deepMeaning] - The deep meaning of the couplet.
   * @returns {HTMLElement} - The "Read Deep Meaning" button element.
   */
  createDeepMeaningButton(section) {
    const button = createElement("button");
    button.className = "btn btn-primary btn-sm mt-2";
    button.textContent = "आध्यात्मिक अर्थ पढ़ें";
    button.addEventListener("click", () => {
      this.showModal(section.text.join("<br>"), section.deepMeaning);
    });
    return button;
  }

  /**
   * Displays a modal with the given title and content.
   * @param {string} title - The title to display in the modal header.
   * @param {string} content - The content to display in the modal body.
   */
  showModal(title, content) {
    const modal = createElement("div");
    modal.className = "modal";

    const modalDialog = createElement("div");
    modalDialog.className = "modal-dialog";

    const modalContent = createElement("div");
    modalContent.className = "modal-content";

    const modalHeader = createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `
      <h3 class="modal-title">आध्यात्मिक अर्थ</h3>
      <span class="modal-close">${closeIcon}</span>
    `;
    modalHeader.querySelector(".modal-close").addEventListener("click", () => {
      document.body.removeChild(modal);
      document.body.classList.remove("modal--open");
    });
    modalContent.appendChild(modalHeader);

    const modalBody = createElement("div");
    modalBody.className = "modal-body";
    modalBody.innerHTML =
      `<h4 class="modal-doha">${title}</h4>` +
      content
        .split("\n")
        .filter((paragraph) => paragraph.trim() !== "")
        .map((paragraph) => `<p>${formatText(paragraph)}</p>`)
        .join("");
    modalContent.appendChild(modalBody);

    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    document.body.appendChild(modal);
    document.body.classList.add("modal--open");
  }
}

// Render the couplets on page load
document.addEventListener("DOMContentLoaded", () => {
  const renderer = new CoupletsRenderer("dynamic-content");
  renderer.render();
});
