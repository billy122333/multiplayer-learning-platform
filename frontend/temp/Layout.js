import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import Link from '@mui/material/Link';
import ForumIcon from '@mui/icons-material/Forum';
import CreateIcon from '@mui/icons-material/Create';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { useGlobalState } from '../src/global/api/ContextProvider';
import { Device } from '@twilio/voice-sdk';
import { getUsername, refreshToken } from '../src/global/api/getToken'
import Cookies from 'universal-cookie';
import { setCookie } from '../src/global/api/cookie';
const useStyles = makeStyles((theme) => {
    return {
        page: {
            background: '#f9f9f9',
            width: '100%',
            padding: theme.spacing(3),
        },
        root: {
            display: 'flex',
        },
        drawer: {
            width: '14%',
        },
        drawerPaper: {
            width: '14%',
        },
        active: {
            background: '#f4f4f4'
        },
        title: {
            padding: theme.spacing(2),
        },
    }
})

export default function Layout() {
    const classes = useStyles()
    const navigate = useNavigate()
    const [state, setState] = useGlobalState();
    const { username } = state;
    const cookies = new Cookies();


    const menuItems = [
        {
            text: 'Forum',
            icon: <ForumIcon color="secondary" />,
            path: '/forum'
        },
        {
            text: 'Create post',
            icon: <CreateIcon color="secondary" />,
            path: '/forum/create'
        },
    ];
    useEffect(() => {
        refreshToken();
        state.twilioToken ? console.log("Yes") : console.log("No");
    }, [])

    function handleVoiceClick(e) {
        const setupTwillo = (username) => {
            fetch(`/api/token/${username}`)
                .then(response => {
                    return (response.json());
                })
                .then(data => {
                    const twilioToken = data.token;
                    const device = new Device(twilioToken);
                    device.updateOptions(twilioToken, {
                        codecPreferences: ['opus', 'pcmu'],
                        fakeLocalDTMF: true,
                        maxAverageBitrate: 16000
                    });
                    device.on('error', (device) => {
                        console.log("error: ", device);
                    });
                    setState((state) => {
                        console.log(twilioToken);
                        return { ...state, device, twilioToken }
                    });
                }).catch((error) => {
                    console.log(error);
                })
        }
        e.preventDefault();
        setupTwillo(username);
        setTimeout(() => {
            navigate('/roomsList');
        }, 2000);
        //get the access token

    }

    function handleLogout(e) {
        setCookie('refreshTok', undefined);
        setCookie('accessTok', undefined);
        cookies.set('loginToken', false);
    }

    return (
        <div className={classes.root}>

            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{ paper: classes.drawerPaper }}
                anchor="left"
            >
                <div>
                    <Typography variant="h4" className={classes.title}>
                        LearnFun
                    </Typography>
                </div>

                {/* links/list section */}
                <List display="flex">
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                    <ListItem button
                        onClick={handleVoiceClick} >
                        <ListItemIcon><RecordVoiceOverIcon color="primary" /> </ListItemIcon>
                        <ListItemText primary='Voice Room' />
                    </ListItem>
                    <ListItem justify="flex-end">
                        {username ? <Link href="/signin" onClick={handleLogout} variant="body2">Logout</Link> : <Link href="/signin" variant="body2">Login</Link>}
                    </ListItem>
                </List>


            </Drawer>
            <Outlet />
            {/* main content */}
        </div >

    )
}