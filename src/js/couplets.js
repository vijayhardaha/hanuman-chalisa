import { data } from "./coupletsData.js";

const copyIcon =
  '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path></svg>';
const checkIcon =
  '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>';

function renderCouplets() {
  const container = document.getElementById("dynamic-content");
  let lastType = null;

  data.forEach((section) => {
    // Create a card container
    const card = document.createElement("div");
    card.className = "card";

    // Add section heading only if the type changes
    if (section.type !== lastType) {
      const heading = document.createElement("h4");
      heading.innerHTML = section.type === "chaupai" ? "।। चौपाई ।।" : "।। दोहा ।।";
      container.appendChild(heading);
      lastType = section.type;
    }

    // Add copy button at the top-right
    const copyButton = document.createElement("button");
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
    card.appendChild(copyButton);

    // Add verses
    const couplet = document.createElement("div");
    couplet.classList = "couplet";
    couplet.innerHTML = section.text.join("<br>");

    card.appendChild(couplet);

    // Add meaning if available
    if (section.meaning) {
      const meaning = document.createElement("p");
      meaning.className = "meaning";
      meaning.innerHTML = section.meaning;
      card.appendChild(meaning);
    }

    // Append the card to the container
    container.appendChild(card);
  });
}

// Render the couplets on page load
document.addEventListener("DOMContentLoaded", renderCouplets);
