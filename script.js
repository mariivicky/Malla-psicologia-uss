document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("malla-container");
  const resetBtn = document.getElementById("reset");
  const completados = JSON.parse(localStorage.getItem("completados")) || [];

  function crearRamo(ramo, prereqs = []) {
    const div = document.createElement("div");
    div.className = "ramo";
    div.textContent = ramo;
    div.dataset.nombre = ramo;
    div.dataset.prereqs = JSON.stringify(prereqs);

    if (completados.includes(ramo)) {
      div.classList.add("completed");
    }

    if (!prereqs.every(r => completados.includes(r)) && !completados.includes(ramo)) {
      div.classList.add("locked");
    }

    div.addEventListener("click", () => {
      if (!div.classList.contains("locked") && !div.classList.contains("completed")) {
        div.classList.add("completed");
        completados.push(ramo);
        localStorage.setItem("completados", JSON.stringify(completados));
        actualizarRamos();
      }
    });

    return div;
  }

  function actualizarRamos() {
    container.innerHTML = "";
    malla.forEach(({ semestre, ramos }) => {
      const box = document.createElement("div");
      box.className = "semestre";
      const titulo = document.createElement("h2");
      titulo.textContent = `Semestre ${semestre}`;
      box.appendChild(titulo);

      ramos.forEach(ramo => {
        if (typeof ramo === "string") {
          box.appendChild(crearRamo(ramo));
        } else {
          box.appendChild(crearRamo(ramo.nombre, ramo.prereqs));
        }
      });

      container.appendChild(box);
    });
  }

  resetBtn.addEventListener("click", () => {
    if (confirm("¿Seguro que quieres reiniciar la malla?")) {
      localStorage.removeItem("completados");
      location.reload();
    }
  });

  actualizarRamos();
});

