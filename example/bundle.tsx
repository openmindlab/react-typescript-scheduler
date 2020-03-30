import * as React from "react";
import { render } from "react-dom";
import { HashRouter as Router, Route } from "react-router-dom";
import "../src/css/style.css";
import AddMore from "./AddMore";
import AddResource from "./AddResource";
import Basic from "./Basic";
import CustomEventStyle from "./CustomEventStyle";
import CustomHeader from "./CustomHeader";
import CustomPopoverStyle from "./CustomPopoverStyle";
import CustomTableHeaders from "./CustomTableHeaders";
import CustomTimeWindow from "./CustomTimeWindow";
import DragAndDrop from "./DragAndDrop";
import FreezeFirstRow from "./FreezeFirstRow";
import HideWeekends from "./HideWeekends";
import InfiniteScroll from "./InfiniteScroll";
import InfiniteScroll2 from "./InfiniteScroll2";
import Locale from "./Locale";
import NoCrossSlotMove from "./NoCrossSlotMove";
import OverlapCheck from "./OverlapCheck";
import Readonly from "./Readonly";
import ResourceClickable from "./ResourceClickable";
import Summary from "./Summary";
import Views from "./Views";


render((
    <Router>
        <Route exact path="/" component={Basic} />
        <Route path="/readonly" component={Readonly} />
        <Route path="/locale" component={Locale} />
        <Route path="/views" component={Views} />
        <Route path="/customheader" component={CustomHeader} />
        <Route path="/customeventstyle" component={CustomEventStyle} />
        <Route path="/addresource" component={AddResource} />
        <Route path="/draganddrop" component={DragAndDrop} />
        <Route path="/summary" component={Summary} />
        <Route path="/addmore" component={AddMore} />
        <Route path="/overlapcheck" component={OverlapCheck} />
        <Route path="/nocrossslotmove" component={NoCrossSlotMove} />
        <Route path="/freezefirstrow" component={FreezeFirstRow} />
        <Route path="/resourceclickable" component={ResourceClickable} />
        <Route path="/customtableheaders" component={CustomTableHeaders} />
        <Route path="/hideweekends" component={HideWeekends} />
        <Route path="/customtimewindow" component={CustomTimeWindow} />
        <Route path="/infinitescroll" component={InfiniteScroll} />
        <Route path="/infinitescroll2" component={InfiniteScroll2} />
        <Route path="/custompopover" component={CustomPopoverStyle} />
    </Router>
), document.getElementById("root"));
