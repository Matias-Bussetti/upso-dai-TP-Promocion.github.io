//"use strict";
window.onload = () => {
  form = document.getElementById("form");

  form.onsubmit = (e) => {
    e.preventDefault();
    submit();
    function submit() {
      // es una variable porque se modifica en la llamada
      var init = {
        method: "POST",
      };

      var perfil = new FormData(form);
      init.body = perfil;

      console.log(Array.from(perfil));

      var url = "./server/code/postulation.php";
      var req = new Request(url, init);

      fetch(req)
        .then((rta) => rta.json())
        .then((rta) => {
          if (rta.result) {
            documentInputs.forEach((input) => {
              inputValid(input);
            });
            //TODO: SIGUIENTE PÁGINA (LA POSTULACION SE GUARDO CORRECTAMENTE)
          } else {
            //Mostart Errores
            showErrors(
              rta.errors,
              form[0],
              form[1],
              form[3],
              form[4],
              form[5],
              form[6],
              form[8],
              form[10]
            );
          }
        })
        .catch((e) => console.log(e));
    }
  };

  console.log(window.location.pathname);

  firstStepInputs = [form[0], form[1], form[2], form[3], form[4], form[5]];
  firstStepButton = form[6];

  secondStepInputs = [form[7]];
  secondStepButton = form[8];

  thirdStepInputs = [form[9]];
  thirdStepButton = form[10];

  firstStepButton.onclick = () => firstStep();
  secondStepButton.onclick = () => secondStep();
  thirdStepButton.onclick = () => ThirdStep();

  function firstStep() {}

  function secondStep() {}
  function ThirdStep() {}

  /*
  documentInputs = [form[0], form[1]];

  buttonValidateDocument = form[2];
  buttonValidateDocument.onclick = () => validateDocument();

  personalInfoInput = [form[3], form[4], form[5], form[6]];

  buttonStepTwo = form[7];

  imageInput = form[8];

  buttonStepThree = form[9];

  cvInput = form[10];

  buttonSubmit = form[11];
  function validateDocument() {
    var init = {
      method: "POST",
    };

    var perfil = new FormData(form);
    init.body = perfil;

    var url = "./server/code/validateDocument.php";
    var req = new Request(url, init);

    fetch(req)
      .then((rta) => rta.json())
      .then((rta) => {
        if (rta.result) {
          documentInputs.forEach((input) => {
            inputValid(input);
          });
          if (rta.exist) {
            //TODO: Deshabilitar boton de validar
            //TODO: Deshabilitar el boton step 2 y 3
            //TODO: Cada campo sea igual a la informacion traida
            //TODO: Contenedor de Imagen SRC = personal_image
            //TODO: Contenedor de CV SRC = personal_cv
            //TODO: Agregar evento a los inputs si cambian habilitar boton de validar
          } else {
            // * No Existe el usuario
            personalInfoInput.forEach((input) => enableElement(input));
            enableElement(buttonStepTwo);

            buttonStepTwo.onclick = () => stepTwo();
          }
        } else {
          //Mostart Errores
          showErrors(rta.errors, ...documentInputs);
        }
      })
      .catch((e) => console.log(e));
  }

  function stepTwo() {
    //TODO: Habilitar el imageInput
    enableElement(imageInput);
    //TODO: Habilitar el boton step 3
    enableElement(buttonStepThree);
    //TODO: Agregar evento al boton step 3 con función stepThree
    buttonStepThree.onclick = () => stepThree();
  }

  function stepThree() {
    //TODO: Habilitar el cvInput
    enableElement(cvInput);
    //TODO: Habilitar Botón Submit
    enableElement(buttonSubmit);
  }

};

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
  */
};

function postRequest(phpFileName) {
  var init = {
    method: "POST",
  };

  var perfil = new FormData(form);
  init.body = perfil;

  var url = ``;
  var url = "./server/code/validateDocument.php";
  var req = new Request(url, init);
}

function inputValid(input) {
  input.classList.add("is-valid");
  input.classList.remove("is-invalid");
}

function inputInvalid(input) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
}

function enableElement(element) {
  element.removeAttribute("disabled");
}
