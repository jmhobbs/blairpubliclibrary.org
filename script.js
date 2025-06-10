(function () {
  function filterEvents(search) {
    const events = document.querySelectorAll('.event');
    events.forEach((event) => {
      if (event.innerText.toLowerCase().includes(search)) {
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

  window.addEventListener('DOMContentLoaded', function () {
    const input = document.querySelector('input[type="search"]');
    input.addEventListener('input', function (event) {
      const filter = event.target.value.toLowerCase();
      filterEvents(filter);
      hideEmptyDays();
      showNoResultsWarning();
    });
  });
})();
