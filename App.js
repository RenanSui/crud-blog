// Selecting Elements
const blogBody = document.querySelector('.blog-body');
const myForm = document.querySelector('.myForm');
const modalForm = document.querySelector('.modalForm');
const modal = document.querySelector('#myModal');
const closeModal = document.querySelector('.close');

const API_URL = 'http://localhost:3000/posts';

// Event listeners
window.addEventListener('DOMContentLoaded', () => fetchAPI());
myForm.addEventListener('submit', (e) => handleSubmit(e));
blogBody.addEventListener('click', (e) => handlePostClick(e));
closeModal.addEventListener('click', () => (modal.style.display = 'none'));
window.addEventListener('click', (e) => {
	if (e.target === modal) {
		modal.style.display = 'none';
	}
});

// Fetch Api
const fetchAPI = async () => {
	const response = await fetch(API_URL);
	let data = await response.json();
	renderPosts(data);
};

// render posts
const renderPosts = (posts) => {
	const newPosts = posts
		.map((item) => {
			return `
            <div class="single-post" id=${item.id}>
                <div class="name delete">
                    <h3>${item.name}</h3>
                    <div>
                        <button class="updateBtn">Update</button>
                        <button class="deleteBtn">Delete</button>
                    </div>
                </div>
                <p>${item.message}</p>
            </div>`;
		})
		.join('');
	blogBody.innerHTML += newPosts;
};

// render new posts
const handleSubmit = (e) => {
	e.preventDefault();
	const name = myForm.querySelector('#first-name').value;
	const message = myForm.querySelector('#blog-message').value;
	const body = { name, message };
	postFetch(body);
};

// create posts
const postFetch = async (form) => {
	const settings = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(form),
	};
	fetch(API_URL, settings);
};

// handle delete or update
const handlePostClick = (e) => {
	const target = e.target.classList.value;
	if (target === 'deleteBtn') {
		const id = e.target.parentElement.parentElement.parentElement.id;
		handleDelete(id);
	} else if (target === 'updateBtn') {
		const id = e.target.parentElement.parentElement.parentElement.id;
		modalData(id);
	}
};

// delete posts
const handleDelete = (id) => {
	fetch(API_URL + '/' + id, { method: 'DELETE' });
};

// update posts
const handleUpdate = (id, data) => {
	fetch(API_URL + '/' + id, {
		method: 'PUT',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	});
};

// update modal
const modalData = (id) => {
	modal.style.display = 'block';
	modalForm.addEventListener('submit', (e) => handleUpdateSubmit(e, id));
};

const handleUpdateSubmit = (e, id) => {
	e.preventDefault();
	const name = modalForm.querySelector('#update-name').value;
	const message = modalForm.querySelector('#update-message').value;
	const body = { name, message };
	handleUpdate(id, body);
};
