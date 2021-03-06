const {info, debug, warning, error} = require("../winston");
const fileLabel = "userController"
const userSQL = require("../database/UserSQL");

module.exports = class LoginController{
    constructor(){
        this.login.bind(this);
    }
    
    async login(req, res){
        const email = req.body.email;
        const password = req.body.password;
        try {
            const result = await userSQL.login(email, password);
            if (result.success) {
                debug(fileLabel, "Successful Authentication " + email);
                return res.status(200).json({"success": true, "data": result}); // success 
            } else {
                info(fileLabel, "Unsuccessful Authentication " + email + ": " + JSON.stringify(result));
                return res.status(400).json({"success": false, "data": result.data}); // fail 
            }
        } catch (exception) {
            error(fileLabel, "Error in attempt to login " + email + ": " + exception);
            return { message: '認証情報と一致するレコードがありません。' };
        }
    }
}
