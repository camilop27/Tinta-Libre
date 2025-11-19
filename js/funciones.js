function formatoCOP(valor) {
  const numero = parseFloat(valor);
  if (isNaN(numero)) return valor;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(numero);
}

function escapeHtml(text) {
  if (!text && text !== 0) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function inicializarFormularioArte() {
  const form = document.getElementById("formPublicarArte");
  if (!form) return;

  const inputFile = document.getElementById("imagenArte");
  const preview = document.getElementById("previewArte");

  inputFile.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) {
      preview.style.display = "none";
      preview.src = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const titulo = document.getElementById("tituloArte").value.trim();
    const descripcion = document.getElementById("descripcionArte").value.trim();
    const file = inputFile.files[0];

    if (!file) {
      alert("Por favor selecciona una imagen.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (ev) {
      const nuevaObra = {
        titulo: titulo,
        descripcion: descripcion,
        imagen: ev.target.result
      };

      const obras = JSON.parse(localStorage.getItem("tinta_galeria")) || [];
      obras.push(nuevaObra);
      localStorage.setItem("tinta_galeria", JSON.stringify(obras));

      alert("Obra publicada correctamente.");
      window.location.href = "index.html#galeria";
    };
    reader.readAsDataURL(file);
  });
}
function inicializarFormularioProducto() {
  const form = document.getElementById("formPublicarProducto");
  if (!form) return;

  const inputFile = document.getElementById("imagenProducto");
  const preview = document.getElementById("previewProducto");

  inputFile.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) {
      preview.style.display = "none";
      preview.src = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombreProducto").value.trim();
    const descripcion = document.getElementById("descripcionProducto").value.trim();
    const precio = document.getElementById("precioProducto").value.trim();
    const file = inputFile.files[0];

    if (!file) {
      alert("Por favor selecciona una imagen del producto.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (ev) {
      const nuevoProducto = {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        imagen: ev.target.result
      };

      const productos = JSON.parse(localStorage.getItem("tinta_productos")) || [];
      productos.push(nuevoProducto);
      localStorage.setItem("tinta_productos", JSON.stringify(productos));

      alert("Producto publicado correctamente.");
      window.location.href = "index.html#tienda";
    };
    reader.readAsDataURL(file);
  });
}
function eliminarPublicacion(tipo, index) {
  if (!confirm("Seguro que deseas eliminar esta publicacion?")) return;

  if (tipo === "producto") {
    const productos = JSON.parse(localStorage.getItem("tinta_productos")) || [];
    productos.splice(index, 1);
    localStorage.setItem("tinta_productos", JSON.stringify(productos));
    renderizarProductos();
  }

  if (tipo === "galeria") {
    const obras = JSON.parse(localStorage.getItem("tinta_galeria")) || [];
    obras.splice(index, 1);
    localStorage.setItem("tinta_galeria", JSON.stringify(obras));
    renderizarGaleria();
  }
}
function inicializarMenus() {
  document.querySelectorAll(".icono-menu").forEach(function (btn) {
    btn.onclick = function (e) {
      e.stopPropagation();
      this.parentElement.classList.toggle("active");
    };
  });

  document.querySelectorAll(".opcion.eliminar").forEach(function (btn) {
    btn.onclick = function () {
      eliminarPublicacion(this.dataset.tipo, this.dataset.index);
    };
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".menu-opciones")) {
      document.querySelectorAll(".menu-opciones").forEach(function (m) {
        m.classList.remove("active");
      });
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const btnHamburguesa = document.getElementById("hamburguesa");
  const menu = document.getElementById("menu");

  if (btnHamburguesa && menu) {
    btnHamburguesa.addEventListener("click", function () {
      menu.classList.toggle("activo");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("activo");
      });
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  renderizarProductos();
  renderizarGaleria();
  inicializarFormularioArte();
  inicializarFormularioProducto();
});

function inicializarComentarios() {
  const params = new URLSearchParams(window.location.search);
  const tipo = params.get("tipo");
  const id = params.get("id");

  if (!tipo || !id) return;

  const clave = `comentarios_${tipo}_${id}`;
  const listaComentarios = document.getElementById("listaComentarios");
  const form = document.getElementById("formComentario");
  const textarea = document.getElementById("comentarioTexto");

  if (!listaComentarios || !form) return;

  function cargarComentarios() {
    listaComentarios.innerHTML = "";
    const comentarios = JSON.parse(localStorage.getItem(clave)) || [];

    comentarios.forEach(texto => {
      const div = document.createElement("div");
      div.className = "comentario";
      div.innerHTML = `<p>${texto}</p>`;
      listaComentarios.appendChild(div);
    });
  }

  cargarComentarios();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const texto = textarea.value.trim();
    if (texto === "") return;

    const comentarios = JSON.parse(localStorage.getItem(clave)) || [];
    comentarios.push(texto);

    localStorage.setItem(clave, JSON.stringify(comentarios));

    textarea.value = "";
    cargarComentarios();
  });
}

document.addEventListener("DOMContentLoaded", inicializarComentarios);
