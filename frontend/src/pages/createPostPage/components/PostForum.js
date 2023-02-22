import React, { useEffect, useState } from 'react';
import FormData from 'form-data';
import { Box, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Axios from '../../../global/api/Axios'
import { useNavigate } from "react-router-dom";
import { useGlobalState } from '../../../global/api/ContextProvider';
import Upload_img from './Upload_img';


export default function PostForum() {
    const [title, setTitle] = useState("");
    const [image_url, setImage_url] = useState("");
    const [content, setContent] = useState("");
    // take username
    const [state] = useGlobalState();
    const { username } = state;

    const navigate = useNavigate();
    // set loading state
    const [loading, setLoading] = useState(false);
    const urls = 'http://127.0.0.1:8000/media/images/'

    // onchange
    function titleOnchange(e) {
        setTitle(e.target.value);
    }
    function contentOnchange(e) {
        setContent(e.target.value);
    }
    const Image_urlOnchange = image_url => {
        setImage_url(image_url);
    }
    // new



    async function submitForm() {
        const form_data = new FormData();
        if (image_url)
            form_data.append("image", image_url, image_url.name);
        form_data.append("Post_author", username);
        form_data.append("Post_title", title);
        form_data.append("Post_content", content);
        form_data.append("is_active", true);

        try {
            console.log('form_data', form_data)
            await Axios.post("/api/forum/forum/", form_data);
        } catch (err) {
            console.log(err);
        }
    }
    function handleSubmit(e) {
        submitForm();
        setLoading(true);
        //await data to post (may change)
        setTimeout(() => {
            navigate('/forum');
        }, 3000);

    }
    return (
        <Box
            alignItems="center"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                '& .MuiTextField-root': { width: '60ch' },
                position: "relative", top: 8,
            }}
        >   <h1 style={{ fontFamily: "Segoe UI" }} >
                Post
            </h1>

            <h3 >
                title
            </h3>
            <TextField label='title' id="Post_title" value={title} onChange={titleOnchange} margin="dense" />
            <h3 >
                content
            </h3>
            <TextField
                id="Post_content"
                label='content'
                multiline
                rows={4}
                value={content}
                onChange={contentOnchange}
            />
            <h3 >
                image
            </h3>
            <Upload_img setURL={setImage_url} />

            <LoadingButton
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                size="large"
                sx={{
                    top: "50px"
                }}
            >
                Save
            </LoadingButton>
        </Box>
    );
}
