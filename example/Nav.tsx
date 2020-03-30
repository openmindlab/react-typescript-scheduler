import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from "react";
import { CSSProperties } from "react";
import { Link } from "react-router-dom";

interface LinkTabProps {
    label?: string;
    href?: string;
}

function LinkTab(props: LinkTabProps) {
    return (
        <Tab
            component="a"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

type Props = {};

const Nav: React.FC<Props> = () => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const ulStyle: CSSProperties = {
        listStyle: "none",
        margin: "0px",
        padding: "0px",
        width: "auto",
    };
    const liStyle: CSSProperties = {
        float: "left",
        marginLeft: "20px",
    };
    return (<AppBar position="static">
        <Tabs variant="fullWidth" value={value}
            onChange={(handleChange)}>
            <LinkTab label="Basic" href="/" />
            <LinkTab label="Read only" href="/readonly" />
            <LinkTab label="Locale" href="/locale" />
        </Tabs>
        <div>
            <ul style={ulStyle}>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/">
                        <span>Basic</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/readonly">
                        <span>Read only</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/locale">
                        <span>Locale</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/views">
                        <span>Views</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/customheader">
                        <span>Custom header</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/customeventstyle">
                        <span>Custom event style</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/addresource">
                        <span>Add resource</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/draganddrop">
                        <span>Drag&Drop</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/summary">
                        <span>Summary</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/addmore">
                        <span>Add more</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/overlapcheck">
                        <span>Overlap check</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/nocrossslotmove">
                        <span>No cross-slot move</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/freezefirstrow">
                        <span>Freeze first row</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/resourceclickable">
                        <span>Resource clickable</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/customtableheaders">
                        <span>Custom table headers</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/hideweekends">
                        <span>Hide weekends</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/customtimewindow">
                        <span>Custom time window</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/infinitescroll">
                        <span>Infinite scroll</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/infinitescroll2">
                        <span>Infinite scroll 2</span>
                    </Link>
                </li>
                <li style={liStyle}>
                    <Link target="_self"
                        to="/custompopover">
                        <span>Custom popover style</span>
                    </Link>
                </li>
            </ul>
            <div style={{ clear: "both", marginBottom: "24px" }}></div>
        </div></AppBar>
    );
}

export default Nav;
