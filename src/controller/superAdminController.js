const { infoMsg } = require("../const/errorHelper");
const adminService = require("../services/superAdminService");

const loginAdmin = async (req, res) => {
  try {
    const adminDetails = req.body ;
    const adminResponse = await adminService.loginAdmin(adminDetails);
    return res.json({ message: infoMsg.ADMIN_LOGIN_SUCCESS, adminResponse})
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const changePassowrd = async(req, res) => {
    try {
        const updateResponse = await adminService.changePassowrd(req.body);
        return res.json({ message: infoMsg.PASSWORD_UPDATE_SUCCESS, updateResponse})
        
    } catch (error) {
    return res.status(500).json({ error: error.message });      
    }
}

module.exports = {
    loginAdmin,
    changePassowrd
}
