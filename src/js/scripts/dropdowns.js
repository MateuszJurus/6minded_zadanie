const dropdownPlaceholders = document.querySelectorAll('[data-js="dropdown-placeholder"]');

dropdownPlaceholders.forEach(dropdownPlaceholder => {
    const dropdownOptions = dropdownPlaceholder.parentElement.querySelector('[data-js="dropdown-options"]');

    dropdownPlaceholder.addEventListener('click', () => {
        dropdownOptions.classList.toggle('dropdown__options--active');
    });
});