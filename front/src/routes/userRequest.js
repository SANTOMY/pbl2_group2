import {serverIP} from './requestConfig';

async function register(userName,email,password){
    const url = serverIP + '/user/register';
    console.log(userName,email,password);
    try{
        let reponse = await fetch(url,{
            mode: 'cors',
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:8080'
            },
            body: JSON.stringify({userName: userName, email: email, password: password})
        });
        return await reponse.json();
    }catch(exception){
        console.log(exception);
        return{success:false, data:exception};
    }
}

export {register};