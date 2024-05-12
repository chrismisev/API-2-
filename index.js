const inputBox = document.querySelector('.input-box');
const info = document.querySelector('.info');
const auto = document.querySelector('.auto');

let repositories;

const debounce = (fn, debounceTime) => {
    let isTimeout;

    return function (...args) {
        clearTimeout(isTimeout);

        isTimeout = setTimeout(() => {
            fn.apply(this, args);
        }, debounceTime);
    };
};

inputBox.addEventListener(
    "input",
    debounce(() => {
        auto.textContent = "";
        const query = inputBox.value.trim();

        if (query !== "") {
            fetchRepo(query)
                .then((repoData) => {
                    repositories = repoData;
                    displayAutocomplete(repoData);
                })
                .catch((error) => {
                    console.error("Ошибка при запросе репозиториев:", error);
                });
        }
    }, 1500)
);

async function fetchRepo(query) {
    const fetchResponse = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
    if (!fetchResponse.ok) {
        throw new Error(`Ошибка HTTP: ${fetchResponse.status}`);
    }
    const fetchData = await fetchResponse.json();
    return fetchData.items;
}

function displayAutocomplete(repositories) {
    repositories.forEach((repo) => {
        let listItemAuto = document.createElement("li");
        listItemAuto.textContent = repo.full_name;
        auto.appendChild(listItemAuto);
    });
}

auto.addEventListener("click", (e) => {
    let listItem = e.target;
    let repoName = listItem.textContent;
    const repo = repositories.find((repo) => repo.full_name === repoName);
    if (repo) {
        displayRepository(repo);
        inputBox.value = "";
        auto.innerHTML = "";
    }
});

function displayRepository(repo) {
    let listItemRepo = document.createElement("li");

    let repoData = {
        name: repo.full_name,
        owner: repo.owner.login,
        stars: repo.stargazers_count,
    };

    let nameRepo = document.createElement("div");
    nameRepo.textContent = `Name: ${repoData.name}`;
    let ownerRepo = document.createElement("div");
    ownerRepo.textContent = `Owner: ${repoData.owner}`;
    let starsRepo = document.createElement("div");
    starsRepo.textContent = `Stars: ${repoData.stars}`;

    let button = createButton(listItemRepo);

    listItemRepo.appendChild(nameRepo);
    listItemRepo.appendChild(ownerRepo);
    listItemRepo.appendChild(starsRepo);
    listItemRepo.appendChild(button);
    info.appendChild(listItemRepo);
}

function createButton(listItemRepo) {
    let button = document.createElement("button");
    button.className = "close-button";

    button.addEventListener("click", () => {
        listItemRepo.remove();
    });

    return button;
} 