// Admin modal to view announcement details
const openModal = () => {
  let modal = document.querySelector("#popUpModal");
  // Display modal
  modal.style.display = "flex";
  // Close the modal by clicking close x
  let dismissModal = document.querySelector(".close");
  dismissModal.onclick = () => {
    modal.style.display = "none";
  }
  window.onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  }
}
// Admin modal to confirm delete announcement
const deleteAnnouncement = () => {
  let modal = document.querySelector("#confirmation");
  // Display modal
  modal.style.display = "flex";
  // Close the modal
  let dismissModal = document.querySelector(".dismiss");
  dismissModal.onclick = () => {
    modal.style.display = "none";
  }
  window.onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  }
}