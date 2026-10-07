//////////////form script details////////////
/////////////////////////////////////////////

const form = document.getElementById('contact_form');

if (form) {
    
    const emailError = document.getElementById('emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneError = document.getElementById('phoneError')

    form.addEventListener('submit', async function(event){

        event.preventDefault();

        let formName = document.forms["contact_form"]["name"].value;
        let formEmail = document.forms["contact_form"]["email"].value;
        let formPhone = document.forms["contact_form"]["phone"].value;
        let formReason = document.forms["contact_form"]["contactReason"].value;
        let formMessage = document.forms["contact_form"]["message"].value;
        let formTerms = document.forms["contact_form"]["terms"].checked;


        if (formName == "") {
            alert("Name must be filled out");
            return;
        }

        if (!emailPattern.test(formEmail)) {
            emailError.classList.remove('d-none');
            return;
        }

        emailError.classList.add('d-none');

        const phoneEdit = formPhone.replace(/\s/g, '')

        if (phoneEdit.length != 10 && phoneEdit.length !=11){
            phoneError.classList.remove('d-none');
            return;
        }

        phoneError.classList.add('d-none');

        if (formReason == ""){
            alert("You must select a reason for your contacting us today");
            return;
        }

        if (formMessage == ""){
            alert("You must enter a message");
            return;
        }
      
        
        if (formTerms == false){        
            alert("You must agree to the terms");
            return;
        }


        const formData = new FormData(form);

        const response = await fetch(form.action, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            alert("Error in sending, please try again. Or email example@email.com");
            return;
        }
        
        form.style.display = 'none';

        document.getElementById('thank-you-message').classList.remove('d-none');
    
    });

    const textarea = document.getElementById("message");
    textarea.addEventListener("input", function() {
        let total_length = this.value.length;
        document.getElementById("char-length").innerText = total_length;
    });

    form.addEventListener('reset', function(){
        document.getElementById("char-length").innerText = "0";
    });

}