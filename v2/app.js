window.onload = () => {
  form = document.getElementById("form");

  form.onsubmit = (e) => {
    e.preventDefault();
    submit();
  };

  personalDataInputs = document.querySelectorAll(
    "div#personal-data input, div#personal-data select"
  );

  personalImage = document.getElementById("personal-image");
  personalImageContainer = document.getElementById("personal-image-container");

  personalCV = document.getElementById("personal-cv");
  personalCVContainer = document.getElementById("personal-cv-container");

  validateButton = document.getElementById("validate-document");

  console.log(Object.entries(form));

  validateButton.onclick = (e) => {
    // es una variable porque se modifica en la llamada
    var init = {
      method: "POST",
    };

    var perfil = new FormData(form);
    init.body = perfil;

    var url = "./server/code/validateDocument.php";
    var req = new Request(url, init);

    fetch(req).then(recuperar).then(mostrar).catch(error);

    function recuperar(rta) {
      return rta.json();
    }

    function mostrar(dato) {
      if (dato.exist) {
        personalDataInputs.forEach((input) => {
          input.removeAttribute("disabled");
          input.onchange = () => a();
        });
        personalImage.removeAttribute("disabled");
        personalCV.removeAttribute("disabled");

        console.log(dato.data);

        form.name.value = dato.data.name;
        form.last_name.value = dato.data.last_name;
        form.email.value = dato.data.email;
        form.job.value = dato.data.job;

        personalImageContainer.src = dato.data.personal_image;
        personalCVContainer.src = dato.data.personal_cv;
        //SET img
      } else {
        personalDataInputs.forEach((input) => {
          input.removeAttribute("disabled");
          input.onchange = () => a();
        });
      }
      //console.table(dato);
    }

    function error(e) {
      /* manejar errores */
      console.error(e);
    }
  };

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

    fetch(req).then(recuperar).then(mostrar).catch(error);

    function recuperar(rta) {
      return rta.json();
    }

    function mostrar(dato) {
      //TODO: Comprobar si tiene errores
      console.table(dato.errors);

      if (dato.errors) {
        Object.entries(dato.errors).forEach((error) => {
          console.log(form[error[0]].classList.add("is-invalid")); //TODO en el div devajo agregar errrores
        });
      }

      if (dato.exist) {
        personalDataInputs.forEach((input) => {
          input.removeAttribute("disabled");
          input.onchange = () => a();
        });
        personalImage.removeAttribute("disabled");
        personalCV.removeAttribute("disabled");

        console.log(dato);
      } else {
        personalDataInputs.forEach((input) => {
          input.removeAttribute("disabled");
          input.onchange = () => a();
        });
      }
      //console.table(dato);
    }

    // TODO modificar form para: mostrar mensajes de error, si el usuario ya existe traer los datos, iframe pdf y <img>

    function error(e) {
      /* manejar errores */
      console.error(e);
    }
  }

  function a() {
    const isNotEmpty = (input) => input.value !== "";
    const firstOptionNotSelected = (select) => select.selectedIndex !== 0;

    const condition =
      isNotEmpty(personalDataInputs[0]) &&
      isNotEmpty(personalDataInputs[1]) &&
      isNotEmpty(personalDataInputs[2]) &&
      isNotEmpty(personalDataInputs[3]) &&
      firstOptionNotSelected(personalDataInputs[3]);

    if (condition) {
      console.log("ahora si");
      personalImage.removeAttribute("disabled");
      personalImage.onchange = () => b();
    }
  }

  function b() {
    console.log("b");
    personalCV.removeAttribute("disabled");
  }
};
