document.addEventListener('DOMContentLoaded', () => {
  let mobile = document.querySelector('.toggle');
  let link = mobile.firstChild;
  mobile.addEventListener('click', () => {
    if (document.querySelector('.mobile-navlink').classList.contains('active')) {
      document.querySelector('.navbar').classList.remove('full-nav');
      document.querySelectorAll('.mobile-navlink').forEach((element) => {
        element.classList.remove('active');
      });
      link.innerHTML = "<i class='fas fa-bars'></i>";
    } else {
      document.querySelector('.navbar').classList.add('full-nav');
      document.querySelectorAll('.mobile-navlink').forEach((element) => {
        element.classList.add('active');
      });
      link.innerHTML = "<i class='fas fa-times'></i>";
    }
  });
});
