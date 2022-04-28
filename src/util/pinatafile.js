const axios = require('axios');
require('dotenv').config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;
const fs = require('fs');

const FormData = require('form-data');

export const pinFileToIPFS = (fileData) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    data.append('file', fileData);
    return axios.post(url,
        data,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
                'pinata_api_key': key,
                'pinata_secret_api_key': secret
            }
        }
    ).then(function (response) {
        console.log("image Uploaded")
        return {
            success: true,
            pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        };
    }).catch(function (error) {
        console.log(error)
            return {
                success: false,
                message: error.message,
            }
    });
};