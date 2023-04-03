const form = document.querySelector('form');
const body = document.getElementById('body');
const invalidBlocks = document.querySelectorAll('.invalid-feedback');

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const birthdate = document.getElementById('birthDate');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

const invalidFirstName = document.getElementById('invalidFirstName');
const invalidLastName = document.getElementById('invalidLastName');
const invalidBirthData = document.getElementById('invalidBirthDate');
const invalidEmail = document.getElementById('invalidEmail');
const invalidPassword = document.getElementById('invalidPassword');
const invalidConfirmPassword = document.getElementById('invalidConfirmPassword');
const successMessage = document.getElementById('successMessage');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])[A-Za-z0-9!@#$%]+$/;
const currentDate = new Date();

const onBlurValidation = (
    field, invalidBlock, value, errorText, type, condition = undefined
) => {
    if (value.length === 0) {
        invalidBlock.innerText = "Это обязательное поле";
        field.classList.add("error");
        return
    }
    if (type.toString().toUpperCase() === "EMAIL") {

        if (!emailRegex.test(value)) {
            invalidBlock.innerText = errorText;
            field.classList.add("error");
        }
    } else {
        if (condition) {
            invalidBlock.innerText = errorText;
            field.classList.add("error");
        }
    }
}

const onChangeValidation = (
    field, invalidBlock, value, errorText, type, condition = undefined
) => {
    if (value.length === 0) {
        invalidBlock.innerText = "Это обязательное поле";
        field.classList.add("error");
        return
    }
    if (type.toString().toUpperCase() === "EMAIL") {

        if (emailRegex.test(value)) {
            field.classList.remove('error');
            invalidBlock.innerText = "";
        }
    } else {
        if (!condition) {
            field.classList.remove('error');
            invalidBlock.innerText = "";
        }
    }
}


form.addEventListener('submit', async (event) => {
    const firstNameValue = form.elements.firstName.value;
    const lastNameValue = form.elements.lastName.value;
    const birthDateValue = form.elements.birthDate.value;
    const emailValue = form.elements.email.value;
    const passwordValue = form.elements.password.value;
    const confirmPasswordValue = form.elements.confirmPassword.value;

    let errors = [];

    Array.prototype.slice.call(form).forEach((field) => {
        if (field.name === "firstName") {
            onChangeValidation(
                firstName,
                invalidFirstName,
                firstNameValue,
                "Имя должно содержать от 2 до 25 символов",
                "text",
                firstNameValue.length < 2 || firstNameValue.length > 25,
            )
        }
        if (field.name === "lastName") {
            onChangeValidation(
                lastName,
                invalidLastName,
                lastNameValue,
                "Фамилия должна содержать от 2 до 25 символов",
                "text",
                lastNameValue.length < 2 || lastNameValue.length > 25,
            )
        }
        if (field.name === "birthDate") {
            const selectedDate = new Date(birthDateValue);

            onChangeValidation(
                birthdate,
                invalidBirthData,
                birthDateValue,
                "Неправильно указана дата рождения",
                "date",
                selectedDate > currentDate,
            )
        }
        if (field.name === "email") {
            onChangeValidation(
                email,
                invalidEmail,
                emailValue,
                "Невалидный адрес электронной почты",
                "email",
            )
        }
        if (field.name === "password") {
            onChangeValidation(
                password,
                invalidPassword,
                passwordValue,
                "Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ из !@#$%",
                "password",
                passwordValue.length < 8 || !passwordRegex.test(passwordValue),
            )
        }
        if (field.name === "confirmPassword") {
            const passwordValue = form.elements.password.value;

            onChangeValidation(
                confirmPassword,
                invalidConfirmPassword,
                confirmPasswordValue,
                "Подтверждение пароля не совпадает с паролем",
                "password",
                passwordValue !== confirmPasswordValue,
            )
        }

    })

    Array.prototype.slice.call(invalidBlocks).forEach((block) => {
        if (block.innerText.length) {
            errors.push(block.innerText)
        }
    })

    if (errors.length > 0) {
        event.preventDefault();
    } else {
        event.preventDefault();
        const data = {}

        Array.prototype.slice.call(form).forEach((field) => {
            if (field.type.toUpperCase() !== 'SUBMIT') {
                data[`${field.name}`] = field.value
            }
        });

        try {
            const resp = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            const respData = await resp.json();
            console.log(respData);
            form.reset();
            successMessage.innerText = "Регистрация прошла успешно";
        } catch (e) {
            console.log(e.message);
            successMessage.innerText = e.message;
        }
    }
});

// first name
firstName.addEventListener('input', (e) => {
    onChangeValidation(
        firstName,
        invalidFirstName,
        e.currentTarget.value,
        "Имя должно содержать от 2 до 25 символов",
        "text",
        e.currentTarget.value.length < 2 || e.currentTarget.value.length > 25,
    )
});
firstName.addEventListener('blur', (e) => {
    onBlurValidation(
        // onChangeValidation(
        firstName,
        invalidFirstName,
        e.currentTarget.value,
        "Имя должно содержать от 2 до 25 символов",
        "text",
        e.currentTarget.value.length < 2 || e.currentTarget.value.length > 25,
    )
});

// last name
lastName.addEventListener('input', (e) => {
    onChangeValidation(
        lastName,
        invalidLastName,
        e.currentTarget.value,
        "Фамилия должна содержать от 2 до 25 символов",
        "text",
        e.currentTarget.value.length < 2 || e.currentTarget.value.length > 25,
    )
});
lastName.addEventListener('blur', (e) => {
    onBlurValidation(
        lastName,
        invalidLastName,
        e.currentTarget.value,
        "Фамилия должна содержать от 2 до 25 символов",
        "text",
        e.currentTarget.value.length < 2 || e.currentTarget.value.length > 25,
    )
});

// birthdate
birthdate.addEventListener('input', (e) => {
    const selectedDate = new Date(e.currentTarget.value);

    onChangeValidation(
        birthdate,
        invalidBirthData,
        e.currentTarget.value,
        "Неправильно указана дата рождения",
        "date",
        selectedDate > currentDate,
    )
});
birthdate.addEventListener('blur', (e) => {
    const selectedDate = new Date(e.currentTarget.value);

    onBlurValidation(
        birthdate,
        invalidBirthData,
        e.currentTarget.value,
        "Неправильно указана дата рождения",
        "date",
        selectedDate > currentDate,
    )
});

// email
email.addEventListener('input', (e) => {
    onChangeValidation(
        email,
        invalidEmail,
        e.currentTarget.value,
        "Невалидный адрес электронной почты",
        "email",
    )
});
email.addEventListener('blur', (e) => {
    onBlurValidation(
        email,
        invalidEmail,
        e.currentTarget.value,
        "Невалидный адрес электронной почты",
        "email",
    )
});

// password
password.addEventListener('input', (e) => {
    onChangeValidation(
        password,
        invalidPassword,
        e.currentTarget.value,
        "Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ из !@#$%",
        "password",
        e.currentTarget.value.length < 8 || !passwordRegex.test(e.currentTarget.value),
    )
});
password.addEventListener('blur', (e) => {
    onBlurValidation(
        password,
        invalidPassword,
        e.currentTarget.value,
        "Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ из !@#$%",
        "password",
        e.currentTarget.value.length < 8 || !passwordRegex.test(e.currentTarget.value),
    )
});

// confirm password
confirmPassword.addEventListener('input', (e) => {
    const passwordValue = form.elements.password.value;

    onChangeValidation(
        confirmPassword,
        invalidConfirmPassword,
        e.currentTarget.value,
        "Подтверждение пароля не совпадает с паролем",
        "password",
        passwordValue !== e.currentTarget.value,
    )
});
confirmPassword.addEventListener('blur', (e) => {
    const passwordValue = form.elements.password.value;

    onBlurValidation(
        confirmPassword,
        invalidConfirmPassword,
        e.currentTarget.value,
        "Подтверждение пароля не совпадает с паролем",
        "password",
        passwordValue !== e.currentTarget.value,
    )
});

body.addEventListener("click", () => {
    successMessage.innerText = "";
});
