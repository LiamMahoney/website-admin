(() => {
    // requesting projects from MongoDB 
    fetch("https://api.liammahoney.dev/projects").then((response) => {
        return response.json();
    }).then((data) => {
        generateAdminView(data);
    }).catch((err) => {
        createAlert("error", "Error (" + err + ") while generating projects").then((alert) => {
            document.querySelector(".project-container").appendChild(alert);
        });
        console.log(err);
    });
})();

/**
 * Creates the Admin UI view. The view consists of a projects section.
 * @param {Object} data the data recieved from the get projects API call
 */
function generateAdminView(data) {
    // creating existing projects
    for (x in data) {
        createProject(data[x]).then((result) => {
            document.querySelector(".project-container").appendChild(result);
        });
    }

    // creating button to add new project
    createAddProject().then((result) => {
        document.querySelector(".project-container").appendChild(result);
    });
}

/**
 * Creates a project UI element that is filled in with the correct information
 * for each project. 
 * @param {Object} project an object holding a project document
 * @returns {Promise} resolves a project HTMLElement object 
 */
function createProject(project) {
    return new Promise((resolve, reject) => {
        let projectContainer = document.createElement("div");
        projectContainer.classList.add("admin-project");
        projectContainer.setAttribute("id", project._id);

        projectContainer.appendChild(createTitleLabel());
        projectContainer.appendChild(createTitle(project.title, project._id));
        projectContainer.appendChild(createDescLabel());
        projectContainer.appendChild(createDescription(project.description, project._id));
        projectContainer.appendChild(createTechLabel());
        projectContainer.appendChild(createTechnologies(project.technologies, project._id));
        projectContainer.appendChild(createLinkLabel());
        projectContainer.appendChild(createLink(project.link, project._id));
        projectContainer.appendChild(createRepoLabel());
        projectContainer.appendChild(createRepo(project.repo, project._id));
        projectContainer.appendChild(createUpdateProjectButton());
        projectContainer.appendChild(createDeleteProjectButton());

        resolve(projectContainer);
    });
}

/**
 * Creates the title of the project label.
 * @returns {HTMLElement} title of the project label
 */
function createTitleLabel() {
    let titleLabel = document.createElement("label");
    titleLabel.innerText = "Title:";
    return titleLabel;
}

/**
 * Creates the input HTML node that holds the title of the project.
 * @returns {HTMLElement} the input object that holds the title of the project
 */
function createTitle(title, id) {
    let titleDiv = document.createElement("input");
    if (id) titleDiv.classList.add(id);
    if (title) titleDiv.setAttribute("value", title);
    titleDiv.setAttribute("id", "title");
    return titleDiv;
}

/**
 * Creates the description of the project label.
 * @returns {HTMLElement} description of the project label
 */
function createDescLabel() {
    let descLabel = document.createElement("label");
    descLabel.innerText = "Description:";
    return descLabel;
}

/**
 * Creates the textarea HTML node that holds the description of the project.
 * @returns {HTMLElement} the textarea object that holds the description of the project
 */
function createDescription(description, id) {
    let descriptionDiv = document.createElement("textarea");
    if (id) descriptionDiv.classList.add(id);
    if (description) descriptionDiv.innerText = description;
    descriptionDiv.setAttribute("id", "description");
    return descriptionDiv;
}

/**
 * Creates the technologies of the project label.
 * @returns {HTMLElement} technologies of the project label
 */
function createTechLabel() {
    let techLabel = document.createElement("label");
    techLabel.innerText = "Technologies (comma separated):";
    return techLabel;
}

/**
 * Creates the input HTML node that holds the techologies used in the project.
 * @returns {HTMLElement} the input field that holds the technologies used in the project
 */
function createTechnologies(technologies, id) {
    let technologiesDiv = document.createElement("input");
    if (id) technologiesDiv.classList.add(id);
    if (technologies) technologiesDiv.setAttribute("value", technologies.toString());
    technologiesDiv.setAttribute("id", "technologies");
    return technologiesDiv;
}

/**
 * Creates the link to the project label.
 * @returns {HTMLElement} link to the project label
 */
function createLinkLabel() {
    let linkLabel = document.createElement("label");
    linkLabel.innerText = "Link to project:";
    return linkLabel;
}

/**
 * Creates the input HTML node that holds the link to the project.
 * @returns {HTMLElement} the input field that holds the link to the project
 */
function createLink(link, id) {
    let linkDiv = document.createElement("input");
    if (id) linkDiv.classList.add(id);
    if (link) linkDiv.setAttribute("value", link);
    linkDiv.setAttribute("id", "link");
    return linkDiv;
}

/**
 * Creates the repository label.
 * @returns {HTMLElement} repository label
 */
function createRepoLabel() {
    let repoLabel = document.createElement("label");
    repoLabel.innerText = "Repository:";
    return repoLabel;
}

/**
 * Creates the input HTML node that holds the repository of the 
 * project.
 * @returns {HTMLElement} the input field that holds the repo link
 */
function createRepo(repo, id) {
    let repoDiv = document.createElement("input");
    if (id) repoDiv.classList.add(id);
    if (repo) repoDiv.setAttribute("value", repo);
    repoDiv.setAttribute("id", "repo");
    return repoDiv;
}

/**
 * Creates the button that is used to update the project.
 * @returns {HTMLElement} the update project button
 */
function createUpdateProjectButton() {
    let button = document.createElement("button");
    button.innerText = "Update Project";
    button.addEventListener("click", updateHandler);
    return button;
}

/**
 * Creates the button that is used to delete the project.
 * @returns {HTMLElement} the delete project button
 */
function createDeleteProjectButton() {
    let delButton = document.createElement("button");
    delButton.innerText = "Delete Project";
    delButton.addEventListener("click", delHandler);
    return delButton;
}

/**
 * Creates the button that is presented when a new project is added
 * to the UI.
 * @returns {HTMLElement} the add project button
 */
function createNewProjectButton() {
    let button = document.createElement("button");
    button.innerText = "Add Project";
    button.addEventListener("click", addNewHandler);
    return button;
}

/**
 * Creates the button that is used to remove a new project from the 
 * DOM.
 */
function createNewDeleteProjectButton() {
    let button = document.createElement("button");
    button.innerText = "Remove Project";
    button.addEventListener("click", removeNewHandler);
    return button;
}

/**
 * Creates a button that will add a blank new project to the UI
 * so a new project can be submitted. 
 * @returns {Promise} resolves the add button
 */
function createAddProject() {
    return new Promise((resolve, reject) => {
        let button = document.createElement("button");
        button.innerText = "Add New Project";
        button.addEventListener("click", addHandler);
        button.classList.add("add-admin-proj");

        resolve(button);
    });
}

/**
 * Hanlder function for when the update project button is clicked.
 * @param {Event} obj the event object from the update button being clicked
 */
function updateHandler(obj) {
    buttonSpinner(obj.target);

    checkProjectInputs(obj.target.parentElement.id).then(() => {
        return getProjectInputs(obj.target.parentElement.id);
    }).then((results) => {
        return sendUpdatedProject(results);
    }).then((result) => {
        displaySuccess(obj.target, result);
        console.log(result);
    }).catch((err) => {
        displayError(obj.target, err);
        console.log(err);
    }).finally(() => {
        obj.target.innerHTML = "Update Project";
    });
}

/**
 * Handler function for when the delete project button is clicked.
 * @param {Event} obj the event object from the delete butotn being clicked
 */
function delHandler(obj) {
    var insertAlertBefore = undefined;
    // getting the location I should put the alert within project-container div
    for (x in obj.target.parentElement.parentElement.children) {
        // finding the index of the project getting deleted
        if (obj.target.parentElement.parentElement.children[x] == obj.target.parentElement) {
            /* This is the object that the alert needs to be inserted before. Won't run into an 
            issue of index out of bounds becuase the 'add new project' button will always be 
            below all of the projects on the page. For some reason the indexes of an HTMLCollection
            are strings, so need to make it an int before adding 1 to it. */
            insertAlertBefore = obj.target.parentElement.parentElement.children[parseInt(x) + 1];
            break;
        }
    }
    deleteProject(obj.target.parentElement.id).then((result) => {
        removeProjectFromUI(obj.target.parentElement.id);
        return createAlert("success", result)
    }).then((alert) => {
        document.querySelector(".project-container").insertBefore(alert, insertAlertBefore);
    }).catch((err) => {
        displayError(obj.target, err);
    });
}

/**
 * Adds a new blank project to the UI
 * @param {Event} obj event object from event listener
 */
function addHandler(obj) {
    let projectContainer = document.createElement("div");
    projectContainer.classList.add("admin-project");
    projectContainer.classList.add("fade-in");

    projectContainer.appendChild(createTitleLabel());
    projectContainer.appendChild(createTitle("", "newProject"));
    projectContainer.appendChild(createDescLabel());
    projectContainer.appendChild(createDescription("", "newProject"));
    projectContainer.appendChild(createTechLabel());
    projectContainer.appendChild(createTechnologies("", "newProject"));
    projectContainer.appendChild(createLinkLabel());
    projectContainer.appendChild(createLink("", "newProject"));
    projectContainer.appendChild(createRepoLabel());
    projectContainer.appendChild(createRepo("", "newProject"));
    projectContainer.appendChild(createNewProjectButton());
    projectContainer.appendChild(createNewDeleteProjectButton());

    document.querySelector(".project-container").insertBefore(projectContainer, obj.target);
}

/**
 * Prepares the UI (for slower connections) and inserts a new project
 * into the database.
 * @param {Event} obj event object from the submit button being clicked
 */
function addNewHandler(obj) {
    buttonSpinner(obj.target);

    checkProjectInputs("newProject").then(() => {
        return getProjectInputs("newProject");
    }).then((results) => {
        return sendNewProject(results);
    }).then((result) => {
        // have to use a different object than the 'insert' button becuase it 
        // gets deleted before the alert is created
        displaySuccess(obj.target.parentElement.children[0], result.inserted);
        console.log(result);
        addIDClass(result._id);
        swapProjectButtons(obj.target);
    }).catch((err) => {
        displayError(obj.target, err);
        console.log(err);
    }).finally(() => {
        obj.target.innerHTML = "Add Project";
    });
}

/**
 * Removes the new project from the DOM.
 * @param {Event} obj event object from pressing button 
 */
function removeNewHandler(obj) {
    obj.target.parentElement.parentElement.removeChild(obj.target.parentElement)
}

/**
 * Checks all of the inputs to make sure there are values entered. 
 * Does not check whether the inputs have changed, I'm getting lazy. 
 * Thought about keeping an array of values while I have them but decided 
 * to favor more readable/reusable code.
 * @param {string} className: the name of the class to check inputs of
 * @returns {Promise} resolves if all of the inputs have a value, rejects on error or if any of the inputs do not have a value. 
 */
function checkProjectInputs(className) {
    return new Promise((resolve, reject) => {
        try {
            // classnames with leading numbers (some might be here) need to 
            // be handled specially for CSS
            let inputs = document.querySelectorAll(`.${CSS.escape(className)}`);

            // looping through inputs checking whitespace trimmed values
            for (x of inputs) {
                if (x.value.trim() === "") {
                    // value is empty
                    reject("All input boxes must have values");
                }
            }

            // all inputs have a value
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Gets all of the inputs from the form and creates a key-pair object
 * to mimic the desired document structure used. 
 * @param {string} className: the name of the class to get inputs of
 * @returns {Promise} resolves all input values, rejects if any errors
 */
function getProjectInputs(className) {
    return new Promise((resolve, reject) => {
        try {
            let inputs = document.querySelectorAll(`.${CSS.escape(className)}`);
            let list = {};

            // creating key-pair object to mimic Mongo document
            for (x of inputs) {
                if (x.id == "technologies") {
                    // splits by comma, trims off white space, and sorts alphabetically
                    list[x.id] = x.value.split(',').map((item) => {
                        return item.trim();
                    }).sort();
                } else {
                    list[x.id] = x.value;
                }
            }

            // not in inputs but needed to API
            list["_id"] = className;

            resolve(list);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Sends the request to update the project.
 * @param {Object} data a project document 
 * @returns {Promise} resolves if the update was successful, rejects otherwise
 */
function sendUpdatedProject(data) {
    return new Promise((resolve, reject) => {
        getToken().then((result) => {
            return fetch("https://api.liammahoney.dev/project", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": result
                },
                body: JSON.stringify(data)
            });
        }).then((response) => {
            if (!response.ok) throw response
            return response.text();
        }).then((resp) => {
            resolve(resp);
        }).catch((response) => {
            try {
                response.text().then((err) => {
                    reject(err);
                });
            } catch (err) {
                // response isn't from fetch api
                reject(response);
            }
        });
    });
}

/**
 * Sends the request to add a new project.
 * @param {Object} data a project document
 */
function sendNewProject(data) {
    return new Promise((resolve, reject) => {
        getToken().then((result) => {
            return fetch("https://api.liammahoney.dev/project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": result
                },
                body: JSON.stringify(data)
            });
        }).then((response) => {
            if (!response.ok) throw response
            return response.json();
        }).then((resp) => {
            resolve(resp);
        }).catch((response) => {
            try {
                response.json().then((err) => {
                    reject(err);
                });
            } catch (err) {
                reject(response);
            }
        });
    });
}

/**
 * @param {HTMLElement} target: the button to change to a spinner
 * TODO: redo, don't want to use font-awesome
 */
function buttonSpinner(target) {
    target.innerHTML = `<div id="loading-spinner"><img src="pics/loading.png"></div>`;
}

/**
 * Creates a success banner with the specified message above the object
 * that is passed in's parent element.
 * @param {HTMLElement} obj a child of the parent element that the message should be displayed above
 * @param {string} message message to display
 */
function displaySuccess(obj, message) {
    createAlert("success", message).then((alert) => {
        // appending to top of admin project
        obj.parentElement.insertBefore(alert, obj.parentElement.children[0]);
    });
}

/**
 * Creates an error banner with the specified message above the object
 * that is passed in's parent element.
 * @param {HTMLElement} obj a child of the parent element that the message should be displayed above
 * @param {string} message message to display
 */
function displayError(obj, message) {
    createAlert("error", message).then((alert) => {
        // appending to top of admin project
        obj.parentElement.insertBefore(alert, obj.parentElement.children[0]);
    });
}

/**
 * Changes the inputs of the admin project to contain the mongo ID as a class
 * and removes the newProject class. Also sets the ID of the project container
 * to the ID passed in.
 * @param {String} ID mongo collection ID 
 */
function addIDClass(ID) {
    let list = document.querySelectorAll('.newProject');

    for (x of list) {
        x.classList.add(ID);
        x.classList.remove("newProject");
    }

    if (list) list[0].parentElement.setAttribute("id", ID);
}

/**
 * Removes the "Add Project" and "Remove Project" buttons (used 
 * for new projects that haven't been submitted yet) and replaces 
 * them with the normal "Update Project" and "Delete Project" 
 * buttons. Removes the buttons by removing the last element
 * of the project. 
 * @param {HTMLElement} target add project button
 */
function swapProjectButtons(target) {
    let projectContainer = target.parentElement;

    let updateButton = createUpdateProjectButton();
    let deleteButton = createDeleteProjectButton();

    // removes the last element -> "remove project" button
    projectContainer.removeChild(projectContainer.children[projectContainer.children.length - 1]);

    // removes the last element -> "add project" button
    projectContainer.removeChild(projectContainer.children[projectContainer.children.length - 1]);

    projectContainer.appendChild(updateButton);
    projectContainer.appendChild(deleteButton);
}

/**
 * Deletes the project associated with the ID.
 * @param {String} id mongo collection ID
 * @returns {Promise} resolves if deleted, rejects otherwise
 */
function deleteProject(id) {
    //FIXME: when getToken rejects, it throws error that response.text is not a function at admin.js:578
    return new Promise((resolve, reject) => {
        getToken().then((result) => {
            return fetch("https://api.liammahoney.dev/project", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": result
                },
                body: JSON.stringify(id)
            });
        }).then((response) => {
            if (!response.ok) throw response
            return response.text();
        }).then((resp) => {
            resolve(resp);
        }).catch((response) => {
            try {
                response.text().then((err) => {
                    reject(err);
                });
            } catch (err) {
                // response isn't from fetch api
                reject(response);
            }
        });
    });
}

/**
 * Removes the project from the UI. 
 * @param {String} id mongo collection ID 
 */
function removeProjectFromUI(id) {
    document.getElementById(id).parentElement.removeChild(document.getElementById(id));
}

/**
 * Gets the token stored in the URL as a query parameter. There should
 * only be one query parameter passed to the admin page, if there are
 * more this function rejects. If the query parameter isn't titled 
 * "token" this function rejects.
 * @returns {Promise} resolves github API token, rejects otherwise
 */
function getToken() {
    return new Promise((resolve, reject) => {
        let params = window.location.search.substring(1).split("&");

        if (params.length > 1) reject("Too many parameters");

        if (params[0].indexOf("token") === -1) reject("token not present");

        resolve(params[0].substring(params[0].indexOf("=") + 1));
    });
}
