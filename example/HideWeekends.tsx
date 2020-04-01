import * as React from "react";
import { Component } from "react";
import Scheduler, { SchedulerData, SchedulerViewTypes } from "../src/Scheduler";
import { DemoData } from "./DemoData";
import * as ExampleFunction from "./ExampleFunctions";
import Nav from "./Nav";
import withDragDropContext from "./withDnDContext";

class HideWeekends extends Component<{}, { viewModel: SchedulerData }> {
    constructor(props: Readonly<{}>) {
        super(props);

        const schedulerData = new SchedulerData(ExampleFunction.getNow(), SchedulerViewTypes.Week, false, false, {
            displayWeekend: false,
            weekCellWidth: "16%",
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
            <Nav title="Hide weekends">
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
                    onScrollLeft={ExampleFunction.onScrollLeft.bind(this)}
                    onScrollRight={ExampleFunction.onScrollRight.bind(this)}
                    onScrollTop={ExampleFunction.onScrollTop.bind(this)}
                    onScrollBottom={ExampleFunction.onScrollBottom.bind(this)}
                    toggleExpandFunc={ExampleFunction.toggleExpandFunc.bind(this)}
                />
            </Nav>
        );
    }
}

export default withDragDropContext(HideWeekends);
