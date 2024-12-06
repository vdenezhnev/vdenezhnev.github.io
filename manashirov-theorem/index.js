const tabItems = Array.from(document.querySelectorAll(".sadebar__link"));
const contentItemst = Array.from(
  document.querySelectorAll(".main__text__container")
);

const checkItems = Array.from(document.querySelectorAll(".action__list"));

const footerDate = document.querySelector('.footert__year')
footerDate.innerHTML = new Date().getFullYear() + ",";

const authorToggle = document.querySelector(".header__link");
const authorContent = document.querySelector(".author__container");
const authorClose = document.querySelector(".closeModal");

authorToggle.addEventListener("click", () => {
  authorContent.style.display = "block";
});
authorClose.addEventListener("click", () => {
  authorContent.style.display = "none";
});

const clearClass = (element, className = "active") => {
  element.find((item) => item.classList.remove(`${className}`));
};

const setClass = (element, index, className = "active") => {
  element[index].classList.add(`${className}`);

  switch(element[index].getAttribute('data-tab')) {
    case '1':
      document.title = 'Введение и гипотеза';
      break;
    case '3':
      document.title = 'Заключение';
      break;
    case '4':
      document.title = 'Введение и предыстория';
      break;
    default: 
      document.title = 'Введение и гипотеза';
      break;
  }
};

function getTab(){
  return window.location.hash.replace('#', '');
}

const checkoutItems = (item, index) => {
  item.addEventListener("click", () => {
    clearClass(tabItems);
    clearClass(contentItemst);

    setClass(tabItems, index);
    setClass(contentItemst, index);
  });
};
tabItems.forEach(checkoutItems);

if (getTab() != '') {
  tabItems[getTab() - 1].click();
}