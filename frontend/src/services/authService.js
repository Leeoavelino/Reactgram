import { api, requestConfig } from "../utils/config";

//Registrar o usuario no sistema
const register = async(data) => {
    const config = requestConfig("POST", data)

    try {
        const res = await fetch(api + "/users/register", config).then((res) => res.json()).catch((err) => err)
        if(res._id){
            localStorage.setItem("user", JSON.stringify(res))
        }
        return res
    }catch (error) {
        console.log(error)
    }
}

//criando a funçao logout
const logout = () => {
    localStorage.removeItem("user")
}

//funçao para logar o usuario
const login = async(data) => {

    const config = requestConfig("POST" , data)

    try{
        const res = await fetch(api + "/users/login", config).then((res) => res.json()).catch((err) => err)

        if(res._id){
            localStorage.setItem("user", JSON.stringify(res))
        }

        return res

    }catch(error){
        console.log(error)
    }

}

const authService = {
    register,
    logout,
    login,
    
}

export default authService