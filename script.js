document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const homeButton = document.getElementById('home-btn');
    const addButton = document.getElementById('add-btn');
    const deleteButton = document.getElementById('delete-btn');
    const removeButton = document.getElementById('removeButton');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    const websiteForm = document.getElementById('websiteForm');
    const websiteList = document.getElementById('websiteList');
    const categoryList = document.querySelectorAll('.category-name');

    // Function to load websites from localStorage
    const loadWebsites = () => {
        return JSON.parse(localStorage.getItem('websites')) || [];
    };

    // Function to save websites to localStorage
    const saveWebsites = (websites) => {
        localStorage.setItem('websites', JSON.stringify(websites));
    };

    // Initialize websites array
    let websites = loadWebsites();

    // Function to display websites in the website list
    const displayWebsites = (websitesToDisplay) => {
        websiteList.innerHTML = '';
        websitesToDisplay.forEach((website, index) => {
            const websiteItem = document.createElement('div');
            websiteItem.classList.add('website-item');

            const websiteImage = document.createElement('img');
            websiteImage.src = `https://www.google.com/s2/favicons?domain=${website.link}`;
            websiteImage.alt = website.name;
            websiteImage.height= 22;
            websiteImage.width= 22;

            const websiteName = document.createElement('h2');
            websiteName.textContent = website.name;

            const websiteCategory = document.createElement('h4');
            websiteCategory.textContent = website.category;

            const websiteDescription = document.createElement('p');
            websiteDescription.textContent = website.description;

            const websiteLink = document.createElement('a');
            websiteLink.href = website.link;
            websiteLink.target = "_blank";
            websiteLink.style.textDecoration = 'none';

            const visitIcon = document.createElement('img');
            visitIcon.src = './images/visit.svg';
            visitIcon.width = 20;
            visitIcon.height = 20;
            visitIcon.alt = 'Visit';

            const visitText = document.createElement('span');
            visitText.textContent = 'Visit';
            visitText.style.cssText = 'position: relative; left: 7px; bottom: 5px;';

            const deleteCheckbox = document.createElement('input');
            deleteCheckbox.type = 'checkbox';
            deleteCheckbox.classList.add('delete-checkbox');

            websiteItem.appendChild(websiteImage);
            websiteItem.appendChild(websiteName);
            websiteItem.appendChild(websiteCategory);
            websiteItem.appendChild(websiteDescription);
            websiteItem.appendChild(websiteLink);
            websiteLink.appendChild(visitIcon);
            websiteLink.appendChild(visitText);
            websiteItem.appendChild(deleteCheckbox);

            websiteItem.addEventListener('click', () => {
                websiteItem.classList.toggle('selected');
                deleteCheckbox.checked = websiteItem.classList.contains('selected');
                updateRemoveButtonVisibility();
            });

            websiteList.appendChild(websiteItem);
        });
    };

    // Function to filter websites based on search text
    const filterWebsites = (searchText) => {
        const filteredWebsites = websites.filter(website =>
            website.name.toLowerCase().includes(searchText.toLowerCase()) ||
            website.category.toLowerCase().includes(searchText.toLowerCase()) ||
            website.description.toLowerCase().includes(searchText.toLowerCase()) ||
            website.link.toLowerCase().includes(searchText.toLowerCase())
        );
        displayWebsites(filteredWebsites);
    };

    // Event listener for search button click
    searchButton.addEventListener('click', () => {
        filterWebsites(searchBar.value);
    });

    // Event listener for search input enter key press
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterWebsites(searchBar.value);
        }
    });

    // Event listener for home button click (show all websites)
    homeButton.addEventListener('click', () => {
        displayWebsites(websites);
    });

    // Event listener for add button click (open modal)
    addButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Event listener for modal close button click
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Event listener to close modal if clicked outside of it
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Event listener for website form submission (add new website)
    websiteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewWebsite();
    });

    // Event listeners for Enter key press in form fields
    websiteForm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewWebsite();
        }
    });

    // Function to add a new website
    const addNewWebsite = () => {
        const name = document.getElementById('websiteName').value;
        const category = document.getElementById('websiteCategory').value;
        const link = document.getElementById('websiteLink').value;
        const description = document.getElementById('websiteDescription').value;
        websites.push({ name, category, link, description });
        saveWebsites(websites);
        displayWebsites(websites);
        modal.style.display = 'none';
        websiteForm.reset();
    };

    // Event listener for delete button click (toggle delete checkboxes)
    deleteButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.delete-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.style.display = 'block';
        });

        // Add event listener to hide checkboxes when clicking outside
        window.addEventListener('click', (e) => {
            if (!deleteButton.contains(e.target) && !Array.from(checkboxes).some(checkbox => checkbox.contains(e.target))) {
                checkboxes.forEach(checkbox => {
                    checkbox.style.display = 'none';
                });
            }
        }, { once: true });
    });

    // Event listener for remove button click (delete selected websites)
    removeButton.addEventListener('click', () => {
        const selectedItems = document.querySelectorAll('.website-item.selected');
        selectedItems.forEach(item => {
            const index = Array.from(websiteList.children).indexOf(item);
            websites.splice(index, 1);
        });
        saveWebsites(websites);
        displayWebsites(websites);
        removeButton.style.display = 'none';
    });

    // Function to update visibility of remove button based on selection
    const updateRemoveButtonVisibility = () => {
        const anySelected = document.querySelectorAll('.website-item.selected').length > 0;
        removeButton.style.display = anySelected ? 'block' : 'none';
    };

    // Event listeners for category filters
    categoryList.forEach(category => {
        category.addEventListener('click', () => {
            const categoryText = category.getAttribute('data-category');
            const filteredWebsites = websites.filter(website => website.category === categoryText);
            displayWebsites(filteredWebsites);
        });
    });

    // Initial display of websites
    displayWebsites(websites);
});
