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
