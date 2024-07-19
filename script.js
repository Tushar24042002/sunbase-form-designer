const ELEMENT_NAME = {
    INPUT: "input",
    SELECT: "select",
    TEXTAREA: "textarea"
}

const BUTTON_NAME = {
    ADD: "Add",
    UPDATE: "Update",
}

document.addEventListener('DOMContentLoaded', () => {
    const sampleData = [
        {
            id: "c0ac49c5-871e-4c72-a878-251de465e6b4",
            type: ELEMENT_NAME.INPUT,
            label: "Sample Label",
            placeholder: "Sample placeholder"
        },
        {
            id: "146e69c2-1630-4a27-9d0b-f09e463a66e4",
            type: ELEMENT_NAME.SELECT,
            label: "Sample Label",
            options: ["Sample Option", "Sample Option", "Sample Option"]
        },
        {
            id: "45002ecf-85cf-4852-bc46-529f94a758f5",
            type: ELEMENT_NAME.INPUT,
            label: "Sample Label",
            placeholder: "Sample Placeholder"
        },
        {
            id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
            type: ELEMENT_NAME.TEXTAREA,
            label: "Sample Label",
            placeholder: "Sample Placeholder"
        }
    ];
    const savedForm = localStorage.getItem("form");
    let formElements = JSON.parse(savedForm) || [...sampleData];

    const formContainer = document.getElementById('form-container');
    const modal = document.getElementById("editModal");
    const modalCloseBtns = document.querySelectorAll(".close");
    const addButton = document.getElementById("add-element");
    const addOptionButton = document.getElementById("add-option");
    const optionsContainer = document.getElementById("options-container");
    const optionsList = document.getElementById("options-list");
    const placeholderContainer = document.getElementById("placeholderContainer");

    let currentElementType = '';
    let currentElementIndex = null;


    // create delete svg element
    const deleteIcon = () => {
        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iconSvg.setAttribute('viewBox', '0 0 448 512');
        iconSvg.setAttribute('width', '12px');
        iconPath.setAttribute(
            'd',
            "M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
        );
        iconSvg.appendChild(iconPath);
        return iconSvg;
    }

    // create Edit svg element
    const editIcon = () => {
        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iconSvg.setAttribute('viewBox', '0 0 512 512');
        iconSvg.setAttribute('width', '12px');
        iconPath.setAttribute(
            'd',
            "M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"
        );
        iconSvg.appendChild(iconPath);
        return iconSvg;
    }




    const openEditModal = (element, index) => {
        currentElementIndex = index;
        addButton.innerHTML = BUTTON_NAME.UPDATE;
        openModal(element.type, element.label, element.placeholder || element.options.join(','),  BUTTON_NAME.UPDATE);
    }

    // print the form whenever its called (add , delete)
    const renderForm = () => {
        formContainer.innerHTML = '';
        formElements && formElements.forEach((element, index) => {
            const el = document.createElement('div');
            el.classList.add('form-element');
            el.setAttribute('draggable', true);
            el.dataset.index = index;

            const labelWarapper = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = element.label;
            labelWarapper.classList.add('label-box');

            // add parent div for contain both (DELETE ICON AND EDIT ICON)
            const rightDiv = document.createElement('div');
            rightDiv.classList.add('actions_div');

            // create edit button
            const editButton = document.createElement('span');
            editButton.appendChild(editIcon());
            editButton.classList.add('actions');

            editButton.addEventListener('click', () => {
                openEditModal(element, index);
            });

            // create delete button
            const deleteButton = document.createElement('span');
            deleteButton.appendChild(deleteIcon());
            deleteButton.classList.add('actions');

            deleteButton.addEventListener('click', () => {
                formElements.splice(index, 1);
                renderForm();
            });
            labelWarapper.appendChild(label);
            rightDiv.appendChild(editButton);
            rightDiv.appendChild(deleteButton);
            labelWarapper.appendChild(rightDiv);


            let input;
            if (element.type === ELEMENT_NAME.INPUT) {
                input = document.createElement(ELEMENT_NAME.INPUT);
                input.placeholder = element.placeholder;
            } else if (element.type === ELEMENT_NAME.SELECT) {
                input = document.createElement(ELEMENT_NAME.SELECT);
                element.options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.textContent = option;
                    input.appendChild(opt);
                });
            } else if (element.type === ELEMENT_NAME.TEXTAREA) {
                input = document.createElement(ELEMENT_NAME.TEXTAREA);
                input.placeholder = element.placeholder;
                input.rows = 4;
            }

            const input_wrapper = document.createElement('div');
            input_wrapper.classList.add('input_wrapper');
            input_wrapper.appendChild(input);

            el.appendChild(labelWarapper);
            el.appendChild(input_wrapper);

            formContainer.appendChild(el);


            // for drag the elements
            el.addEventListener('dragstart', () => {
                el.classList.add('dragging');
            });

            el.addEventListener('dragend', () => {
                el.classList.remove('dragging');
                const newIndex = [...formContainer.children].indexOf(el);
                formElements.splice(index, 1);
                formElements.splice(newIndex, 0, element);
                renderForm();
            });

            formContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingElement = document.querySelector('.dragging');
                const afterElement = getDragAfterElement(formContainer, e.clientY);
                if (afterElement == null) {
                    formContainer.appendChild(draggingElement);
                } else {
                    formContainer.insertBefore(draggingElement, afterElement);
                }
            });
        });
    };

    const getDragAfterElement = (container, y) => {
        const draggableElements = [...container.querySelectorAll('.form-element:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };


    // function for open the modal (if edit then set value in inputs)
    const openModal = (type, label, placeholderOrOptions, actionName) => {
        currentElementType = type;
        document.getElementById("element-name").innerText =`${actionName} ${currentElementType}`;
        document.getElementById('modalLabel').value = label;

        if (currentElementType === ELEMENT_NAME.SELECT) {
            placeholderContainer.style.display = "none";
            optionsContainer.style.display = "block";
            optionsList.innerHTML = '';
            const options = placeholderOrOptions.split(',');
            options.forEach(option => {
                addOptionInput(option.trim());
            });
        } else {
            placeholderContainer.style.display = "block";
            optionsContainer.style.display = "none";
            document.getElementById('modalPlaceholder').value = placeholderOrOptions;
        }

        modal.style.display = "block";
    };

    // add option input on click on Add
    const addOptionInput = (value = '') => {
        const optionInput = document.createElement('div');
        optionInput.classList.add('option-input');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        const removeButton = document.createElement('div');
        removeButton.appendChild(deleteIcon());
        removeButton.addEventListener('click', () => {
            optionInput.remove();
        });

        optionInput.appendChild(input);
        optionInput.appendChild(removeButton);
        optionsList.appendChild(optionInput);
    }


    // modal close button
    modalCloseBtns.forEach((button) => {
        button.onclick = function () {
            modal.style.display = "none";
        };
    })


    // on add click to append the form
    const saveChanges = () => {
        const newLabel = document.getElementById('modalLabel').value;
        const newPlaceholder = document.getElementById('modalPlaceholder').value;
        const newOptions = [...optionsList.querySelectorAll('input')].map(input => input.value.trim()).filter(value => value);
        if (currentElementIndex !== null) {
            if (currentElementType === ELEMENT_NAME.INPUT || currentElementType === ELEMENT_NAME.TEXTAREA) {
                formElements[currentElementIndex].label = newLabel;
                formElements[currentElementIndex].placeholder = newPlaceholder;
            } else if (currentElementType === ELEMENT_NAME.SELECT) {
                formElements[currentElementIndex].label = newLabel;
                formElements[currentElementIndex].options = newOptions;
            }
        } else {
            if (currentElementType === ELEMENT_NAME.INPUT) {
                formElements.push({
                    id: Date.now().toString(),
                    type: ELEMENT_NAME.INPUT,
                    label: newLabel,
                    placeholder: newPlaceholder
                });
            } else if (currentElementType === ELEMENT_NAME.SELECT) {
                formElements.push({
                    id: Date.now().toString(),
                    type: ELEMENT_NAME.SELECT,
                    label: newLabel,
                    options: newOptions
                });
            } else if (currentElementType === ELEMENT_NAME.TEXTAREA) {
                formElements.push({
                    id: Date.now().toString(),
                    type: ELEMENT_NAME.TEXTAREA,
                    label: newLabel,
                    placeholder: newPlaceholder,
                });
            }
        }

        renderForm();
        modal.style.display = "none";
        currentElementIndex = null;
    };

    // onclick add option
    const addOption = () => {
        addOptionInput();
    }

    // close the modal by cross and close
    modalCloseBtns.forEach((button) => {
        button.onclick = function () {
            modal.style.display = "none";
        };
    });

    addButton.addEventListener('click', saveChanges);

    addOptionButton.addEventListener('click', addOption);

    document.getElementById('add-input').addEventListener('click', () => {
        currentElementIndex = null;
        addButton.innerHTML = BUTTON_NAME.ADD;
        openModal(ELEMENT_NAME.INPUT, "Sample Label", "Sample Placeholder", BUTTON_NAME.ADD);
    });

    document.getElementById('add-select').addEventListener('click', () => {
        currentElementIndex = null;
        addButton.innerHTML = BUTTON_NAME.ADD;
        openModal(ELEMENT_NAME.SELECT, "Sample Label", "Sample Option",  BUTTON_NAME.ADD);
    });

    document.getElementById('add-textarea').addEventListener('click', () => {
        currentElementIndex = null;
        addButton.innerHTML = BUTTON_NAME.ADD;
        openModal(ELEMENT_NAME.TEXTAREA, "Sample Label", "Sample Placeholder",  BUTTON_NAME.ADD);
    });

    document.getElementById('save-form').addEventListener('click', () => {
        localStorage.setItem("form", JSON.stringify(formElements));
    });




    renderForm();
});

