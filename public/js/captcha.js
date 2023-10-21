const form  = document.querySelector('form')

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const captchaResponce = grecaptcha.getResponse();

    if (!captchaResponce.length > 0) {
        throw new Error("Captcha not complate");
    }

    const fd = new FormData(e.target);
    const params = new URLSearchParams(fd);

    fetch('http://localhost:3000/register', {
        method : 'POST',
        body : params,
    });
    then(res => res.json())
    .then(data => {
        if (data.captchaSuccess) {
            console.log("Validation successful")
        }
        else {
            console.error("Validation failed");
        }
    })
    .catch(err => console.error(err))
})  