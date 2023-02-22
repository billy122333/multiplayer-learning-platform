import React, { useState } from 'react';
import { Button } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
export default function Upload_img({ setURL }) {
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
            setURL(e.target.files[0])
        }
    };

    return (

        <>
            <Button variant="outlined" component="label" color='info' startIcon={<PhotoCamera />}>
                Update Image
                <input hidden accept="image/*" type="file" onChange={handleChange} />
            </Button><img src={image} alt="" />
        </>

    );
}