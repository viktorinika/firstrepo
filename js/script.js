var loadRes, container, addDiv, getUsersBtn, userId = 1, page = 1;

container = document.getElementById('container');
addDiv = document.getElementById('add_div');
loadRes = document.getElementById('load_res');
changeBgBtn = document.getElementById('changeBgBtn');

function createCard(item) {
    const card = document.createElement('div');
    card.className = "card";
    card.setAttribute("id", `id-${item.id}`);

    const name = `${item.first_name} ${item.last_name}`;
    const email = item.email;
    const img_src = item.avatar;

    const newName = document.createElement('span');
    newName.textContent = name;

    const newLink = document.createElement('a');
    newLink.textContent = email;
    newLink.setAttribute("href", `mailto:${email}`);

    const newImg = document.createElement('img');
    newImg.setAttribute("src", img_src);
    card.appendChild(newImg);

    const infoContainer = document.createElement('div');
    infoContainer.setAttribute('class', 'info')

    infoContainer.appendChild(newName);
    infoContainer.appendChild(newLink);

    card.appendChild(infoContainer);
    
    return card;
}

function checkIsAvailableToLoadMore(data) {
    return Array.isArray(data) && data.length > 0 || Object.keys(data).length > 0;
}

window.addEventListener("DOMContentLoaded", () => {
    function randInt(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    function changeBg() {
        const container = document.getElementById('container');
        container.style.background = `rgb(${randInt(0, 255)},${randInt(0, 255)},${randInt(0, 255)})`;
    }

    changeBgBtn.addEventListener('click', changeBg)

    addDiv.addEventListener('click', async function() {
        const response = await getUsers(userId);

        if (response.ok) {
            const { data: userData } = await response.json();            
            const newCard = createCard(userData);

            container.appendChild(newCard);
            userId++;
        } else {
            addDiv.setAttribute("disabled", "disabled");
        }
    });

    loadRes.addEventListener('click', getRes);

    async function getUsers(userId) {
        if(userId) {
            return await fetch(`https://reqres.in/api/users/${userId}`);
        }

        return await fetch(`https://reqres.in/api/users/?page=${page}`);
    }

    async function getRes () {
        const response = await getUsers();

        if (response.ok) {           
            const { data: usersData } = await response.json();

            const isAvailableToLoadMore = checkIsAvailableToLoadMore(usersData);

            if(!isAvailableToLoadMore) {
                loadRes.setAttribute("disabled", "disabled");
            }

            usersData.forEach(item => {
                const newCard = createCard(item);
                container.appendChild(newCard);
            });
            
            page++;
        }
    }

    getRes();
    changeBg();
});
