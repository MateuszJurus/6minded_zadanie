// import { loadData } from './loadData.js';

// const config = {
//     postsPerPage: 9,
//     filtersDOM: document.querySelector('[data-js="filters"]'),
//     listingDOM: document.querySelector('[data-js="listing"]')
// }

// class ListingState {
//     constructor(posts = []) {
//         this.posts = posts;
//         this.filters = {
//             type: [],
//             year: [],
//             tag: []
//         };
//         this.filteredPosts = [];
//     }

//     setPosts(posts) {
//         this.posts = posts;
//     }

//     getAvailableFilters() {
//         const filters = {
//             type: new Set(),
//             year: new Set(),
//             tag: new Set()
//         };

//         this.posts.forEach(post => {
//             filters.type.add(post.type);
//             filters.year.add(post.publishedAt.substring(0, 4));
//             filters.tag.add(post.category);
//         });

//         return {
//             type: [...filters.type],
//             year: [...filters.year],
//             tag: [...filters.tag]
//         };
//     }

//     getFilteredPosts() {
//         const posts = this.posts;
        
//         posts.forEach(post => {
//             if (this.filters.type.includes(post.type)) {
//                 if (this.filters.year.includes(post.publishedAt.substring(0, 4))) {
//                     if (this.filters.tag.includes(post.category)) {
//                         this.filteredPosts.push(post);
//                     }
//                 }
//             }
//         });
//         console.log(this.filteredPosts);
//         return this.filteredPosts;
//     }
// }

// class Filters {
//     constructor(container, listingState) {
//         this.containers = {
//             pills: container.querySelector('[data-js="pills"]'),
//             dropdowns: container.querySelector('[data-js="dropdowns"]')
//         };
//         this.listingState = listingState;
//     };

//     renderPillsFilters() {
//         const availablePills = this.listingState.getAvailableFilters().tag;

//         availablePills.forEach(pill => {
//             const pillButton = document.createElement('button');
//             pillButton.classList.add('pill');
//             pillButton.setAttribute('data-js', 'pill');
//             pillButton.setAttribute('data-filter', pill);
//             pillButton.textContent = pill.replace('_', ' ');

//             this.containers.pills.appendChild(pillButton);
//         });

//         this.containers.pills.querySelectorAll('[data-js="pill"]').forEach(pill => {
//             pill.addEventListener('click', () => {
//                 this.containers.pills.querySelectorAll('.pill').forEach(pill => {
//                     pill.classList.remove('pill--active');
//                 });
//                 pill.classList.add('pill--active');
//             });
//         });
//     }

//     renderDropdownFilters(dataType) {
//         const availableDropdownOptions = this.listingState.getAvailableFilters()[dataType];
//         const dropdown = this.containers.dropdowns.querySelector(`[data-dropdown="${dataType}"]`);


//         availableDropdownOptions.forEach(dropdownOption => {
//             const dropdownOptionElement = document.createElement('div');
//             dropdownOptionElement.setAttribute(`data-${dataType}-filter`, dropdownOption);
//             dropdownOptionElement.classList.add('dropdown__option');
//             dropdownOptionElement.textContent = dropdownOption;
//             dropdown.appendChild(dropdownOptionElement);
//             dropdownOptionElement.addEventListener('click', () => {
//                 dropdownOptionElement.classList.toggle('dropdown__option--active');
//             });
//         });
//     }

//     render() {
//         this.renderPillsFilters();
//         this.renderDropdownFilters('type');
//         this.renderDropdownFilters('year');
//     }
// }

// class Listing {
//     constructor(container, listingState) {
//         this.container = container;
//         this.listingState = listingState;
//     }

//     renderListingItems() {
//         const listing = document.querySelector('[data-js="listing"]');
//         const listingColumns = listing.querySelectorAll('[data-js="listing-column"]');
//         const columnsCount = 3;
//         let columnIndex = 0; 

//         this.listingState.posts.forEach(post => {
//             columnIndex === columnsCount ? columnIndex = 0 : null;

//             const card = document.createElement('article');
//             card.classList.add('card');
//             card.setAttribute('data-js', 'card');
//             card.setAttribute('data-id', post.id);

//             const date = document.createElement('span');
//             date.classList.add('card__date');
//             date.textContent = post.publishedAt.substring(0, 10);

//             const title = document.createElement('h2');
//             title.classList.add('card__title');
//             title.textContent = post.title;

//             const text = document.createElement('p');
//             text.classList.add('card__text');
//             text.textContent = post.excerpt;

//             const image = document.createElement('img');
//             image.setAttribute('src', post.imageUrl);
//             image.classList.add('card__image');
//             image.alt = post.title;

//             const button = document.createElement('a');
//             button.setAttribute('href', '#');
//             button.classList.add('button', 'button--link');
//             button.textContent = 'Read more';
//             button.innerHTML += '<span class="button__icons"><svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.800003 12.1137L6.45686 6.45685L0.800002 0.8" stroke="#2554F0" stroke-width="1.6" stroke-linecap="round"/></svg><svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.800003 12.1137L6.45686 6.45685L0.800002 0.8" stroke="#2554F0" stroke-width="1.6" stroke-linecap="round"/></svg></span>';

//             if (post.imageUrl !== '') {
//                 card.appendChild(image);
//             }
//             card.appendChild(date);
//             card.appendChild(title);
//             card.appendChild(text);
//             card.appendChild(button);

//             listingColumns[columnIndex].appendChild(card);
//             columnIndex++;
//         });
//     }
// }

// function changeLoadingState(containers, isLoading) {
//     containers.forEach(container => {
//         container.classList.toggle('loading', isLoading);
//     });
// }


// (function initListing() {
//     changeLoadingState([config.listingDOM, config.filtersDOM], true);
//     loadData().then(data => {
//         const listingState = new ListingState(data);
//         const filters = new Filters(document.querySelector('[data-js="filters"]'), listingState);
//         filters.render();
//         const listing = new Listing(document.querySelector('[data-js="listing"]'), listingState);
//         listing.renderListingItems();
//         changeLoadingState([config.listingDOM, config.filtersDOM], false);
//     });
// })();