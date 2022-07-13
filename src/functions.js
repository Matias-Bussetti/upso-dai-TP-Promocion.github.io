//TODO: COMENTAR CODIGO TYPO

//+ INICIO makeRequest

function postRequest(phpFileName) {
  var init = {
    method: "POST",
  };

  var body = new FormData(form);
  init.body = body;

  var phpServerUrl = "./server/code/" + phpFileName;

  return new Request(phpServerUrl, init);
}

function fetchPostRequest(phpFileName, validateInputs, callback) {
  fetch(postRequest(phpFileName))
    .then((rta) => rta.json())
    .then((rta) => handleResponse(rta, validateInputs, callback))
    .catch(handleError);
}

function handleResponse(rta, validateInputs, callback) {
  if (rta.result) {
    validateInputs.forEach((input) => {
      inputValid(input);
    });

    callback(rta);
  } else {
    //Mostart Errores
    showErrors(rta.errors, ...validateInputs);
  }
}
//TODO: MOSTRAR UN MENSAJE SI SALIO UN ERROR BOOTSTAP TOAST
function handleError(err) {
  console.error(err);
}
//+ FIN makeRequest

//+ FUNCIONALIDADES

//+ INICIO INPUTS
function showErrors(errors, ...inputs) {
  inputs.forEach((input) => {
    if (errors.hasOwnProperty(input.name)) {
      //Si existe el atributo con el nombre del input
      inputInvalid(input);
      input.nextElementSibling.innerText = errors[input.name];
    } else {
      //No existe el atributo con el nombre del input
      inputValid(input);
      input.nextElementSibling.innerText = "";
    }
  });
}

function inputValid(input) {
  input.classList.add("is-valid");
  input.classList.remove("is-invalid");
}

function inputInvalid(input) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
}
//+ FIN INPUTS

/**
 * Agrega o elimina al elemento pasado como parámetro el atributo "disabled", dependiendo del valor del segundo parámetro
 *
 * @param {HTMLElement} element - Elemento HTML
 * @param  {boolean} disableValue - Valor de la condición
 *
 * @example <caption>Ejemplo de como usar el Metodo:</caption>
 * // El atributo "disabled" se:
 * elementDisableAttributeValue(element, true); // Agrega - Elemento deshabilitado
 * elementDisableAttributeValue(element, false);// Elimina - Elemento habilitado
 */
function elementDisableAttributeValue(element, disableValue) {
  if (disableValue) {
    element.setAttribute("disabled", "");
  } else {
    element.removeAttribute("disabled", "");
  }
}

//+ INICIO DRAG AND DROP

function enableDropContainer(input, dropZone, container, allawedType) {
  //Animación sobre el contendor
  dropZone.ondragenter = (e) => onDragEnter(e);
  dropZone.ondragleave = (e) => onDragLeave(e);

  dropZone.ondragover = (event) => onDragOver(event);

  dropZone.ondrop = (event) => eventWhenFilesSelectedOrDropped(event);
  input.onchange = (event) => eventWhenFilesSelectedOrDropped(event);

  function eventWhenFilesSelectedOrDropped(event) {
    //Aqui verificamos si el evento fue llamado el input o en el contenedor
    if (event.dataTransfer) {
      //Si fue en el contenedor
      event.stopPropagation();
      event.preventDefault();

      onDragLeave(event);

      file = event.dataTransfer.files[0];
      input.files = event.dataTransfer.files;
    } else {
      //Si fue en el input
      file = event.target.files[0];
    }
    showFile(file);
  }

  function showFile(file) {
    //Si el tipo del archivo esta permitido
    if (allawedType.includes(file.type)) {
      const reader = new FileReader();
      //Read if imagen
      reader.addEventListener("load", (event) => {
        container.src = event.target.result;
      });
      reader.readAsDataURL(file);
    } else {
      //TODO: Si no se trae ningun archivo mostrar imagen por defecto
      //En el caso de no estar permitido se mostrara este mensaje
      errors = {};
      errors[input.name] = `Tipo de Archivo no Permitido: ${file.type} en:  ${
        file.name
      }.\r\n Se permite solo: ${allawedType.join(", ")}`;

      showErrors(errors, input);
    }
  }
}
// Funciones para los efectos

function onDragOver(event) {
  event.stopPropagation();
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = "copy";
}

function onDragEnter(evento) {
  evento.target.classList.add("drag-enter");
}

function onDragLeave(evento) {
  evento.target.classList.remove("drag-enter");
}
// Funciones para los efectos
//+ FIN DRAG AND DROP
