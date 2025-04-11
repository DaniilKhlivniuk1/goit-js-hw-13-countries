import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';
import { alert, info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const input = document.querySelector('#search-box');
const list = document.querySelector('#country-list');

input.addEventListener('input', debounce(onInput, 500));

function onInput(e) {
  const name = e.target.value.trim();
  list.innerHTML = '';

  if (!name) return;

  fetchCountries(name)
    .then(countries => {
      if (countries.length > 10) {
        info({
          text: 'Too many matches. Please enter a more specific name.',
        });
        return;
      }

      if (countries.length === 1) {
        const country = countries[0];
        list.innerHTML = `
          <h2>${country.name.official}</h2>
          <p><strong>Capital:</strong> ${country.capital}</p>
          <p><strong>Population:</strong> ${country.population}</p>
          <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
          <img src="${country.flags.svg}" alt="Flag" width="200" />
        `;
      } else {
        list.innerHTML = countries
          .map(c => `<p><img src="${c.flags.svg}" width="30" /> ${c.name.official}</p>`)
          .join('');
      }
    })
    .catch(() => {
      alert({ text: 'Country not found' });
    });
}