const response = require('../../Helpers/Response')
const User = require('../../models/users');
const path = require('path');
const validate = require("../../Helpers/Validator");
const uploadUserImage = async (req, res) => {
    const { id } = req.user; 
    try {
        const validation = await validate({id},{id:'required|integer'})
        if(validation.status === 0){
            return response.failed(res,validation.message,null)
        }
        if(validation.status === 1){
        const user = await User.findByPk(id);
        if (!user) return response.failed(res, 'User not found' ,null);     
        user.imagePath = req.file.path; 
        await user.save();

        response.success(res, 'Image uploaded successfully', user );
    }
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload image', error });
    }
};


const getUserImage = async (req, res) => {
    const { id } = req.user;

    try {
        
        const user = await User.findByPk(id);
        if (!user || !user.imagePath) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Return the image URL
        res.status(200).json({
            imageUrl: `http://localhost:2004/uploads/${path.basename(user.imagePath)}` 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve image', error });
    }
};


module.exports ={uploadUserImage,getUserImage}
