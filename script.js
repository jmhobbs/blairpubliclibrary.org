(function () {
  const AGE_PARAM = 'ages';

  function ageBounds(element) {
    const { ageMin, ageMax } = element.dataset;
    return {
      min: Number(ageMin),
      max: ageMax === undefined ? Infinity : Number(ageMax),
    };
  }

  function matchesAgeGroups(event, ageGroups) {
    if (ageGroups.length === 0 || event.dataset.ageMin === undefined) {
      return true;
    }
    const eventAges = ageBounds(event);
    return ageGroups.some((group) => {
      const groupAges = ageBounds(group);
      return eventAges.min <= groupAges.max && eventAges.max >= groupAges.min;
    });
  }

  function filterEvents(search, ageGroups) {
    const events = document.querySelectorAll('.event');
    events.forEach((event) => {
      if (
        event.innerText.toLowerCase().includes(search) &&
        matchesAgeGroups(event, ageGroups)
      ) {
        event.classList.remove('hidden');
      } else {
        event.classList.add('hidden');
      }
    });
  }

  function hideEmptyDays() {
    const days = document.querySelectorAll('.day');
    days.forEach((day) => {
      if (day.querySelector('.event:not(.hidden)')) {
        day.classList.remove('hidden');
      } else {
        day.classList.add('hidden');
      }
    });
  }

  function showNoResultsWarning() {
    const noEvents = document.getElementById('no-events');
    if (document.querySelector('.day:not(.hidden)')) {
      noEvents.classList.add('hidden');
    } else {
      noEvents.classList.remove('hidden');
    }
  }

  function selectedAgeGroups() {
    return [
      ...document.querySelectorAll('[data-age-group][aria-pressed="true"]'),
    ];
  }

  function saveAgeGroupsToURL(ageGroups) {
    const url = new URL(window.location.href);
    if (ageGroups.length === 0) {
      url.searchParams.delete(AGE_PARAM);
    } else {
      url.searchParams.set(
        AGE_PARAM,
        ageGroups.map((group) => group.dataset.ageGroup).join(','),
      );
    }
    window.history.replaceState(null, '', url);
  }

  function restoreAgeGroupsFromURL(buttons) {
    const params = new URLSearchParams(window.location.search);
    const saved = (params.get(AGE_PARAM) || '').split(',');
    buttons.forEach((button) => {
      button.setAttribute(
        'aria-pressed',
        String(saved.includes(button.dataset.ageGroup)),
      );
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    const input = document.querySelector('input[type="search"]');
    const buttons = document.querySelectorAll('[data-age-group]');

    function update() {
      filterEvents(input.value.toLowerCase(), selectedAgeGroups());
      hideEmptyDays();
      showNoResultsWarning();
    }

    input.addEventListener('input', update);
    buttons.forEach((button) => {
      button.addEventListener('click', function () {
        const pressed = button.getAttribute('aria-pressed') === 'true';
        button.setAttribute('aria-pressed', String(!pressed));
        saveAgeGroupsToURL(selectedAgeGroups());
        update();
      });
    });

    restoreAgeGroupsFromURL(buttons);
    update();
  });
})();
