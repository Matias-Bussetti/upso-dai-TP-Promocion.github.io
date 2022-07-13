"use strict";

/**
 *
 * @typedef FILE_DROP_ZONE_FOR_IMAGE ID del contenedor para soltar la imagen
 * @typedef FILE_DROP_ZONE_FOR_CV ID del contenedor para soltar el documento
 * @typedef ALLOWED_TYPES_IMAGE Tipos de archivos permitidos para validar, en el caso de que sea una imagen
 * @typedef ALLOWED_TYPE_PDF Tipos de archivos permitidos para validar, en el caso de que sea un documento
 *
 */

const FILE_DROP_ZONE_FOR_IMAGE = "file-drop-zone-image";
const FILE_DROP_ZONE_FOR_CV = "file-drop-zone-cv";
const ALLOWED_TYPES_IMAGE = ["image/jpeg", "image/png"];
const ALLOWED_TYPE_PDF = ["application/pdf"];

window.onload = () => {
  /**
   *
   * @typedef {HTMLElement} form Elemento form que contiene todos los inputs necesarios para la postulación. Incluye:
   * - [0] Tipo de Documento
   * - [1] Número de Documento
   * - [2] Nombre
   * - [3] Apellido
   * - [4] Email
   * - [5] Puesto de Trabajo
   * - [7] Imágen de perfil
   * - [9] Curriculum (PDF)
   *
   * @typedef {HTMLElement[]} firstStepInputs Arreglo de los inputs del primer paso:
   * - [0] Tipo de Documento
   * - [1] Número de Documento
   * - [2] Nombre
   * - [3] Apellido
   * - [4] Email
   * - [5] Puesto de Trabajo
   *
   * @typedef {HTMLElement} firstStepButton Botón del primer paso (primer "Siguiente Paso").
   *
   * @typedef  {HTMLElement[]} secondStepInputs Arreglo de los inputs del segundo paso:
   * - [0] Imágen de perfil
   *
   * Si bien es uno solo, lo uso en un arreglo para poder utilizar en los 3 pasos la misma función.
   *
   * @typedef {HTMLElement} secondStepButton Botón del primer paso (segundo "Siguiente Paso").
   *
   * @typedef  {HTMLElement[]} thirdStepInputs Arreglo de los inputs del tercer paso:
   * - [0]  Curriculum (PDF)
   *
   * Si bien es uno solo, lo uso en un arreglo para poder utilizar en los 3 pasos la misma función.
   * @typedef {HTMLElement} thirdStepButton Botón submit ("Postularme").
   *
   * @typedef {HTMLElement[]} allInputs Todos los inputs del formulario, incluye:
   * - Tipo de Documento
   * - Número de Documento
   * - Nombre
   * - Apellido
   * - Email
   * - Puesto de Trabajo
   * - Imágen de perfil
   * - Curriculum (PDF)
   *
   * @typedef {HTMLElement} containerImage Contenedor, es este caso un img, en el que se mostrara la imagen cuando sea seleccionada por el input ó soltada en la zona que permite soltar un archivo como este.
   * @typedef {HTMLElement} containerCv Contenedor, es este caso un iframe, en el que se mostrara el documento cuando sea selecciono por el input ó soltado en la zona que permite soltar un archivo como este.
   *
   *
   * @typedef {HTMLElement} dropZoneDivForImage Contenedor Div, el cual se utilizara como zona para soltar la imagen
   * @typedef {HTMLElement} dropZoneDivForCv Contenedor Div, el cual se utilizara como zona para soltar el documento
   *
   *
   */

  //* INICIO DRAG AND DROP
  //Prevenir que la página haga algo cuando la se lanza un archivo por equivocación
  document.ondrop = (event) => event.preventDefault();
  document.ondragover = (event) => event.preventDefault();

  var dropZoneDivForImage = document.getElementById(FILE_DROP_ZONE_FOR_IMAGE);
  var dropZoneDivForCv = document.getElementById(FILE_DROP_ZONE_FOR_CV);

  //Habilitamos ambos contenedores para soltar archivos
  enableDropContainer(
    secondStepInputs[0],
    dropZoneDivForImage,
    containerImage,
    ALLOWED_TYPES_IMAGE
  );
  enableDropContainer(
    thirdStepInputs[0],
    dropZoneDivForCv,
    containerCv,
    ALLOWED_TYPE_PDF
  );

  //* FIN DRAG AND DROP

  var form = document.getElementById("form");

  form.onsubmit = (e) => {
    e.preventDefault();
  };

  var firstStepInputs = [form[0], form[1], form[2], form[3], form[4], form[5]];
  var firstStepButton = form[6];

  var secondStepInputs = [form[7]];
  var secondStepButton = form[8];

  var thirdStepInputs = [form[9]];
  var thirdStepButton = form[10];

  var containerImage = document.getElementById("personal-image-container");
  var containerCv = document.getElementById("personal-cv-container");

  var allInputs = [...firstStepInputs, ...secondStepInputs, ...thirdStepInputs];

  firstStepButton.onclick = () => firstStep();

  /**
   * Esta función se asignara a {@link firstStepButton} y ejecutara la función {@link fetchPostRequest}.Esta sera la primera validación en el servidor (firstStep.php), y se validaran los inputs {@link firstStepInputs}, si la validación fue correcta se ejecutara la función {@link firstStepHandler}
   */
  function firstStep() {
    fetchPostRequest("firstStep.php", firstStepInputs, firstStepHandler);
  }

  /**
   * Esta función se asignara a {@link secondStepButton} y ejecutara la función {@link fetchPostRequest}.Esta sera la segunda validación en el servidor (secondStep.php), y se validaran los inputs {@link secondStepInputs}, si la validación fue correcta se ejecutara la función {@link secondStepHandler}
   */
  function secondStep() {
    fetchPostRequest("secondStep.php", secondStepInputs, secondStepHandler);
  }

  /**
   * Esta función se asignara al evento submit del {@link form} y ejecutara la función {@link fetchPostRequest}.Esta sera la ultima validación en el servidor (thirdStep.php), y se validaran los inputs {@link thirdStepInputs}, si la validación fue correcta se ejecutara la función {@link thirdStepHandler}
   */
  function thirdStep(event) {
    event.preventDefault();
    fetchPostRequest("thirdStep.php", thirdStepInputs, thirdStepHandler);
  }

  /**
   * Esta función se asignara al evento submit del {@link form} y ejecutara la función {@link fetchPostRequest}.Esta sera una validación de todos los campos ya que habian datos del usuario en el servidor (submit.php). Se validaran todos los inputs ({@link allInputs}), si la validación fue correcta se ejecutara la función {@link postulationDone}
   */
  function submit(event) {
    event.preventDefault();
    fetchPostRequest("submit.php", allInputs, postulationDone);
  }

  /**
   * En esta función se realizan la acciones correspondientes al primer paso.
   *
   * 1. Si el usuario se habia guardado ateriormente:
   *    1. Los inputs correpondientes a {@link firstStepInputs} seran identicos a los traidos en la repuesta
   *    2. Si en los datos de la respuesta esta la ruta a la imagen
   *        1. El src del contenedor de la imagen ({@link containerImage}) igual a la ruta de la imagen
   *    3. Si en los datos de la respuesta esta la ruta a del documento (Curriculum)
   *        1. El src del contenedor del documento ({@link containerCv}) igual a la ruta del documento
   *    4. Los inputs de {@link secondStepInputs} y {@link thirdStepInputs}, se habilitaran
   *    5. Los botones {@link firstStepButton} y {@link secondStepButton}, se deshabilitaran
   *    6. El boton {@link thirdStepButton}, se habilitara
   *    7. Se asignara al evento submit de {@link form}, la función {@link submit}
   *
   * 2. Si el usuario no se habia guardado ateriormente:
   *    1. Los inputs correpondientes a {@link secondStepInputs} se habilitaran
   *    5. Los botones {@link firstStepButton} y {@link secondStepButton}, se habilitaran
   *    7. Se asignara al evento click del botón {@link secondStepButton}, la función {@link secondStep}
   *
   * @param {object} response Respuesta ya procesada por {@link fetchPostRequest}
   */
  function firstStepHandler(response) {
    if (response.exist) {
      //1
      //1.1
      form[0].value = response.data.document_type;
      form[1].value = response.data.document_number;
      form[2].value = response.data.name;
      form[3].value = response.data.last_name;
      form[4].value = response.data.email;
      form[5].value = response.data.job;
      //1.2
      if (response.data.personal_image) {
        containerImage.src = response.data.personal_image;
      }
      //1.3
      if (response.data.personal_cv) {
        containerCv.src = response.data.personal_cv;
      }
      //1.4
      [...secondStepInputs, ...thirdStepInputs].forEach((input) => {
        elementDisableAttributeValue(input, false);
      });
      //1.5
      elementDisableAttributeValue(firstStepButton, true);
      elementDisableAttributeValue(secondStepButton, true);
      //1.6
      elementDisableAttributeValue(thirdStepButton, false);
      //1.7
      form.onsubmit = (e) => submit(e);
    } else {
      //2
      //2.1
      elementDisableAttributeValue(secondStepInputs[0], false); //Como se que hay solo uno
      //2.2
      elementDisableAttributeValue(firstStepButton, false);
      elementDisableAttributeValue(secondStepButton, false);
      //2.3
      secondStepButton.onclick = () => secondStep();
    }
  }

  /**
   * En esta función se realizan la acciones correspondientes al segundo paso.
   *
   * 1. Se habilitan los elementos:
   *     - {@link thirdStepInputs}
   *     - {@link thirdStepButton}
   * 2. Se asignara al evento click del botón {@link thirdStepButton}, la función {@link thirdStep}
   *
   * @param {object} response Respuesta ya procesada por {@link fetchPostRequest}
   */
  function secondStepHandler(response) {
    //1
    elementDisableAttributeValue(thirdStepInputs[0], false); //Como se que hay solo uno
    elementDisableAttributeValue(thirdStepButton, false);
    //2
    form.onsubmit = (e) => thirdStep(e);
  }

  /**
   * En esta función se realizan la acciones correspondientes al tercer paso.
   *
   * @param {object} response Respuesta ya procesada por {@link fetchPostRequest}
   */
  function thirdStepHandler(response) {
    //? SALIO TODO BIEN
    postulationDone();
  }

  //TODO: HACER LA FINALIZACION DE LA POSTULACION
  function postulationDone() {
    console.log("asdasd %c Salio TODO bien", "color:red;");
  }
};
