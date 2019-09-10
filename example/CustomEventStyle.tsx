import * as React from "react";
import { Component } from "react";
import Scheduler, {
    SchedulerData,
    SchedulerViewTypes,
    EventItemPopoverResolverArgs,
    EventItemPopoverResolverDnDArgs,
} from "../src/Scheduler";
import * as ExampleFunction from "./utils/ExampleFunctions";

import { DemoData } from "./utils/DemoData";
import Nav from "./utils/Nav";

import withDragDropContext from "./utils/withDnDContext";
import { PopoverComponent } from "./plugins/PopoverPlugin";
import { EventComponent } from "./plugins/EventPlugin";

interface CustomEventStyleState {
    viewModel: SchedulerData;
}

class CustomEventStyle extends Component<{}, CustomEventStyleState> {
    constructor(props) {
        super(props);

        const schedulerData = new SchedulerData(
            ExampleFunction.updateSchedulerDataState.bind(this),
            ExampleFunction.getNow(),
            SchedulerViewTypes.Week,
            false,
            false,
            {
                views: [
                    { viewName: "Week", viewType: SchedulerViewTypes.Week, showAgenda: false, isEventPerspective: false },
                    { viewName: "Month(TaskView)", viewType: SchedulerViewTypes.Month, showAgenda: false, isEventPerspective: true },
                    { viewName: "Year", viewType: SchedulerViewTypes.Year, showAgenda: false, isEventPerspective: false },
                ],
            },
        );
        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.eventsForCustomEventStyle);
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
                    <h3 style={{ textAlign: "center" }}>Custom event style</h3>
                    <Scheduler schedulerData={viewModel}
                        EventFC={EventComponent}
                        prevClick={ExampleFunction.prevClick.bind(this)}
                        nextClick={ExampleFunction.nextClick.bind(this)}
                        onSelectDate={ExampleFunction.onSelectDate.bind(this)}
                        onViewChange={ExampleFunction.onViewChange.bind(this)}
                        updateEventStart={ExampleFunction.updateEventStart.bind(this)}
                        updateEventEnd={ExampleFunction.updateEventEnd.bind(this)}
                        moveEvent={ExampleFunction.moveEvent.bind(this)}
                        newEvent={ExampleFunction.newEvent.bind(this)}
                        onScrollLeft={ExampleFunction.onScrollLeft.bind(this)}
                        onScrollRight={ExampleFunction.onScrollRight.bind(this)}
                        onScrollTop={ExampleFunction.onScrollTop.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default withDragDropContext(CustomEventStyle);
