import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import * as React from "react";
import { useHistory } from "react-router-dom";
import "../src/css/examples.scss";


interface LinkTabProps {
    label?: string;
    href?: string;
}


type Props = {
    title: string
};


const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    }),
);

const Nav: React.FC<Props> = (props) => {

    const history = useHistory();

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    function LinkTab(props: LinkTabProps) {
        return (
            <ListItem button key={props.label}>
                <ListItemText primary={props.label} onClick={() => { history.push(props.href) }} />
            </ListItem>
        );
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {props.title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <LinkTab label="Basic" href="/" />
                    <LinkTab label="Read only" href="/readonly" />
                    <LinkTab label="Locale" href="/locale" />
                    <LinkTab label="Views" href="views" />
                    <LinkTab label="Custom header" href="/customheader" />
                    <LinkTab label="Custom event style" href="/customeventstyle" />
                    <LinkTab label="Add resource" href="/addresource" />
                    <LinkTab label="Drag&Drop" href="/draganddrop" />
                    <LinkTab label="Summary" href="/summary" />
                    <LinkTab label="Add more" href="/addmore" />
                    <LinkTab label="Overlap check" href="/overlapcheck" />
                    <LinkTab label="No cross-slot move" href="/nocrossslotmove" />
                    <LinkTab label="Freeze first row" href="/freezefirstrow" />
                    <LinkTab label="Resource clickable" href="/resourceclickable" />
                    <LinkTab label="Custom table headers" href="/customtableheaders" />
                    <LinkTab label="Hide weekends" href="/hideweekends" />
                    <LinkTab label="Custom time window" href="/customtimewindow" />
                    <LinkTab label="Infinite scroll" href="/infinitescroll" />
                    <LinkTab label="Infinite scroll 2" href="/infinitescroll2" />
                    <LinkTab label="Custom popover style" href="/custompopover" />
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {props.children}
            </main>
        </div>
    );

    // return (<>
    //     <AppBar position="static">
    //         <Typography variant="h3">{props.title}</Typography>
    //     </AppBar>
    //     <Tabs
    //         orientation="vertical"
    //         variant="scrollable"
    //         value={value}
    //         onChange={(handleChange)}>

    //     </Tabs>
    //     <Paper>
    //         {props.children}
    //     </Paper>
    // </>
    // );
}

export default Nav;
