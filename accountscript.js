////////////////////Registration/////////////////////////
const registerForm = document.getElementById('registerForm');

if(registerForm){
    registerForm.addEventListener('submit', async function(event){
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

            if (!emailPattern.test(formEmail)) {
                registerSuccess.textContent = "Please enter a valid email address.";
                registerSuccess.classList.remove('d-none');
                registerSuccess.classList.add('textError');
                return;
            }

            if (formPassword !== formPassCheck){
                registerSuccess.textContent = 'Passwords do not Match.';
                registerSuccess.classList.remove('d-none');
                registerSuccess.classList.add('textError');
                return
            }

            const user = {
                email: formEmail,
                password: formPassword,
                role: "USER",
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
        const loginSuccess = document.getElementById("loginSuccess");

        try {

            loginSuccess.classList.remove('textError');
            loginSuccess.classList.add('d-none');

            const urlAddress ="https://api.freeapi.app/api/v1/users/login";

            let formUsername = document.forms["loginForm"]["usernameLogin"].value; 
            let formPassword = document.forms["loginForm"]["passwordLogin"].value;

            const user = {
                password: formPassword,
                username: formUsername
            };

            const formData = JSON.stringify(user);
            console.log(formData);

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
                return
            }

            //store the token locally so user can change pages and still stay logged in.
            localStorage.setItem("accessToken", data.data.accessToken);
            document.getElementById("logoutSuccess").classList.add('d-none');
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
        const logoutSuccess = document.getElementById("logoutSuccess")
        event.preventDefault();
        const token = localStorage.getItem("accessToken");
                
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

                 if(document.getElementById("loginSuccess")){
                    document.getElementById("loginSuccess").classList.add('d-none');
                 }

                if(document.getElementById("welcomeUsername")){
                    document.getElementById("welcomeUsername").textContent = 
                `Please log in to view your account.`;
                    document.getElementById("addressList").replaceChildren();

                    document.getElementById("savedAddressMessage").textContent =
                        "Please log in to view addresses.";

                    document.getElementById("addressForm").classList.add("d-none");

                    document.getElementById("addDeliveryMessage").classList.add("d-none");
                }

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
    const logoutSection = document.getElementById("logoutSection");

    if(accountLink){
        if(token) {
            accountLink.textContent = "Account";
            accountLink.href = "account.html"
        } else {
            accountLink.textContent = "Login";
            accountLink.href = "loginpage.html"
        }
    }

    if (logoutSection) {
        logoutSection.classList.toggle('d-none', !token);
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

////////////////////////Saved Addresses/////////////////////////

async function getAddresses(){    
   
    const urlCurrentAddresses = "https://api.freeapi.app/api/v1/ecommerce/addresses?page=1&limit=10"
    const addressError = document.getElementById("addressLoadError")
    
    const addressList = document.getElementById("addressList");
    const token = localStorage.getItem("accessToken");

    addressError.classList.add('d-none')

     try {

        if (!token) {
            addressList.textContent = "Please log in to view your addresses.";
            return;
        }

        const responseAddress = await fetch(urlCurrentAddresses, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }, 
        });                   
            
        const dataAddress = await responseAddress.json();
        console.log(dataAddress);

            /*check response, is 401, invalid token, or 404, user not found, remove current token */
            if (responseAddress.status === 401 || responseAddress.status === 404) {
                localStorage.removeItem("accessToken");                    
                addressError.classList.add('textError');
                addressError.classList.remove('d-none'); 
                addressError.textContent = 'Session invalid. Log in again'
                updateAccountLink();
                return
            }

            if (!responseAddress.ok){
                addressError.classList.add('textError');
                addressError.classList.remove('d-none');
                addressError.textContent = "Unable to fetch address details.";
                return 
            }
            
            
            const addresses = dataAddress.data.addresses;
            /*clear old data*/
            addressList.replaceChildren();

            if (addresses.length === 0) {
                addressList.textContent = "You have no saved addresses.";
                return;
            }

            addresses.forEach(function(address) {

                const card = document.createElement("div");
                card.className = "addressCard";

                const heading = document.createElement("h3");
                heading.className = "h5";
                heading.textContent = "Delivery Address";

                const addressLine1 = document.createElement("p");
                addressLine1.className = "mb-1";
                addressLine1.textContent = address.addressLine1;

                const addressLine2 = document.createElement("p");
                addressLine2.className = "mb-1";
                addressLine2.textContent = address.addressLine2 || "";

                const city = document.createElement("p");
                city.className = "mb-1";
                city.textContent = address.city;

                const state = document.createElement("p");
                state.className = "mb-1";
                state.textContent = address.state;

                const pincode = document.createElement("p");
                pincode.className = "mb-1";
                pincode.textContent = address.pincode;

                const country = document.createElement("p");
                country.className = "mb-0";
                country.textContent = address.country;

                card.append(
                    heading,
                    addressLine1,
                    addressLine2,
                    city,
                    state,
                    pincode,
                    country
                );

                addressList.appendChild(card);
            });
       
    }

    catch (error) {
        console.log(error);
        addressError.textContent = "Unable to load addresses. Please try again.";
        addressError.classList.add('textError');
        addressError.classList.remove('d-none');
    }
}


////////////////////////Add Address/////////////////////////

const addressForm = document.getElementById('addressForm');

if (addressForm) {
    addressForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const addressSuccess = document.getElementById("addressSuccess");
        const addressError = document.getElementById("addressError");
        const pinError = document.getElementById("pinError")

        pinError.classList.add('d-none');

        addressSuccess.classList.add('d-none');
        addressSuccess.classList.remove('textError');
        addressError.classList.add('d-none');

        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                addressError.textContent = "Please log in to save an address.";
                addressError.classList.remove('d-none');
                return;
            }

            /*check PIN is 6 digits*/

            if(document.getElementById("pincode").value.length != 6){
                pinError.textContent = "Pin Error, please enter 6 digit PIN";
                pinError.classList.remove('d-none');
                pinError.classList.add('textError');
                return;               
            };

            const urlAddress = "https://api.freeapi.app/api/v1/ecommerce/addresses";

            const address = {
                addressLine1: document.getElementById("addressLine1").value.trim(),
                addressLine2: document.getElementById("addressLine2").value.trim(),
                city: document.getElementById("city").value.trim(),
                state: document.getElementById("state").value.trim(),
                pincode: Number(document.getElementById("pincode").value),
                country: document.getElementById("country").value
            };
      

            const response = await fetch(urlAddress, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(address)
            });

            const data = await response.json();
            console.log(data);

            addressSuccess.textContent = data.message || "Address saved successfully.";
            addressSuccess.classList.remove('d-none');

            if (!response.ok) {
                addressSuccess.classList.add('textError');
                throw new Error(data.message || "Unable to save address.");
            }

            // Clear the form after a successful save.
            addressForm.reset();

            // Refresh the saved address list.
            await getAddresses();

        } catch (error) {
            console.log(error);

            addressSuccess.textContent =
                "Unable to save address. Please check the details and try again.";
            addressSuccess.classList.add('textError');
            addressSuccess.classList.remove('d-none');
        }
    });
}

////////////////////////Check for account page and run functions/////////////////////////

if (document.getElementById("welcomeUsername")) {
    const token = localStorage.getItem("accessToken");

    if(!token){
        document.getElementById("welcomeUsername").textContent = 
                `Please log in to view your account.`;
        addressList.replaceChildren();
        document.getElementById("savedAddressMessage").textContent =
        `Please log in to view Addresses.`;
        document.getElementById("addDeliveryMessage").classList.add('d-none');
        document.getElementById("addressForm").classList.add('d-none');
    } else{
        getCurrentUser();
        getAddresses();
    }
}
