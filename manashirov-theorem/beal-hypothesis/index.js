const checkItems = Array.from(document.querySelectorAll(".action__list"));
const checkContentItems = Array.from(document.querySelectorAll(".hypotheses"));

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
};

const checkListItems = (item, index) => {
    item.addEventListener("click", () => {
        clearClass(checkItems);
        clearClass(checkContentItems);
        
        setClass(checkItems, index);
        setClass(checkContentItems, index);
    });
};

checkItems.forEach(checkListItems);

document.addEventListener("DOMContentLoaded", function() {
    const objects = {
        check_number_tab: {
            check_number_input: document.getElementById('check_number_input'),
            generate_number_btn: document.getElementById('generate_number_btn'), 
            generate_number_2_btn: document.getElementById('generate_number_2_btn'),
            check_hypothesis_btn : document.getElementById('check_hypothesis_btn'),
            clear_number_btn: document.getElementById('clear_number_btn'), 
            find_prime_view_btn: document.getElementById('find_prime_view_btn'),
            correct_answer: document.getElementById('correct_number_answer'),
            wrong_answer: document.getElementById('wrong_number_answer')
        },
        check_hypothesis_tab: {
            check_hypothesis_input_1: document.getElementById('check_hypothesis_input_1'),
            check_hypothesis_input_2: document.getElementById('check_hypothesis_input_2'),
            check_hypothesis_input_3: document.getElementById('check_hypothesis_input_3'),
            check_hypothesis_power_input_1: document.getElementById('check_hypothesis_power_input_1'),
            check_hypothesis_power_input_2: document.getElementById('check_hypothesis_power_input_2'),
            check_hypothesis_power_input_3: document.getElementById('check_hypothesis_power_input_3'),
            generate_powers_btn: document.getElementById('generate_powers_btn'),
            clear_number_btn: document.getElementById('clear_number_2_btn'),
            check_hypothesis_btn: document.getElementById('check_hypothesis_2_btn'),
            begin_again_btn_1: document.getElementById('begin_again_btn_1'),
            begin_again_btn_2: document.getElementById('begin_again_btn_2'),
            correct_answer: document.getElementById('correct_hypothesis_answer'),
            wrong_answer: document.getElementById('wrong_hypothesis_answer')
        }
    }

    function resetAnswer1() {
        objects.check_number_tab.correct_answer.style.display = 'none';
        objects.check_number_tab.wrong_answer.style.display = 'none';
        objects.check_number_tab.find_prime_view_btn.style.display = 'block';
    }

    function resetAnswer2() {
        objects.check_hypothesis_tab.correct_answer.style.display = 'none';
        objects.check_hypothesis_tab.wrong_answer.style.display = 'none';
        objects.check_hypothesis_tab.check_hypothesis_btn.style.display = 'block';
    }

    function resetInputs1() {
        objects.check_number_tab.check_number_input.value = '';
        objects.check_number_tab.clear_number_btn.style.display = 'none';
        objects.check_number_tab.generate_number_btn.style.display = 'block';
    }

    function resetInputs2() {
        objects.check_hypothesis_tab.check_hypothesis_power_input_1.value = '';
        objects.check_hypothesis_tab.check_hypothesis_power_input_2.value = '';
        objects.check_hypothesis_tab.check_hypothesis_power_input_3.value = '';
        objects.check_hypothesis_tab.check_hypothesis_input_1.value = '';
        objects.check_hypothesis_tab.check_hypothesis_input_2.value = '';
        objects.check_hypothesis_tab.check_hypothesis_input_3.value = '';
        objects.check_hypothesis_tab.clear_number_btn.style.display = 'none';
        objects.check_hypothesis_tab.generate_powers_btn.style.display = 'block';
    }

    function reset() {
        resetAnswer1();
        resetAnswer2();
        resetInputs1();
        resetInputs2();
    }

    objects.check_number_tab.check_hypothesis_btn.addEventListener("click", function () {
        document.querySelector(".hypotheses").classList.remove("active");
        document.querySelector(".action__list").classList.remove("active");
        document.querySelector(".action__gepotis").classList.add("active");
        document.querySelector(".hypotheses__check").classList.add("active");
    });

    objects.check_number_tab.generate_number_btn.addEventListener('click', () => {
        resetAnswer1();
        objects.check_number_tab.check_number_input.value = randomNumber(6, 1000);
        objects.check_number_tab.generate_number_btn.style.display = 'none';
        objects.check_number_tab.clear_number_btn.style.display = 'block';
        
    });

    objects.check_number_tab.generate_number_2_btn.addEventListener('click', () => {
        resetAnswer1();
        objects.check_number_tab.check_number_input.value = randomNumber(6, 1000);
        objects.check_number_tab.generate_number_btn.style.display = 'none';
        objects.check_number_tab.clear_number_btn.style.display = 'block';
    });

    objects.check_number_tab.clear_number_btn.addEventListener('click', () => {
        resetAnswer1();
        resetInputs1();
    });

    objects.check_number_tab.find_prime_view_btn.addEventListener('click', () => {
        resetAnswer1();
        resetAnswer2();
        objects.check_number_tab.find_prime_view_btn.style.display = 'none';

        let answer = checkPrimeSum(parseInt(objects.check_number_tab.check_number_input.value));

        if (answer.status == 'correct') {
            objects.check_number_tab.correct_answer.style.display = 'block';
            objects.check_number_tab.correct_answer.querySelector('.answer__text').textContent = answer.message;
            objects.check_hypothesis_tab.check_hypothesis_input_1.value = answer.prime_view[0];
            objects.check_hypothesis_tab.check_hypothesis_input_2.value = answer.prime_view[1];
            objects.check_hypothesis_tab.check_hypothesis_input_3.value = answer.prime_view[2];
        } else {
            objects.check_number_tab.wrong_answer.style.display = 'block';
            objects.check_number_tab.wrong_answer.querySelector('.answer__text').textContent = answer.message;
        }

        prime_view = answer.prime_view;
    });

    objects.check_hypothesis_tab.generate_powers_btn.addEventListener('click', () => {
        resetAnswer2();
        objects.check_hypothesis_tab.check_hypothesis_power_input_1.value = randomNumber(3, 9);
        objects.check_hypothesis_tab.check_hypothesis_power_input_2.value = randomNumber(3, 9);
        objects.check_hypothesis_tab.check_hypothesis_power_input_3.value = randomNumber(3, 9);
        objects.check_hypothesis_tab.generate_powers_btn.style.display = 'none';
        objects.check_hypothesis_tab.clear_number_btn.style.display = 'block';
    });

    objects.check_hypothesis_tab.clear_number_btn.addEventListener('click', () => {
        resetAnswer2();
        objects.check_hypothesis_tab.check_hypothesis_power_input_1.value = '';
        objects.check_hypothesis_tab.check_hypothesis_power_input_2.value = '';
        objects.check_hypothesis_tab.check_hypothesis_power_input_3.value = '';
        objects.check_hypothesis_tab.clear_number_btn.style.display = 'none';
        objects.check_hypothesis_tab.generate_powers_btn.style.display = 'block';
    });

    objects.check_hypothesis_tab.check_hypothesis_btn.addEventListener('click', () => {
        resetAnswer2();
        objects.check_hypothesis_tab.check_hypothesis_btn.style.display = 'none';

        let answer = checkHypothesis(
            parseInt(objects.check_hypothesis_tab.check_hypothesis_input_1.value),
            parseInt(objects.check_hypothesis_tab.check_hypothesis_input_2.value),
            parseInt(objects.check_hypothesis_tab.check_hypothesis_input_3.value),
            parseInt(objects.check_hypothesis_tab.check_hypothesis_power_input_1.value),
            parseInt(objects.check_hypothesis_tab.check_hypothesis_power_input_2.value),
            parseInt(objects.check_hypothesis_tab.check_hypothesis_power_input_3.value)
        );

        if (answer.status == 'correct') {
            objects.check_hypothesis_tab.correct_answer.style.display = 'block';
            objects.check_hypothesis_tab.correct_answer.querySelector('.answer__text').textContent = answer.message;
        } else {
            objects.check_hypothesis_tab.wrong_answer.style.display = 'block';
            objects.check_hypothesis_tab.wrong_answer.querySelector('.answer__text').textContent = answer.message;
        } 
    });

    objects.check_hypothesis_tab.begin_again_btn_1.addEventListener('click', () => {
        reset();
        checkItems[0].click();
    });

    objects.check_hypothesis_tab.begin_again_btn_2.addEventListener('click', () => {
        reset();
        checkItems[0].click();
    });
});