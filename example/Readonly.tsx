import Typography from '@material-ui/core/Typography';
import 'moment';
import * as React from "react";
import { Component } from "react";
import Scheduler, { SchedulerData, SchedulerViewTypes } from "../src/Scheduler";
import { DemoData } from "./DemoData";
import * as ExampleFunction from "./ExampleFunctions";
import Nav from "./Nav";
import withDragDropContext from "./withDnDContext";



class Readonly extends Component<{}, { viewModel: SchedulerData }> {
    constructor(props: {}) {
        super(props);

        const schedulerData = new SchedulerData(ExampleFunction.getNow(), SchedulerViewTypes.Week, false, false, {
            startResizable: false,
            endResizable: false,
            movable: false,
            creatable: false,
        });
        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.events);
        this.state = {
            viewModel: schedulerData,
        };
    }

    public render() {
        const { viewModel } = this.state;
        return (
            <Nav title="Readonly view">
                <Typography variant="h3"> </Typography>
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
                    toggleExpandFunc={ExampleFunction.toggleExpandFunc.bind(this)}
                />
            </Nav>
        );
    }
}

export default withDragDropContext(Readonly);
