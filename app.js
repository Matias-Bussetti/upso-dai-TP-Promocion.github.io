//"use strict";
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

  firstStepButton.onclick = () => firstStep();
  //secondStepButton.onclick = () => secondStep();
  //thirdStepButton.onclick = () => ThirdStep();

  function submit(e) {
    e.preventDefault();

    fetch(postRequest("submit.php"))
      .then((rta) => rta.json())
      .then(handleResponse)
      .catch(handleError);

    function handleResponse(rta) {
      if (rta.result) {
        allInputs.forEach((input) => {
          inputValid(input);
        });
      } else {
        //Mostart Errores
        showErrors(rta.errors, allInputs);
      }
    }
  }

  function firstStep() {
    fetch(postRequest("firstStep.php"))
      .then((rta) => rta.json())
      .then(handleResponse)
      .catch(handleError);

    function handleResponse(rta) {
      if (rta.result) {
        firstStepInputs.forEach((input) => {
          inputValid(input);
        });
        if (rta.exist) {
          //+ EL USUARIO YA FUE CARGADO
          //TODO: CAMBIAR LOS DATOS DE LA PRIMERA SECCION DEL FORMULARIO
          form[0].value = rta.data.document_type;
          form[1].value = rta.data.document_number;
          form[2].value = rta.data.name;
          form[3].value = rta.data.last_name;
          form[4].value = rta.data.email;
          form[5].value = rta.data.job;
          //TODO: SI EL DATO TIENE PERSONAL_IMAGE ENTONCES => SRC CONTENEDOR DE IMAGEN IGUAL A PERSONAL_IMAGE
          if (rta.data.personal_image) {
            containerImage.src = rta.data.personal_image;
          }
          //TODO: SI EL DATO TIENE PERSONAL_CV ENTONCES => SRC CONTENEDOR DEL CV IGUAL A PERSONAL_CV
          if (rta.data.personal_cv) {
            containerCv.src = rta.data.personal_cv;
          }

          //TODO: HABILITAR INPUTS PASO 2 y 3
          [...secondStepInputs, ...thirdStepInputs].forEach((input) => {
            elementDisableAttributeValue(input, false);
          });

          //TODO: DESHABILITAR BOTONES SIGUIENTE PASO
          elementDisableAttributeValue(firstStepButton, true);
          elementDisableAttributeValue(secondStepButton, true);

          //TODO: HABILITAR BOTON SUBMIT
          elementDisableAttributeValue(thirdStepButton, false);

          //TODO: FORM.ONSUBMIT = SUBMIT()
          form.onsubmit = (e) => submit(e);

          console.log(form.onsubmit);
        } else {
          // * No Existe el usuario
          //TODO: Habilitar los input para subir la imagen
          elementDisableAttributeValue(secondStepInputs[0], false); //Como se que hay solo uno
          console.log(secondStepInputs[0]);
          //TODO: Habilitar el botón para el siguiente paso
          elementDisableAttributeValue(firstStepButton, false);
          elementDisableAttributeValue(secondStepButton, false);
          //TODO: asignar funcion paso 2 al boton paso 2
          secondStepButton.onclick = () => secondStep();
        }
      } else {
        //Mostart Errores
        showErrors(rta.errors, ...firstStepInputs);
      }
    }
  }

  function secondStep() {
    fetch(postRequest("secondStep.php"))
      .then((rta) => rta.json())
      .then(handleResponse)
      .catch(handleError);

    function handleResponse(rta) {
      if (rta.result) {
        secondStepInputs.forEach((input) => {
          inputValid(input);
        });
        //TODO: Habilitar input Cv
        elementDisableAttributeValue(thirdStepInputs[0], false); //Como se que hay solo uno
        //TODO: Habilitar Boton Submit
        elementDisableAttributeValue(thirdStepButton, false);

        //TODO: form on submit = funcion thirdStep()
        form.onsubmit = (e) => thirdStep(e);
      } else {
        //Mostart Errores
        showErrors(rta.errors, ...secondStepInputs);
      }
    }
  }
  function thirdStep(event) {
    event.preventDefault();
    fetch(postRequest("thirdStep.php"))
      .then((rta) => rta.json())
      .then(handleResponse)
      .catch(handleError);

    function handleResponse(rta) {
      console.log(rta);
      if (rta.result) {
        secondStepInputs.forEach((input) => {
          inputValid(input);
        });
        //? SALIO TODO BIEN
        postulationDone();
      } else {
        //Mostart Errores
        showErrors(rta.errors, ...thirdStepInputs);
      }
    }
  }

  function postulationDone() {
    allInputs.forEach((input) => {
      inputValid(input);
    });
    console.log("Salio TODO bien");
  }
};

function handleError(err) {
  console.error(err);
}

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

function postRequest(phpFileName) {
  var init = {
    method: "POST",
  };

  var perfil = new FormData(form);
  init.body = perfil;

  var url = "./server/code/" + phpFileName;

  return new Request(url, init);
}

function inputValid(input) {
  input.classList.add("is-valid");
  input.classList.remove("is-invalid");
}

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
