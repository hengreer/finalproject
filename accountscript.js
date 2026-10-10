////////////////////Registration/////////////////////////
const registerForm = document.getElementById('registerForm');

if(registerForm){
    registerForm.addEventListener('submit', async function(event){
        event.preventDefault();
        try {

            const registerSuccess = document.getElementById("registerSuccess")
            registerSuccess.classList.add('d-none')
            registerSuccess.classList.remove('textError');

            const urlAddress ="https://api.freeapi.app/api/v1/users/register";

            let formEmail = document.forms["registerForm"]["emailRegister"].value; 
            let formPassword = document.forms["registerForm"]["passwordRegister"].value;
            let formUsername = document.forms["registerForm"]["usernameRegister"].value;
            let formPassCheck = document.forms["registerForm"]["passwordRegisterCheck"].value;


            if (formPassword !== formPassCheck){
                registerSuccess.textContent = 'Passwords do not Match.'
                registerSuccess.classList.remove('d-none')
                registerSuccess.classList.add('textError');
                return
            }

            const user = {
                email: formEmail,
                password: formPassword,
                role: "ADMIN",
                username: formUsername
            };

            const formData = JSON.stringify(user)
            console.log(formData)

            const response = await fetch(urlAddress, {
                method: 'POST',
                body: formData,
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const data = await response.json();
            console.log(data)
            
            /*this uses the message to be the response, it will show both successes and failures*/
            let message = data.message

            registerSuccess.textContent = message
            registerSuccess.classList.remove('d-none')

            if (!response.ok){
                registerSuccess.classList.add('textError');
                throw new Error("Unable to fetch Register details");
            }
            
        }

        catch (error) {
            console.log(error);
        }

    })
}

////////////////////////Login/////////////////////////

const loginForm = document.getElementById('loginForm');

if(loginForm){

    loginForm.addEventListener('submit', async function(event){
        event.preventDefault();
        try {

            const loginSuccess = document.getElementById("loginSuccess")
            loginSuccess.classList.remove('textError');
            loginSuccess.classList.add('d-none')

            const urlAddress ="https://api.freeapi.app/api/v1/users/login";

            let formUsername = document.forms["loginForm"]["usernameLogin"].value; 
            let formPassword = document.forms["loginForm"]["passwordLogin"].value;

            const user = {
                password: formPassword,
                username: formUsername
            };

            const formData = JSON.stringify(user)
            console.log(formData)

            const response = await fetch(urlAddress, {
                method: 'POST',
                body: formData,
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const data = await response.json();
            console.log(data)
            console.log(data.data)
            
            /*this uses the message to be the response, it will show both successes and failures*/

            let message = data.message

            loginSuccess.classList.remove('d-none');
            loginSuccess.textContent = message;


            if (!response.ok){                  
                loginSuccess.classList.add('textError');
                localStorage.removeItem("accessToken");
                updateAccountLink();
                throw new Error("Unable to fetch Login details");
            }

            //store the token locally so user can change pages and still stay logged in.
            localStorage.setItem("accessToken", data.data.accessToken);

            updateAccountLink();
            
        }

        catch (error) {
            console.log(error);
            loginSuccess.textContent = "Unable to log in. Please try again.";
            loginSuccess.classList.add('textError');
            loginSuccess.classList.remove('d-none');
        }

    })
}

////////////////////////Logout/////////////////////////

const logoutForm = document.getElementById('logoutForm');

if(logoutForm){
    logoutForm.addEventListener('submit', async function(event){
        event.preventDefault();
        const token = localStorage.getItem("accessToken");
        const logoutSuccess = document.getElementById("logoutSuccess")
        
        try {

            const urlAddress ="https://api.freeapi.app/api/v1/users/logout";            
            logoutSuccess.classList.add('d-none')
            logoutSuccess.classList.remove('textError');   

            if(token){
                const response = await fetch(urlAddress, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();
                console.log(data.data)

                let message = data.message

                logoutSuccess.textContent = message;
                logoutSuccess.classList.remove('d-none');         
                              
                if (!response.ok){
                    logoutSuccess.classList.add('textError');
                    throw new Error("Unable to fetch User details");  
                }

                localStorage.removeItem("accessToken");
                updateAccountLink();


            } else{
                logoutSuccess.textContent = 'You are not currently logged in';
                logoutSuccess.classList.remove('d-none');
                logoutSuccess.classList.add('textError');
            }

        }

        catch (error) {
            console.log(error);
        }
        
    })
}

////////////////////////Loginpage -> Account Page/////////////////////////

function updateAccountLink(){
    const accountLink = document.getElementById("accountLink");
    const token = localStorage.getItem("accessToken");

    if(accountLink){
        if(token) {
            accountLink.textContent = "Account";
            accountLink.href = "account.html"
        } else {
            accountLink.textContent = "Login";
            accountLink.href = "loginpage.html"
        }
    }
}

updateAccountLink();


////////////////////////Current User/////////////////////////

async function getCurrentUser(){

        const token = localStorage.getItem("accessToken");
        
        try {

            const urlAddress ="https://api.freeapi.app/api/v1/users/current-user";
            const usernameError = document.getElementById("usernameError")
            usernameError.classList.add('d-none')

            if(token){
                const response = await fetch(urlAddress, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },                    
                });

                const data = await response.json();
                console.log(data.data)                               
                
                /*check response, is 401, invalid token, or 404, user not found, remove current token */
                if (response.status === 401 || response.status === 404) {
                    localStorage.removeItem("accessToken");                    
                    usernameError.classList.add('textError');
                    usernameError.classList.remove('d-none'); 
                    usernameError.textContent = 'Session invalid. Log in again'
                    updateAccountLink();
                    throw new Error("Session invalid. Log in again.");
                }
 
                if (!response.ok){
                    usernameError.classList.add('textError');
                    usernameError.classList.remove('d-none');
                    throw new Error("Unable to fetch User details");  
                }

                let message = data.message
                usernameError.textContent = message;
                let username = data.data.username;

                document.getElementById("welcomeUsername").textContent = 
                `Welcome, ${username}.`;                
            }else{
                document.getElementById("welcomeUsername").textContent = 
                `Please log in to view your account.`;    

            }
        }

        catch (error) {
            console.log(error);
        }
        
}

if (document.getElementById("welcomeUsername")) {
    getCurrentUser();
}

