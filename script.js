const ELEMENT_NAME = {
    INPUT: "input",
    SELECT: "select",
    TEXTAREA: "textarea"
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
    let currentElementType = '';


    // create delete svg element
    const deleteIcon = () => {
        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iconSvg.setAttribute('viewBox', '0 0 448 512');
        iconSvg.setAttribute('width' , '12px');
        iconPath.setAttribute(
            'd',
            "M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
        );
        iconSvg.appendChild(iconPath);
        return iconSvg;
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
            const deleteButton = document.createElement('span');
            deleteButton.appendChild(deleteIcon());
            deleteButton.classList.add('actions');

            deleteButton.addEventListener('click', () => {
                formElements.splice(index, 1);
                renderForm();
            });
            labelWarapper.appendChild(label);
            labelWarapper.appendChild(deleteButton);


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

    // .generic modal function for all element buttons (add labels and placeholders)
    const openModal = (type, label, placeholder) => {
        currentElementType = type;
        document.getElementById("element-name").innerText = currentElementType;
        document.getElementById('modalLabel').value = label;
        document.getElementById('modalPlaceholder').value = placeholder;
        modal.style.display = "block";
    };

    // modal close button
    modalCloseBtns.forEach((button) => {
        button.onclick = function () {
            modal.style.display = "none";
        };
    })


    document.getElementById('add-input').addEventListener('click', () => {
        openModal(ELEMENT_NAME.INPUT, "Sample Label", "Sample Placeholder");
    });

    document.getElementById('add-select').addEventListener('click', () => {
        openModal(ELEMENT_NAME.SELECT, "Sample Label", "Sample Option");
    });

    document.getElementById('add-textarea').addEventListener('click', () => {
        openModal(ELEMENT_NAME.TEXTAREA, "Sample Label", "Sample Placeholder");
    });

    document.getElementById('save-form').addEventListener('click', () => {
        localStorage.setItem("form", JSON.stringify(formElements));
    });


    // on add click to append the form
    addButton.addEventListener('click', () => {
        const newLabel = document.getElementById('modalLabel').value;
        const newPlaceholder = document.getElementById('modalPlaceholder').value;

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
                options: [newPlaceholder]
            });
        } else if (currentElementType === ELEMENT_NAME.TEXTAREA) {
            formElements.push({
                id: Date.now().toString(),
                type: ELEMENT_NAME.TEXTAREA,
                label: newLabel,
                placeholder: newPlaceholder,
            });
        }

        renderForm();
        modal.style.display = "none";
    });

    renderForm();
});

