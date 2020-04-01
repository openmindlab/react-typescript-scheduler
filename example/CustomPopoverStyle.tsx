import { Button } from '@material-ui/core';
import * as moment from "moment";
import * as React from "react";
import { Component } from "react";
import Col from "../src/grid/Col";
import Row from "../src/grid/Row";
import Scheduler, { SchedulerData, SchedulerEvent, SchedulerViewTypes } from "../src/Scheduler";
import { DemoData } from "./DemoData";
import * as ExampleFunction from "./ExampleFunctions";
import Nav from "./Nav";
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
            <Nav title="Custom popover style example" >
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
            </Nav>
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
