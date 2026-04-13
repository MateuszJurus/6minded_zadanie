import { loadData } from './loadData.js';

const config = {
    postsPerPage: 9,
    filtersDOM: document.querySelector('[data-js="filters"]'),
    listingDOM: document.querySelector('[data-js="listing"]'),
    paginationDOM: document.querySelector('[data-js="pagination"]'),
    noResultsDOM: document.querySelector('[data-js="noresoults"]')
}

let currentFilters = {
    type: [],
    year: [],
    tag: []
}

let posts = [];
let filteredPosts = [];
let currentPage = 0;

const uiChange = new CustomEvent('uiChange', {});

const renderTagFilters = (tags) => {
    const pillsContainer = config.filtersDOM?.querySelector('[data-js="pills"]');

    pillsContainer?.querySelector('[data-filter="all"]').addEventListener('click', () => {
        pillsContainer?.querySelectorAll('.pill').forEach(pill => {
            pill.classList.remove('pill--active');
        });

        pillsContainer?.querySelector('[data-filter="all"]').classList.add('pill--active');

        updateFilters('tag', 'All');
    });

    tags.forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.classList.add('pill');
        tagButton.setAttribute('data-filter', tag);
        tagButton.textContent = tag.replaceAll('_', ' ');

        tagButton.addEventListener('click', () => {
            if (tagButton.classList.contains('pill--active')) {
                return;
            }

            pillsContainer.querySelectorAll('.pill').forEach(pill => {
                pill.classList.remove('pill--active');
            });

            tagButton.classList.add('pill--active');
            updateFilters('tag', tag);
        });

        pillsContainer.appendChild(tagButton);
    });
};

const renderDropdownFilters = (dataType, options) => {
    const dropdown = config.filtersDOM?.querySelector(`[data-dropdown="${dataType}"]`);

    options.forEach(option => {
        const el = document.createElement('div');
        el.classList.add('dropdown__option');
        el.setAttribute('data-js', 'dropdown-option');
        el.textContent = option;

        el.addEventListener('click', () => {
            el.classList.toggle('dropdown__option--active');
            updateFilters(dataType, option);
        });

        dropdown.appendChild(el);
    });
};

const renderFilters = (listingItems) => {
    const filters = {
        type: new Set(),
        year: new Set(),
        tag: new Set()
    };

    listingItems.forEach(post => {
        filters.type.add(post.type);
        filters.year.add(post.publishedAt.substring(0, 4));
        filters.tag.add(post.category);
    });

    renderTagFilters([...filters.tag]);
    renderDropdownFilters('type', [...filters.type]);
    renderDropdownFilters('year', [...filters.year]);
};

const renderPagination = () => {
    config.paginationDOM.innerHTML = '';

    const numberOfPages = Math.ceil(filteredPosts.length / config.postsPerPage);

    // Prev
    const prev = document.createElement('div');
    prev.classList.add('pagination__item', 'pagination__item--previous');
    prev.innerHTML = '<svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.07123 14.4355C7.6807 14.826 7.04671 14.826 6.65619 14.4355L0.292908 8.07124C-0.0976162 7.68072 -0.0976162 7.0477 0.292908 6.65718L6.65619 0.292922C7.04671 -0.0976019 7.6807 -0.0976019 8.07123 0.292922C8.46149 0.683316 8.46129 1.31647 8.07123 1.70698L3.414 6.36421L22.5029 6.36421C23.0552 6.36421 23.5029 6.81193 23.5029 7.36421C23.5029 7.9165 23.0552 8.36421 22.5029 8.36421L3.414 8.36421L8.07123 13.0214C8.46129 13.412 8.46149 14.0451 8.07123 14.4355Z" fill="#070C1E"/></svg>';

    prev.addEventListener('click', () => {
        if (currentPage > 0) {
            switchPage(currentPage - 1);
        }
    });

    config.paginationDOM?.appendChild(prev);

    // Numbers
    for (let i = 0; i < numberOfPages; i++) {
        const btn = document.createElement('div');
        btn.classList.add('pagination__item');

        if (i === currentPage) {
            btn.classList.add('active');
        }

        btn.textContent = i + 1;

        btn.addEventListener('click', () => {
            if (i !== currentPage) {
                switchPage(i);
            }
        });

        config.paginationDOM?.appendChild(btn);
    }

    // Next
    const next = document.createElement('div');
    next.classList.add('pagination__item', 'pagination__item--next');
    next.innerHTML = '<svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.4316 0.292895C15.8222 -0.0976297 16.4562 -0.0976296 16.8467 0.292895L23.21 6.65715C23.6005 7.04768 23.6005 7.68069 23.21 8.07122L16.8467 14.4355C16.4562 14.826 15.8222 14.826 15.4316 14.4355C15.0414 14.0451 15.0416 13.4119 15.4316 13.0214L20.0889 8.36418L0.999999 8.36418C0.447714 8.36418 -6.92079e-07 7.91647 -6.43797e-07 7.36418C-5.95515e-07 6.8119 0.447715 6.36418 0.999999 6.36418L20.0889 6.36418L15.4316 1.70696C15.0416 1.31644 15.0414 0.683289 15.4316 0.292895Z" fill="#070C1E"/></svg>';

    next.addEventListener('click', () => {
        if (currentPage < numberOfPages - 1) {
            switchPage(currentPage + 1);
        }
    });

    config.paginationDOM?.appendChild(next);
};

const switchPage = (pageNumber) => {
    currentPage = pageNumber;
    renderListingItems(posts, currentFilters);
};

const renderListingItems = (listingItems, filters) => {
    const columns = config.listingDOM?.querySelectorAll('[data-js="listing-column"]');
    columns.forEach(col => col.innerHTML = '');

    let result = listingItems;
    if (filters.type.length || filters.year.length || filters.tag.length) {
        result = listingItems.filter(post =>
            (!filters.type.length || filters.type.includes(post.type)) &&
            (!filters.year.length || filters.year.includes(post.publishedAt.substring(0, 4))) &&
            (!filters.tag.length || filters.tag.includes(post.category))
        );
    }

    filteredPosts = result;
    if (filteredPosts.length === 0) {
        config.noResultsDOM?.classList.add('active');
        return;
    } else {
        config.noResultsDOM?.classList.remove('active');
    }

    const start = currentPage * config.postsPerPage;
    const end = start + config.postsPerPage;
    const paginatedItems = result.slice(start, end);

    let columnIndex = 0;

    paginatedItems.forEach(post => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            ${post.imageUrl ? `<img src="${post.imageUrl}" class="card__image" alt="${post.title}">` : ''}
            <span class="card__date">${post.publishedAt.substring(0, 10)}</span>
            <h2 class="card__title">${post.title}</h2>
            <p class="card__text">${post.excerpt}</p>
            <a href="#" class="button button--link">
                Read more<span class="button__icons"><svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.800003 12.1137L6.45686 6.45685L0.800002 0.8" stroke="#2554F0" stroke-width="1.6" stroke-linecap="round"/></svg><svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.800003 12.1137L6.45686 6.45685L0.800002 0.8" stroke="#2554F0" stroke-width="1.6" stroke-linecap="round"/></svg></span>
            </a>
        `;

        columns[columnIndex].appendChild(card);
        columnIndex = (columnIndex + 1) % columns.length;
    });

    renderPagination();
    config.filtersDOM?.dispatchEvent(uiChange);
};

const updateFilters = (dataType, value) => {
    if (dataType === 'tag') {
        if (value === 'All') {
            currentFilters.tag = [];
        } else {
            currentFilters = currentFilters[dataType][0] === value
                ? { ...currentFilters, [dataType]: [] }
                : { ...currentFilters, [dataType]: [value] };
        }
    } else {
        currentFilters = currentFilters[dataType].includes(value)
            ? { ...currentFilters, [dataType]: currentFilters[dataType].filter(v => v !== value) }
            : { ...currentFilters, [dataType]: [...currentFilters[dataType], value] };
    }

    currentPage = 0;
    renderListingItems(posts, currentFilters);
};

config.filtersDOM?.addEventListener('uiChange', () => {
    if (filteredPosts.length <= config.postsPerPage) {
        config.paginationDOM?.classList.add('pagination--hidden');
    } else {
        config.paginationDOM?.classList.remove('pagination--hidden');
    }
});

const loadingStateAnimation = (loadingState, elements) => {
    if (loadingState) {
        elements.forEach(element => {
            element.classList.add('loading');
            const loadingAnimation = document.createElement('div');
            const loadingAnimationDot1 = document.createElement('div');
            const loadingAnimationDot2 = document.createElement('div');
            const loadingAnimationDot3 = document.createElement('div');

            loadingAnimation.classList.add('loading__animation');
            loadingAnimationDot1.classList.add('loading__dot');
            loadingAnimationDot2.classList.add('loading__dot');
            loadingAnimationDot3.classList.add('loading__dot');
            
            loadingAnimation.appendChild(loadingAnimationDot1);
            loadingAnimation.appendChild(loadingAnimationDot2);
            loadingAnimation.appendChild(loadingAnimationDot3);
            element.appendChild(loadingAnimation);
        });
    } else {
        elements.forEach(element => {
            element.classList.remove('loading');
            element.querySelectorAll('.loading__animation').forEach(loadingAnimation => {
                loadingAnimation.remove();
            });
        });
    }
};

loadingStateAnimation(true, [config.listingDOM, config.filtersDOM]);
loadData().then(data => {
    posts = data;

    renderFilters(data);
    renderListingItems(data, currentFilters);
    loadingStateAnimation(false, [config.listingDOM, config.filtersDOM]);
}).catch(err => {
    console.error(err);
});