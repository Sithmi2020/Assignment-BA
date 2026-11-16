document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Hamburger Menu Toggle
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // 2. Dark Mode Toggle (Interactive Feature)
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("researchhub_theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeToggle) themeToggle.textContent = "☀️";
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            themeToggle.textContent = isDark ? "☀️" : "🌙";
            localStorage.setItem("researchhub_theme", isDark ? "dark" : "light");
        });
    }

    // 3. Dynamic Portfolio Rendering from JSON + Modal Popup
    const portfolioContainer = document.getElementById("portfolioContainer");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const modal = document.getElementById("projectModal");
    const closeModal = document.getElementById("closeModal");

    let allProjects = [];

    if (portfolioContainer) {
        fetch("projects.json")
            .then(response => {
                if (!response.ok) throw new Error("Failed to load JSON data");
                return response.json();
            })
            .then(data => {
                allProjects = data;
                renderProjects(allProjects);
            })
            .catch(error => {
                portfolioContainer.innerHTML = `<p class="error-msg">Error loading research projects. Please run via Live Server or GitHub Pages.</p>`;
                console.error(error);
            });

        // Filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const category = btn.getAttribute("data-category");
                if (category === "All") {
                    renderProjects(allProjects);
                } else {
                    const filtered = allProjects.filter(p => p.category === category);
                    renderProjects(filtered);
                }
            });
        });
    }

    function renderProjects(projects) {
        portfolioContainer.innerHTML = "";
        projects.forEach(project => {
            const card = document.createElement("article");
            card.className = "card";
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="card-img">
                <div class="card-body">
                    <span class="badge">${project.category}</span>
                    <h3>${project.title}</h3>
                    <p class="project-meta">By ${project.author} (${project.year})</p>
                    <p style="margin-bottom: 1rem;">${project.summary}</p>
                    <button class="read-more-btn" data-id="${project.id}">Read Abstract</button>
                </div>
            `;
            portfolioContainer.appendChild(card);
        });

        // Attach Modal click events
        document.querySelectorAll(".read-more-btn").forEach(button => {
            button.addEventListener("click", () => {
                const projectId = parseInt(button.getAttribute("data-id"));
                const selected = allProjects.find(p => p.id === projectId);
                if (selected && modal) {
                    const modalImg = document.getElementById("modalImage");
                    modalImg.src = selected.image;
                    modalImg.alt = selected.title;
                    document.getElementById("modalCategory").textContent = selected.category;
                    document.getElementById("modalTitle").textContent = selected.title;
                    document.getElementById("modalAuthor").textContent = selected.author;
                    document.getElementById("modalYear").textContent = selected.year;
                    document.getElementById("modalDescription").textContent = selected.details;
                    modal.style.display = "flex";
                }
            });
        });
    }

    if (closeModal && modal) {
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    // 4. Contact Form Validation
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            let isValid = true;

            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("email").value.trim();
            const subject = document.getElementById("subject").value;
            const message = document.getElementById("message").value.trim();

            const nameError = document.getElementById("nameError");
            const emailError = document.getElementById("emailError");
            const subjectError = document.getElementById("subjectError");
            const messageError = document.getElementById("messageError");
            const formSuccess = document.getElementById("formSuccess");

            // Reset errors
            nameError.textContent = "";
            emailError.textContent = "";
            subjectError.textContent = "";
            messageError.textContent = "";
            formSuccess.style.display = "none";

            // Name validation
            if (fullName.length < 3) {
                nameError.textContent = "Please enter your full name (at least 3 characters).";
                isValid = false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailError.textContent = "Please enter a valid email address.";
                isValid = false;
            }

            // Subject validation
            if (subject === "") {
                subjectError.textContent = "Please select an inquiry topic.";
                isValid = false;
            }

            // Message validation
            if (message.length < 20) {
                messageError.textContent = "Message must be at least 20 characters long.";
                isValid = false;
            }

            if (isValid) {
                formSuccess.style.display = "block";
                contactForm.reset();
            }
        });
    }
});