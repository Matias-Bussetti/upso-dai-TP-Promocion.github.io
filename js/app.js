//TODO: Comentar con typo
//TODO: "use strict"
//DONE: Archivo independiente de funciones, comentar
//TODO: COMENTAR BACKEND
//TODO: refactorizar
//"use strict";
const FILE_DROP_ZONE_FOR_IMAGE = "file-drop-zone-image";
const FILE_DROP_ZONE_FOR_CV = "file-drop-zone-cv";
const ALLOWED_TYPES_IMAGE = ["image/jpeg", "image/png"];
const ALLOWED_TYPE_PDF = ["application/pdf"];

window.onload = () => {
  form = document.getElementById("form");

  form.onsubmit = (e) => {
    e.preventDefault();
  };

  firstStepInputs = [form[0], form[1], form[2], form[3], form[4], form[5]];
  firstStepButton = form[6];

  secondStepInputs = [form[7]];
  secondStepButton = form[8];

  thirdStepInputs = [form[9]];
  thirdStepButton = form[10];

  containerImage = document.getElementById("personal-image-container");
  containerCv = document.getElementById("personal-cv-container");

  allInputs = [...firstStepInputs, ...secondStepInputs, ...thirdStepInputs];

  //+ INICIO DRAG AND DROP
  //TODO: Refactorizar codigo
  //TODO: El mensaje de error mostrarlo en el invalid feedback
  //TODO: Si no se trae ningun archivo mostrar imagen por defecto
  //Prevenir que la página haga algo cuando la se lanza un archivo por equivocación
  document.ondrop = (event) => event.preventDefault();
  document.ondragover = (event) => event.preventDefault();

  var dropZoneDivForImage = document.getElementById(FILE_DROP_ZONE_FOR_IMAGE);
  var dropZoneDivForCv = document.getElementById(FILE_DROP_ZONE_FOR_CV);

  enableDrop(
    secondStepInputs[0],
    dropZoneDivForImage,
    containerImage,
    ALLOWED_TYPES_IMAGE
  );
  enableDrop(
    thirdStepInputs[0],
    dropZoneDivForCv,
    containerCv,
    ALLOWED_TYPE_PDF
  );

  function enableDrop(input, dropZone, container, allawedType) {
    //Animación sobre el contendor
    dropZone.ondragenter = (e) => onDragEnter(e);
    dropZone.ondragleave = (e) => onDragLeave(e);

    dropZone.ondragover = (event) => onDragOver(event);

    dropZone.ondrop = (event) => eventWhenFilesSelectedOrDropped(event);
    input.onchange = (event) => eventWhenFilesSelectedOrDropped(event);

    function eventWhenFilesSelectedOrDropped(event) {
      let fileList;

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
      showImage(file);
    }

    function showImage(file) {
      //Si el tipo del archivo esta permitido
      if (allawedType.includes(file.type)) {
        const reader = new FileReader();
        //Read if imagen
        reader.addEventListener("load", (event) => {
          container.src = event.target.result;
        });
        reader.readAsDataURL(file);
      } else {
        //En el caso de no estar permitido se mostrara este mensaje
        alert(
          `Tipo de Archivo no Permitido: \r\n ${file.type} \r\n en: \r\n ${file.name} `
        );
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
  }
  // Funciones para los efectos
  //+ FIN DRAG AND DROP

  firstStepButton.onclick = () => firstStep();

  function submit(e) {
    e.preventDefault();
    fetchPostRequest("submit.php", allInputs, postulationDone);
  }
  function secondStep() {
    fetchPostRequest("secondStep.php", secondStepInputs, secondStepHandler);
  }
  function thirdStep(event) {
    event.preventDefault();
    fetchPostRequest("thirdStep.php", thirdStepInputs, thirdStepHandler);
  }
  function firstStep() {
    fetchPostRequest("firstStep.php", firstStepInputs, firstStepHandler);
  }

  function firstStepHandler(rta) {
    if (rta.exist) {
      //+ EL USUARIO YA FUE CARGADO
      //DONE: CAMBIAR LOS DATOS DE LA PRIMERA SECCION DEL FORMULARIO
      form[0].value = rta.data.document_type;
      form[1].value = rta.data.document_number;
      form[2].value = rta.data.name;
      form[3].value = rta.data.last_name;
      form[4].value = rta.data.email;
      form[5].value = rta.data.job;
      //DONE: SI EL DATO TIENE PERSONAL_IMAGE ENTONCES => SRC CONTENEDOR DE IMAGEN IGUAL A PERSONAL_IMAGE
      if (rta.data.personal_image) {
        containerImage.src = rta.data.personal_image;
      }
      //DONE: SI EL DATO TIENE PERSONAL_CV ENTONCES => SRC CONTENEDOR DEL CV IGUAL A PERSONAL_CV
      if (rta.data.personal_cv) {
        containerCv.src = rta.data.personal_cv;
      }

      //DONE: HABILITAR INPUTS PASO 2 y 3
      [...secondStepInputs, ...thirdStepInputs].forEach((input) => {
        elementDisableAttributeValue(input, false);
      });

      //DONE: DESHABILITAR BOTONES SIGUIENTE PASO
      elementDisableAttributeValue(firstStepButton, true);
      elementDisableAttributeValue(secondStepButton, true);

      //DONE: HABILITAR BOTON SUBMIT
      elementDisableAttributeValue(thirdStepButton, false);

      //DONE: FORM.ONSUBMIT = SUBMIT()
      form.onsubmit = (e) => submit(e);
    } else {
      // * No Existe el usuario
      //DONE: Habilitar los input para subir la imagen
      elementDisableAttributeValue(secondStepInputs[0], false); //Como se que hay solo uno
      //DONE: Habilitar el botón para el siguiente paso
      elementDisableAttributeValue(firstStepButton, false);
      elementDisableAttributeValue(secondStepButton, false);
      //DONE: asignar funcion paso 2 al boton paso 2
      secondStepButton.onclick = () => secondStep();
    }
  }

  function secondStepHandler(rta) {
    //DONE: Habilitar input Cv
    elementDisableAttributeValue(thirdStepInputs[0], false); //Como se que hay solo uno
    //DONE: Habilitar Boton Submit
    elementDisableAttributeValue(thirdStepButton, false);

    //DONE: form on submit = funcion thirdStep()
    form.onsubmit = (e) => thirdStep(e);
  }

  function thirdStepHandler(rta) {
    //? SALIO TODO BIEN
    postulationDone();
  }

  function postulationDone() {
    // allInputs.forEach((input) => {
    //   inputValid(input);
    // });
    console.log("asdasd %c Salio TODO bien", "color:red;");
  }
};

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
