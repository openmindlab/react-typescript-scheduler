import * as React from "react";
import { Component, useState } from "react";
import Scheduler, {
    SchedulerData,
    SchedulerViewTypes,
    SchedulerEvent,
} from "../src/Scheduler";
import * as ExampleFunction from "./ExampleFunctions";
import * as moment from "moment";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Button from "antd/lib/button";
import { DemoData } from "./DemoData";
import Nav from "./Nav";
import ViewSrcCode from "./ViewSrcCode";
import withDragDropContext from "./withDnDContext";

class CustomPopoverStyle extends Component<{}, { viewModel: SchedulerData }> {
    constructor(props: Readonly<{}>) {
        super(props);

        const schedulerData = new SchedulerData(ExampleFunction.getNow(), SchedulerViewTypes.Week);
        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.events);
        this.state = {
            viewModel: schedulerData,
        };
    }

    public render() {
        const { viewModel } = this.state;
        return (
            <div>
                <Nav />
                <div>
                    <h3 style={{ textAlign: "center" }}>Custom popover style example<ViewSrcCode srcCodeUrl="https://github.com/StephenChou1017/react-big-scheduler/blob/master/example/CustomPopoverStyle.js" /></h3>
                    <Scheduler schedulerData={viewModel}
                        prevClick={ExampleFunction.prevClick.bind(this)}
                        nextClick={ExampleFunction.nextClick.bind(this)}
                        onSelectDate={ExampleFunction.onSelectDate.bind(this)}
                        onViewChange={ExampleFunction.onViewChange.bind(this)}
                        eventItemClick={ExampleFunction.eventClicked.bind(this)}
                        viewEventClick={ExampleFunction.ops1.bind(this)}
                        viewEventText="Ops 1"
                        viewEvent2Text="Ops 2"
                        viewEvent2Click={ExampleFunction.ops2.bind(this)}
                        updateEventStart={ExampleFunction.updateEventStart.bind(this)}
                        updateEventEnd={ExampleFunction.updateEventEnd.bind(this)}
                        moveEvent={ExampleFunction.moveEvent.bind(this)}
                        newEvent={ExampleFunction.newEvent.bind(this)}
                        eventItemPopoverTemplateResolver={this.eventItemPopoverTemplateResolver}
                        toggleExpandFunc={ExampleFunction.toggleExpandFunc.bind(this)}
                    />
                </div>
            </div>
        );
    }

    public eventItemPopoverTemplateResolver = (schedulerData: SchedulerData, eventItem: SchedulerEvent, title: string, start: moment.Moment, end: moment.Moment, statusColor: string) => {
        return (
            // <React.Fragment>
            //     <h3>{title}</h3>
            //     <h5>{start.format("HH:mm")} - {end.format("HH:mm")}</h5>
            //     <img src="./icons8-ticket-96.png" />
            // </React.Fragment>
            <div style={{ width: "300px" }}>
                <Row type="flex" align="middle">
                    <Col span={2}>
                        <div className="status-dot" style={{ backgroundColor: statusColor }} />
                    </Col>
                    <Col span={22} className="overflow-text">
                        <span className="header2-text" title={title}>{title}</span>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={2}>
                        <div />
                    </Col>
                    <Col span={22}>
                        <span className="header1-text">{start.format("HH:mm")} - {end.format("HH:mm")}</span>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={2}>
                        <div />
                    </Col>
                    <Col span={22}>
                        <Button onClick={() => { this.demoButtonClicked(eventItem); }}>Demo</Button>
                    </Col>
                </Row>
            </div>
        );
    }

    public demoButtonClicked = (eventItem: SchedulerEvent) => {
        alert(`You just clicked demo button. event title: ${eventItem.title}`);
    }
}

export default withDragDropContext(CustomPopoverStyle);
