
const get_uri = 'https://vedaversum.eu-4.evennode.com';
// const get_uri = 'http://localhost:3030';

function popUpForm() {
  $("#popupForm").fadeOut(108);

  // click events
  ["Sun", "Ac", "Moon", "SunAc", "SunMoon"].forEach((key) => {
    $("#trigger" + key).attr("onclick", `popUp("${key}")`);
  });
  $("#triggerForm")
    .text("← Zurück")
    .attr("onclick", `closePopupForm()`);

  $("#infoForm").css("width", "40%");
  $("#infoForm").animate({
    width: "100%",
  }, {
    duration: 333,
    complete: function () {
      $("html, body").animate({
        scrollTop: $("#popupForm").offset().top - 36,
      },
        111
      );
    },
  });
  $("#popupForm").fadeIn(1234);
}

function closePopupForm() {
  $("#popupForm").fadeOut(108);

  $("html, body").animate({
    scrollTop: $("#popupForm").offset().top - 36,
  },
    111
  );

  $("#infoForm").animate({
    width: "50%",
  }, {
    duration: 333,
    complete: function () {
      $(this).removeAttr("style"); // Remove inline style after animation completes
    },
  });
  $("#triggerForm")
    .text("Eingabedaten ändern →")
    .attr("onclick", `popUpForm()`);
}

function popUpLegend() {
  $("#triggerLegend").text("← Zurück").attr("onclick", `closeLegend()`);

  $("#infoLegend").css("width", "40%");
  $("#infoLegend").animate({
    width: "100%",
  }, {
    duration: 333,
    complete: function () {
      $("html, body").animate({
        scrollTop: $("#circularPlot").offset().top - 36,
      },
        111
      );
    },
  });
  $("#popupLegend").fadeIn(1234);
}

function closeLegend() {
  $(".popupLegend").fadeOut(108);
  $("#infoLegend").animate({
    width: "50%",
  }, {
    duration: 333,
    complete: function () {
      $(this).removeAttr("style"); // Remove inline style after animation completes
    },
  });
  $("#triggerLegend")
    .text("Legende →")
    .attr("onclick", `popUpLegend()`);
}

function popUp(key) {
  $(".flexText4, .popup").fadeOut(108);
  $(".signsTextBox").css({
    width: "20%",
  });
  $(".flexText5").children().text("Zur Interpretation →");
  $(".newInput").children().text("Eingabedaten ändern →");

  // click events
  ["Sun", "Ac", "Moon", "SunAc", "SunMoon"].forEach((idKey) => {
    $("#trigger" + idKey).attr("onclick", `popUp("${idKey}")`);
  });
  $("#trigger" + key)
    .text("← Zurück")
    .attr("onclick", `closePopup("${key}")`);

  $("#info" + key).css("width", "40%");
  $("#info" + key).animate({
    width: "100%",
    height: `${0.67 * window.innerHeight}px`,
  }, {
    duration: 333,
    complete: function () {
      $("html, body").animate({
        scrollTop: $("#info" + key).offset().top - 12,
      },
        111
      );
    },
  });
  $(".flexText4, #popup" + key).fadeIn(1234);
}

function closePopup(key) {
  $(".flexText4, .popup").fadeOut(108);
  $(".flexText4").fadeIn(666);
  $(".signsTextBox").animate({
    width: "20%",
    height: "296px",
  }, {
    duration: 333,
    complete: function () {
      $("html, body").animate({
        scrollTop: $("#info" + key).offset().top - 12,
      },
        111
      );
    },
  });
  $("#trigger" + key)
    .text("Zur Interpretation →")
    .attr("onclick", `popUp("${key}")`);
}

function setDatetimepicker() {
  $.datetimepicker.setLocale("de");
  $("#dat").datetimepicker({
    timepicker: false,
    format: "d.m.Y",
    startDate: "1987/12/03",
  });
  $("#hour").datetimepicker({
    datepicker: false,
    format: "H",
    step: 60,
  });
  $("#minu").datetimepicker({
    datepicker: false,
    format: "i",
    step: 1,
    minTime: "00:00",
    maxTime: "01:00",
  });

  $('#che').click(function (event) {
    var isChecked = event.target.checked;

    if (isChecked) {
      savedHour = $('#hour').val();
      savedMinu = $('#minu').val();
      savedHouse = $('#House').val();
      $('#hour').val('12');
      $('#minu').val('00');
      $('#House').val('whole-sign');
    } else {
      $('#hour').val(savedHour);
      $('#minu').val(savedMinu);
      $('#House').val(savedHouse);
    }
  });
};

function setGeoapify(geo_key) {
  if (document.getElementById("search_loc").children.length === 0) {
    var autocompleteInput = new autocomplete.GeocoderAutocomplete(
      document.getElementById("search_loc"),
      geo_key, {
      placeholder: "Ort finden",
      lang: "de"
    }
    );

    var inputCity = "";
    var inputCountry = "";

    autocompleteInput.on('select', (location) => {
      inputCity = location.properties.city;
      inputCountry = ", " + location.properties.country;
      var longi = Math.round(location.properties.lon * 100) / 100;
      document.getElementById("lon").value = longi;
      var lati = Math.round(location.properties.lat * 100) / 100;
      document.getElementById("lat").value = lati;
    });
  }
}

async function fetchHtmlData(get_uri) {
  $(".fadeOutDiv").fadeOut(108);

  const aspectChecks = document.querySelectorAll(".aspect-check");
  const aspectCheckBinary = [];
  aspectChecks.forEach(entry => {
    aspectCheckBinary.push(entry.checked ? 1 : 0);
  })
  const params = {
    name: document.getElementById('nam').value,
    date: document.getElementById('dat').value,
    hour: document.getElementById('hour').value,
    minu: document.getElementById('minu').value,
    longi: document.getElementById('lon').value,
    lati: document.getElementById('lat').value,
    house: document.getElementById('House').value,
    city: inputCity,
    country: inputCountry,
    zodi: document.getElementById('Trop').checked,
    check: document.getElementById('che').checked,
    aspectChecks: aspectCheckBinary,
  };
  // const newWindow = window.open('', '_blank');

  await axios.get(get_uri + '/get-html', {
    params
  })
    .then(response => {
      document.querySelector('#plot-container').outerHTML = response.data;
      requestAnimationFrame(() => {
        setDatetimepicker();
        setGeoapify(geoKey);
      });
      // newWindow.document.open();
      // newWindow.document.write(response.data);
      // newWindow.document.close();

    })
    .catch(error => {
      console.error('Error fetching HTML data:', error.message);
    });
  await axios.get(get_uri + "/create-plot", {
    params
  }).then(resp => {
    var response_data = resp.data;

    try {
      Plotly.newPlot("circularPlot", response_data.data, response_data.layout, response_data.config);
      Plotly.newPlot("cartesianPlot", response_data.aspects, response_data.layoutXy, response_data.configXy);
    } catch (error) {
      console.error("Error creating Plotly graph:", error);
    }
  });
}

function addEventlistener(getUri) {
  var form = document.querySelector('form#frm');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var form = document.querySelector('form#frm');
    const inputs = form.querySelectorAll('input.horo-inpfield[placeholder]');
    var countMismatches = 0;

    inputs.forEach(function (input) {
      if (input.validity.valueMissing) {
        countMismatches += 1;
        input.setCustomValidity(`Bitte trage einen Wert in das Feld ein.`);
        input.reportValidity();
        console.log(input.validationMessage, "missing val") // ??? xxx 
      }
      if (input.validity.patternMismatch) {
        countMismatches += 1;
        var valMessage = `<p class="horo">${input.validationMessage}</p>`;
        console.log(valMessage)
        input.reportValidity();
      }
    });

    if (countMismatches == 0) {
      fetchHtmlData(getUri);
    }
  });

  let isInputFocused = false;
  const inputField = document.querySelector('.geoapify-autocomplete-input');

  inputField.addEventListener('focus', () => {
    isInputFocused = true;
    console.log('Input is in focus:', isInputFocused);
  });

  inputField.addEventListener('blur', () => {
    isInputFocused = false;
    console.log('Input is in focus:', isInputFocused);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !isInputFocused) {
      $('#but').click();
    }
  });
}

// async function downloadSvgGraph(event) {
// 	event.preventDefault();
// 	var svgtag1 = document.querySelectorAll(".main-svg")[0].innerHTML;
// 	// var svgtag2 = document.querySelectorAll('.main-svg')[1].innerHTML;
// 	var svgtag = svgtag1;
// 	svgtag = svgtag.replace(/<b>|<\/b>/g, "").replace(/<br>/g, "");
// 	var filename =
// 		user_data.name +
// 		"_" +
// 		user_data.year +
// 		"." +
// 		user_data.month +
// 		"." +
// 		user_data.day +
// 		"_" +
// 		user_data.hour +
// 		"_" +
// 		user_data.minute +
// 		"_" +
// 		user_data.lat +
// 		"N" +
// 		user_data.lon +
// 		"O";
// 	const params = {
// 		ident_key: "zbob3as8",
// 		svgtag: svgtag,
// 		file_name: filename,
// 	};
// 	try {
// 		const response = await axios.post(
//			<%=get_uri%> + 
// 			"/svg-background",
// 			params
// 		);
// 		console.log(params, "svg bckground triggered");
// 	} catch (error) {
// 		console.error("Error fetching SVG background download:", error);
// 	}
// }
// document
// 	.getElementById("dlButton")
// 	.addEventListener("click", downloadSvgGraph);

async function fetchForm() {
  try {
    const response = await axios.get(get_uri + '/form');
    document.querySelector('#formEjs').outerHTML = response.data;
  } catch (error) {
    console.error('Error fetching HTML data:', error.message);
  }
}

async function fetchEnvironmentVariables() {
  try {
    const response = await axios.get(get_uri + '/api/environment')
    const data = response.data;
    const geo_key = data.geo_key;
    const autocompleteInput = new autocomplete.GeocoderAutocomplete(
      document.getElementById("search_loc"),
      geo_key, {
      placeholder: "Ort finden",
      lang: "de"
    }
    );

    autocompleteInput.on('select', (location) => {
      inputCity = location.properties.city;
      inputCountry = ", " + location.properties.country;
      var longi = Math.round(location.properties.lon * 100) / 100;
      document.getElementById("lon").value = longi;
      var lati = Math.round(location.properties.lat * 100) / 100;
      document.getElementById("lat").value = lati;
    });
  } catch (error) {
    console.error('Error fetching environment vars:', error.message);
  }
}

async function mainFunc() {
  // XXXX
  var inputCity = "",
    inputCountry = "";

  const $ = jQuery;
  await fetchForm();

  fetchEnvironmentVariables();
  setDatetimepicker();
  addEventlistener(get_uri);
}

// wp index func:

// form.addEventListener('input', function(event) {
//   const inputElement = event.target;

//   if (inputElement.validity.patternMismatch) {
//     console.log("Input does not match the pattern.");

//     inputElement.setCustomValidity("Bitte gib einen gültigen Wert ein.");
//   } else {
//     console.log("Input matches the pattern.");
//     inputElement.setCustomValidity("");
//   }
//   inputElement.reportValidity();
// });