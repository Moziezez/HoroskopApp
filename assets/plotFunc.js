var inputCity;
var inputCountry;

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
    display: "block",
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
  let $signsTextBox = $(".signsTextBox");
  $signsTextBox.css("height", "auto");
  let autoHeight = $signsTextBox.height(); // Get the "auto" height

  $(".flexText4, .popup").fadeOut(108);
  $(".flexText4").fadeIn(666);
  $(".signsTextBox").animate({
    width: "20%",
    height: autoHeight,
  }, {
    duration: 333,
    complete: function () {
      $("html, body").animate({
        scrollTop: $(".flexItem4").offset().top - 12,
      },
        111
      );
    },
  });
  $("#trigger" + key)
    .text("Zur Interpretation →")
    .attr("onclick", `popUp("${key}")`);
}

function addClickEvents() {
  $("#triggerForm").attr("onclick", `popUpForm()`);
  $("#triggerLegend").attr("onclick", `popUpLegend()`);
  $("#triggerSun").attr("onclick", `popUp('Sun')`);
  $("#triggerAc").attr("onclick", `popUp('Ac')`);
  $("#triggerMoon").attr("onclick", `popUp('Moon')`);
  $("#triggerSunAc").attr("onclick", `popUp('SunAc')`);
  $("#triggerSunMoon").attr("onclick", `popUp('SunMoon')`);
}

function setDatetimepicker() {
  var colorTheme = "default";
  if ($("body").css("background-color") == "rgb(11, 10, 9)") {
    colorTheme = "dark";
  }
  $.datetimepicker.setLocale("de");
  $("#dat").datetimepicker({
    timepicker: false,
    dayOfWeekStart: 1,
    format: "d.m.Y",
    yearStart: 1930,
    yearEnd: 2026,
    //startDate: "2002/12/22",
    theme: colorTheme,
    inverseButton: false,
    className: "horo dt-picker",
    weeks: true,
    closeOnWithoutClick: false
  });
  $("#hour").datetimepicker({
    datepicker: false,
    format: "H",
    step: 60,
    minTime: "00:00",
    maxTime: "23:59",
    formatTIme: "H:i",
    theme: colorTheme,
    className: "horo hour-picker",
    closeOnWithoutClick: false
  });
  $("#minu").datetimepicker({
    datepicker: false,
    format: "i",
    step: 1,
    minTime: "00:00",
    maxTime: "01:00",
    formatTime: "H:i",
    theme: colorTheme,
    className: "horo minu-picker",
    closeOnWithoutClick: false
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


async function fetchEnvironmentVariables() {
  if (document.getElementById("search_loc").children.length === 0) {
    try {
      const response = await axios.get('/api/environment')
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
        inputCountry = location.properties.country;
        var longi = Math.round(location.properties.lon * 100) / 100;
        document.getElementById("lon").value = longi;
        var lati = Math.round(location.properties.lat * 100) / 100;
        document.getElementById("lat").value = lati;
      });
    } catch (error) {
      console.error('Error fetching environment vars:', error.message);
    }

    let isInputFocused = false;
    const inputField = document.querySelector('.geoapify-autocomplete-input');

    inputField.addEventListener('focus', () => {
      isInputFocused = true;
    });

    inputField.addEventListener('blur', () => {
      isInputFocused = false;
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !isInputFocused) {
        $('#but').click();
      }
    });
  }
}

async function fetchHtmlData() {
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

  await axios.get('/get-html', {
    params
  })
    .then(response => {
      var plotSelector = document.querySelector('#plot-container');
      plotSelector.outerHTML = response.data;
      requestAnimationFrame(() => {
        setDatetimepicker();
        fetchEnvironmentVariables();
        addClickEvents();
        if ($("body").css("background-color") == "rgb(11, 10, 9)") {
          document.getElementById("circularPlot").setAttribute("style", "filter: invert(1);");
          document.getElementById("cartesianPlot").setAttribute("style", "filter: invert(1);");
        } else {
          document.getElementById("circularPlot").setAttribute("style", "filter: invert(0);");
          document.getElementById("cartesianPlot").setAttribute("style", "filter: invert(0);");
        }
      });
      // newWindow.document.open();
      // newWindow.document.write(response.data);
      // newWindow.document.close();

    })
    .catch(error => {
      console.error('Error fetching HTML data:', error.message);
    });
  await axios.get("/create-plot", {
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
      }
      if (input.validity.patternMismatch) {
        countMismatches += 1;
        input.reportValidity();
      }
    });

    if (countMismatches == 0) {
      fetchHtmlData(getUri);
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
    const response = await axios.get('/form');
    document.querySelector('#formEjs').outerHTML = response.data;
  } catch (error) {
    console.error('Error fetching HTML data:', error.message);
  }
}

async function mainFunc() {
  // const $ = jQuery;
  await fetchForm();

  await fetchEnvironmentVariables();
  setDatetimepicker();
  addEventlistener();
  toggleAspects();
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

function toggleAspects() {
  $(".show-aspects").on("mousedown", function (event) {
    event.preventDefault();
    $(".horo.hide").toggle(); // Toggles visibility between "none" and "block"
  });
}