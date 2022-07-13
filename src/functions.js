/**
 *  Esta función cumple la función de crear un petición post para realizar un solicitud {@link fetch} al servidor.
 *
 * @param {string} phpFileName Nombre del archivo con extención (ej.: a.php), la cual recide en el servidor
 * @param {HTMLElement} formElement Elemento form el cual se utilizara para armar un formData para enviar al servidor
 * @returns {Request} Petición para realizar un post al servidor
 */
function postRequest(phpFileName, formElement) {
  var init = {
    method: "POST",
  };

  var body = new FormData(formElement);
  init.body = body;

  var phpServerUrl = "./server/code/" + phpFileName;

  return new Request(phpServerUrl, init);
}

/**
 * Esta función cumple la función de hacer un petición post al servidor.
 *
 * @param {string} phpFileName Nombre del archivo con extención (ej.: a.php), la cual recide en el servidor
 * @param {HTMLElement} formElement Elemento form el cual se utilizara para armar un formData para enviar al servidor
 * @param {HTMLElement[]} validateInputs Arreglo de Inputs para validar
 * @param {*} callback Función que se llamara en el caso no hayan habido errores en la validación
 */
function fetchPostRequest(phpFileName, formElement, validateInputs, callback) {
  fetch(postRequest(phpFileName, formElement))
    .then((response) => response.json())
    .then((response) => handleResponse(response, validateInputs, callback))
    .catch(handleError);
}

/**
 * Esta función cumple la tarea de resolver la respuesta el servidor. En el caso de que se haya validado bien, llamara a la función traida en los parametros
 * @param {*} response Respuesta del servidor
 * @param {HTMLElement[]} validateInputs Arreglo de Inputs para validar
 * @param {function} callback Función que se llamara en el caso no hayan habido errores en la validación
 */
function handleResponse(response, validateInputs, callback) {
  if (response.result) {
    validateInputs.forEach((input) => {
      inputValid(input);
    });

    callback(response);
  } else {
    //Mostart Errores
    showErrors(response.errors, ...validateInputs);
  }
}

//TODO: COMENTAR
function handleError(err) {
  //TODO: MOSTRAR UN MENSAJE SI SALIO UN ERROR BOOTSTAP TOAST
  console.error(err);
}

/**
 * En esta función se mostraran en los inputs los errores en el caso de que estos esten mal
 * @param {{string: string}} errors Objeto con los nombre de los inputs y sus respectivos mensaje de error
 * @param  {...HTMLElement} inputs Arreglo de Elementos Inputs para validar
 */

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

/**
 * En esta función utilizara para mostrar que el valor input es correcto
 * @param {HTMLElement} input Elemento Input para mostrar que esta bien
 */
function inputValid(input) {
  input.classList.add("is-valid");
  input.classList.remove("is-invalid");
}

/**
 * En esta función utilizara para mostrar que el valor input es incorrecto
 * @param {HTMLElement} input Elemento Input para mostrar que esta mal
 */
function inputInvalid(input) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
}

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

/**
 *
 * Esta función se utilizara en el caso que se quiera utilizar un div, como forma para elegir archivos. Con un funcionamiento identico al input file.
 *
 * 1. Se asignaran los eventos para añadir efectos a la página
 * 2. Se asignara los eventos para mostrar en el {@link container} el archivo soltado. En el caso de que este sea:
 *
 * @param {HTMLElement} input Elemento input con tipo = file, al cual se le asignara el primer archivo que se sulte
 * @param {HTMLElement} dropZone Elemento div, el cual funcionara como zona para soltar archivos
 * @param {HTMLElement} container Elemento tal que se utilizara para mostrar el archivo soltado
 * @param {string[]} allawedType Lista de tipos permitidos
 */
function enableDropContainer(input, dropZone, container, allawedType) {
  //1
  dropZone.ondragenter = (e) => onDragEnter(e);
  dropZone.ondragleave = (e) => onDragLeave(e);
  dropZone.ondragover = (event) => onDragOver(event);
  //2
  dropZone.ondrop = (event) => eventWhenFilesSelectedOrDropped(event);
  input.onchange = (event) => eventWhenFilesSelectedOrDropped(event);

  /**
   * Esta función cumple la función de resolver la llamada de los eventos del {@link input}.onchange o el {@link dropZone}.ondrop
   * 1. Si se hizo una transferencia de archivos ({@link dropZone}.ondrop)
   *    1. Se evitara la acción del navegador por defecto y realizaran efectos en el contenedor
   *    2. Se instanciara un DataTransfer y se le asignara el primer archivo lanzado, esto servira en el caso de que se sulten varios archivos
   *    3. El valor del input sera igual a los archivos del DataTransfer
   * 2. Si cambio el valor del {@link input}
   * 3. Se llama a la función para mostrar el archivo en el contenedor
   * @param {event} event evento del {@link input}.onchange o el {@link dropZone}.ondrop
   */
  function eventWhenFilesSelectedOrDropped(event) {
    //Aqui verificamos si el evento fue llamado el input o en el contenedor
    let file;
    if (event.dataTransfer) {
      //1
      //1.1
      event.stopPropagation();
      event.preventDefault();
      onDragLeave(event);
      //1.2
      var dt = new DataTransfer();
      dt.items.add(event.dataTransfer.files[0]);
      //1.3
      input.files = dt.files;
      file = dt.files[0];
    } else {
      //2
      file = event.target.files[0];
    }
    //3
    showFile(file);
  }

  /**
   * En esta función se mostrara el archivo en el contenedor
   *
   * @param {File} file
   */
  function showFile(file) {
    //Si el tipo del archivo esta permitido
    if (allawedType.includes(file.type)) {
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        container.src = event.target.result;
      });
      reader.readAsDataURL(file);
    } else {
      let errors = {};
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
