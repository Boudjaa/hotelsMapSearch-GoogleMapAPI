/* cspell: disable */
// Initialize and add the map
let map;

async function initMap() {
  const center = { lat: -25.344, lng: 131.031 };
  const zoom = 4;
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("mapContainer"), {
    zoom,
    center,
    disableDefaultUI: true,
  });
}

window.initMap = initMap;

const API_KEY = "f92191f125msh8dafb06fd075344p1ec9c4jsna1bac3ab533f";

const fetchCountries = async () => {
  const url =
    "https://wft-geo-db.p.rapidapi.com/v1/geo/countries?currencyCode=EUR&limit=10";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
  }
};

const fetchHotels = async (country) => {
  let marker = [];
  const url = `https://hotels4.p.rapidapi.com/locations/v3/search?q=${country}&locale=de_DE`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    result.sr.map((hotel, index) => {
      const lat = parseFloat(hotel.coordinates.lat);
      const lng = parseFloat(hotel.coordinates.long);
      const position = { lat, lng };
      const label = (index + 1).toString();
      marker = new google.maps.Marker({
        position,
        label,
        map,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

(loudCountries = async () => {
  const countries = await fetchCountries();
  const countriesList = document.getElementById("countries_list");
  const countriesInput = document.getElementById("countries_input");

  for (const country of countries) {
    countriesList.innerHTML += `<li data-country=${country.name}>${country.name}</li>`;
  }

  countriesList.style.display = "none";

  countriesInput.addEventListener("click", (e) => {
    countriesList.style.display = "block";
  });

  const allCountries = Array.from(countriesList.children);

  allCountries.map((country) => {
    country.addEventListener("click", async (e) => {
      const selectedCountry = e.target.dataset.country;
      countriesList.style.display = "none";
      countriesInput.value = selectedCountry;
      hotelsList = await fetchHotels(selectedCountry);
      console.log(hotelsList);
    });
  });
})();
