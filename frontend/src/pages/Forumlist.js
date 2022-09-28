import React from 'react';
import Axios from '../global/api/Axios';
import { useState, useEffect } from 'react';
import { AccountCircle } from '@mui/icons-material';
// import  from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Typography, Avatar, ListItemAvatar, ListItemText, Divider, ListItem, List } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { getUsername, refreshToken } from '../global/api/getToken';
import { useGlobalState } from '../global/api/ContextProvider';


import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Container, Stack } from '@mui/material';
// components
import Page from '../temp/Page'
import Iconify from '../temp/Iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../temp/dashboard';
// mock
import POSTS from '../_mock/blog';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Popular' },
    { value: 'oldest', label: 'Oldest' },
];


export default function ForumList() {

    const [data, setData] = useState([]);
    const [state, setState] = useGlobalState();
    const navigate = useNavigate();
    async function fetchData() {
        try {
            const response = await Axios.get("api/forum/forum/");
            const data = await response.data;
            const revData = data.reverse()
            setData(revData);

        } catch (err) {
            console.log(err);
        }
    }

    async function handlePostDelete(forumID) {
        console.log(forumID);
        await axios.delete('api/forum/forum/' + forumID + '/');
        fetchData();
    }

    function handleThreadPage(forum) {
        navigate(`/forum/${forum.id}`, { state: forum.id })
    }

    useEffect(() => {
        fetchData();
        refreshToken();
        getUsername().then((res) => res.json())
            .then((res) => {
                setState({ ...state, username: res.user });
            });
    }, [])
    const { username } = state;



    const renderItems = data.map((data, index) => {
        return (
            <div key={index}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        {/* photo */}
                        <Avatar sx={{ bgcolor: 'text.primary' }} >
                            <AccountCircle />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <React.Fragment>
                                <Button onClick={handleThreadPage.bind(this, data)}>
                                    <Typography
                                        sx={{ display: 'inline', fontWeight: 'bold' }}
                                        component="div"
                                        variant="h6"
                                        color="rgba(1,13,133,1)"
                                    >
                                        {data.Post_title}
                                    </Typography>
                                </Button>
                                <div style={{ display: 'flex' }}>
                                    {
                                        username === data.Post_author ?
                                            <Button variant="outlined" startIcon={<DeleteIcon color="error" />} size="small"
                                                onClick={handlePostDelete.bind(this, data.id)} >
                                                Delete
                                            </Button> :
                                            <div></div>
                                    }
                                </div>
                            </React.Fragment>

                        }
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="subtitle1"
                                    color="rgba(128,128,128,1)"
                                >
                                    {data.Post_author}
                                </Typography>
                                <Typography
                                    sx={{ display: 'inline', overflow: 'hidden', wordWrap: 'break-word' }}
                                    component="span"
                                    variant="body1"
                                    color="text.primary"
                                >
                                    &nbsp; - &nbsp; {data.Post_content}
                                </Typography>

                            </React.Fragment>
                        }
                    //Post time {data.Post_created_date}
                    />
                </ListItem>
                <Divider variant="inset" component="li" />
            </div >
        )
    })

    return (
        <List sx={{ width: '100%', maxWidth: "69%", bgcolor: 'background.paper', position: "relative", left: "15%", top: "50px", border: 7, }}>
            {renderItems}
        </List>
    );
}