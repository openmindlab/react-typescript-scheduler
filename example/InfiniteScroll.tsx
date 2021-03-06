import * as React from "react";
import { Component } from "react";
import Scheduler, {
    SchedulerData,
    SchedulerViewTypes,
    SchedulerContentState,
} from "../src/Scheduler";
import * as ExampleFunction from "./ExampleFunctions";
import { DemoData } from "./DemoData";
import Nav from "./Nav";
import ViewSrcCode from "./ViewSrcCode";
import withDragDropContext from "./withDnDContext";
import * as moment from "moment";

class InfiniteScroll extends Component<{}, { viewModel: SchedulerData }> {
    constructor(props: Readonly<{}>) {
        super(props);

        const schedulerData = new SchedulerData(ExampleFunction.getNow(), SchedulerViewTypes.Month, false, false, {
            views: [
                { viewName: "Month", viewType: SchedulerViewTypes.Month, showAgenda: false, isEventPerspective: false },
            ],
        });
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
                    <h3 style={{ textAlign: "center" }}>Infinite scroll<ViewSrcCode srcCodeUrl="https://github.com/StephenChou1017/react-big-scheduler/blob/master/example/InfiniteScroll.js" /></h3>
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
                        onScrollLeft={this.onScrollLeft}
                        onScrollRight={this.onScrollRight}
                        onScrollTop={ExampleFunction.onScrollTop.bind(this)}
                        onScrollBottom={ExampleFunction.onScrollBottom.bind(this)}
                        toggleExpandFunc={ExampleFunction.toggleExpandFunc.bind(this)}
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
