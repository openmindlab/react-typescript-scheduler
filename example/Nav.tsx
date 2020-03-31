import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import * as React from "react";
import { useHistory } from "react-router-dom";
import "../src/css/examples.scss";

interface LinkTabProps {
    label?: string;
    href?: string;
}


type Props = {};

const Nav: React.FC<Props> = () => {

    const [value, setValue] = React.useState(0);

    const history = useHistory();

    function LinkTab(props: LinkTabProps) {
        return (
            <Tab
                component="a"
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    history.push(props.href);
                    event.preventDefault();
                }}
                {...props}
            />
        );
    }


    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (<>
        <AppBar position="static">
            <Tabs
                orientation="horizontal"
                variant="scrollable"
                value={value}
                onChange={(handleChange)}>
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
            </Tabs>
        </AppBar>
    </>
    );
}

export default Nav;
