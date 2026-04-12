import { loadData } from './loadData.js';

const config = {
    postsPerPage: 9,
    filtersDOM: document.querySelector('[data-js="filters"]'),
    listingDOM: document.querySelector('[data-js="listing"]'),
    paginationDOM: document.querySelector('[data-js="pagination"]')
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
    const pillsContainer = config.filtersDOM.querySelector('[data-js="pills"]');

    pillsContainer.querySelector('[data-filter="all"]').addEventListener('click', () => {
        pillsContainer.querySelectorAll('.pill').forEach(pill => {
            pill.classList.remove('pill--active');
        });

        pillsContainer.querySelector('[data-filter="all"]').classList.add('pill--active');

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
    const dropdown = config.filtersDOM.querySelector(`[data-dropdown="${dataType}"]`);

    options.forEach(option => {
        const el = document.createElement('div');
        el.classList.add('dropdown__option');
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
    prev.textContent = '<';

    prev.addEventListener('click', () => {
        if (currentPage > 0) {
            switchPage(currentPage - 1);
        }
    });

    config.paginationDOM.appendChild(prev);

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

        config.paginationDOM.appendChild(btn);
    }

    // Next
    const next = document.createElement('div');
    next.classList.add('pagination__item', 'pagination__item--next');
    next.textContent = '>';

    next.addEventListener('click', () => {
        if (currentPage < numberOfPages - 1) {
            switchPage(currentPage + 1);
        }
    });

    config.paginationDOM.appendChild(next);
};

const switchPage = (pageNumber) => {
    currentPage = pageNumber;
    renderListingItems(posts, currentFilters);
};

const renderListingItems = (listingItems, filters) => {
    const columns = config.listingDOM.querySelectorAll('[data-js="listing-column"]');
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
                Read more
            </a>
        `;

        columns[columnIndex].appendChild(card);
        columnIndex = (columnIndex + 1) % columns.length;
    });

    renderPagination();
    config.filtersDOM.dispatchEvent(uiChange);
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

config.filtersDOM.addEventListener('uiChange', () => {
    if (filteredPosts.length <= config.postsPerPage) {
        config.paginationDOM.classList.add('pagination--hidden');
    } else {
        config.paginationDOM.classList.remove('pagination--hidden');
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