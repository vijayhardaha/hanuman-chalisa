import { data } from "./coupletsData.js";

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
