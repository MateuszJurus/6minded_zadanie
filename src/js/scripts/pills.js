const pillContainers = document.querySelectorAll('[data-js="pills"]');

pillContainers.forEach(pillsContainer => {
    const pills = pillsContainer.querySelectorAll('[data-js="pill"]');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pillsContainer.querySelectorAll('[data-js="pill"]').forEach(pill => {
                pill.classList.remove('pill--active');
            });
            pill.classList.add('pill--active');
        });
    });
});