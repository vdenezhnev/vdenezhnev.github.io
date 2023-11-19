const tabItems = Array.from(document.querySelectorAll('.sadebar__link'));
const contentItemst = Array.from(document.querySelectorAll('.main__text__container'));

const formulTabImes = Array.from(document.querySelectorAll('.formul__item'));
const formulContentItems = Array.from(document.querySelectorAll('.formul__text__container'));

const footerDate = document.querySelector('.footert__year')
footerDate.innerHTML = new Date().getFullYear() + ",";


const authorToggle = document.querySelector('.header__link');
const authorContent = document.querySelector('.author__container')
const authorClose = document.querySelector('.closeModal')

authorToggle.addEventListener('click', () => {
    authorContent.style.display = "block"
})
authorClose.addEventListener('click', () => {
    authorContent.style.display = "none"
    console.log(authorToggle)
})



const clearClass = (element, className = 'active') => {
    element.find(item => item.classList.remove(`${className}`))
}


const setClass = (element, index, className = 'active') => {
    element[index].classList.add(`${className}`)
}

const checkoutItems = (item, index) => {
    item.addEventListener('click', () => {

        clearClass(tabItems)
        clearClass(contentItemst)

        setClass(tabItems, index)
        setClass(contentItemst, index)
    })
}
tabItems.forEach(checkoutItems);

const checkoutFormulItems = (item, index) => {
    item.addEventListener('click', () => {
        console.log(item)

        clearClass(formulTabImes)
        clearClass(formulContentItems)

        setClass(formulTabImes, index)
        setClass(formulContentItems, index)
    })
}
formulTabImes.forEach(checkoutFormulItems)

$('.year__up').on('input', function(){
    if(parseFloat($(this).val()) < parseFloat($(this).attr('data_min_value'))) {
        $(this).val($(this).attr('data_min_value'))
    } 
})