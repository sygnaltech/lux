import flatpickr from 'flatpickr';

function loadFlatpickrCSS(): void {
  if (document.querySelector('link[data-flatpickr-css]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.setAttribute('data-flatpickr-css', '');
  link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
  document.head.appendChild(link);
}

export function initDateFields(): void {
  loadFlatpickrCSS();
  document.querySelectorAll<HTMLInputElement>('[data-type="date"]').forEach((input) => {
    console.log('[date-field] initializing flatpickr on', input);
    flatpickr(input, {
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'd/m/Y',
      allowInput: true,
      maxDate: 'today',
      disableMobile: true,
    });
  });
}
