// let modals = document.getElementsByClassName("modal")

// for (let i = 0; i < modals.length; i++) {
//     const modal = modals[i];
//     console.log(modal);
// }

let buttons = document.querySelectorAll("[modal-id]")

for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    // console.log(button);

    let modalId = button.getAttribute("modal-id")
    let modal = document.getElementById(modalId);

    // console.log(modalId);
    // console.log(modal);

    if (modal != null) {
        button.addEventListener("click", function() {
            modal.style.display = "block";
        });

        let deleteButtons = modal.getElementsByClassName('modal-close');
        let deleteBacks = modal.getElementsByClassName('modal-back');

        for (let j = 0; j < deleteButtons.length; j++) {
            const deleteButton = deleteButtons[j];

            deleteButton.addEventListener("click", function() {
                modal.style.display = "none";
            });
        }

        for (let j = 0; j < deleteBacks.length; j++) {
            const deleteBack = deleteBacks[j];

            deleteBack.addEventListener("click", function() {
                modal.style.display = "none";
            });
        }
    }

}