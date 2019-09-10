import * as React from "react";
import { Component } from "react";
import Scheduler, {
    SchedulerData,
    SchedulerViewTypes,
    SchedulerContentState,
} from "../src/Scheduler";
import * as ExampleFunction from "./utils/ExampleFunctions";
import { DemoData } from "./utils/DemoData";
import Nav from "./utils/Nav";
import withDragDropContext from "./utils/withDnDContext";
import * as moment from "moment";

class InfiniteScroll extends Component<{}, { viewModel: SchedulerData }> {
    constructor(props: Readonly<{}>) {
        super(props);

        const schedulerData = new SchedulerData(
            ExampleFunction.updateSchedulerDataState.bind(this),
            ExampleFunction.getNow(),
            SchedulerViewTypes.Month,
            false,
            false,
            {
                views: [
                    { viewName: "Month", viewType: SchedulerViewTypes.Month, showAgenda: false, isEventPerspective: false },
                ],
            }
        );
        moment.locale("en");
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
                    <h3 style={{ textAlign: "center" }}>Infinite scroll</h3>
                    <Scheduler schedulerData={viewModel}
                        prevClick={ExampleFunction.prevClick.bind(this)}
                        nextClick={ExampleFunction.nextClick.bind(this)}
                        onSelectDate={ExampleFunction.onSelectDate.bind(this)}
                        onViewChange={ExampleFunction.onViewChange.bind(this)}
                        updateEventStart={ExampleFunction.updateEventStart.bind(this)}
                        updateEventEnd={ExampleFunction.updateEventEnd.bind(this)}
                        moveEvent={ExampleFunction.moveEvent.bind(this)}
                        newEvent={ExampleFunction.newEvent.bind(this)}
                        onScrollLeft={this.onScrollLeft}
                        onScrollRight={this.onScrollRight}
                        onScrollTop={ExampleFunction.onScrollTop.bind(this)}
                        onScrollBottom={ExampleFunction.onScrollBottom.bind(this)}
                    />
                </div>
            </div>
        );
    }

    public onScrollRight = (schedulerData: SchedulerData, schedulerContent: SchedulerContentState, maxScrollLeft: number) => {
        if (schedulerData.viewType === SchedulerViewTypes.Month) {
            schedulerData.next();
            schedulerData.setEvents(DemoData.events);
            this.setState({
                viewModel: schedulerData,
            });

            schedulerContent.scrollLeft = maxScrollLeft - 10;
        }
    }

    public onScrollLeft = (schedulerData: SchedulerData, schedulerContent: SchedulerContentState, maxScrollLeft: number) => {
        if (schedulerData.viewType === SchedulerViewTypes.Month) {
            schedulerData.prev();
            schedulerData.setEvents(DemoData.events);
            this.setState({
                viewModel: schedulerData,
            });

            schedulerContent.scrollLeft = 10;
        }
    }

}

export default withDragDropContext(InfiniteScroll);
