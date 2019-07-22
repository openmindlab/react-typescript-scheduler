import * as React from "react";
import { Component } from "react";
import Scheduler, {
    SchedulerData,
    SchedulerViewTypes,
    SCHEDULER_DATE_FORMAT,
    SchedulerCellUnits,
    SchedulerContentState,
} from "../src/Scheduler";
import * as ExampleFunction from "./ExampleFunctions";
import * as moment from "moment";
import { DemoData } from "./DemoData";
import Nav from "./Nav";
import ViewSrcCode from "./ViewSrcCode";
import withDragDropContext from "./withDnDContext";

class InfiniteScroll2 extends Component<{}, { viewModel: SchedulerData }> {
    constructor(props: Readonly<{}>) {
        super(props);

        const schedulerData = new SchedulerData(ExampleFunction.getNow(), SchedulerViewTypes.Custom, false, false, {
            headerEnabled: false,
            customCellWidth: 30,
            nonAgendaDayCellHeaderFormat: "M/D|HH:mm",
            views: [
                { viewName: "Day", viewType: SchedulerViewTypes.Custom, showAgenda: false, isEventPerspective: false },
                { viewName: "Week", viewType: SchedulerViewTypes.Week, showAgenda: false, isEventPerspective: false },
            ],
        }, {
                getCustomDateFunc: this.getCustomDate,
                isNonWorkingTimeFunc: this.isNonWorkingTime,
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
            <div>
                <Nav />
                <div>
                    <h3 style={{ textAlign: "center" }}>Infinite scroll 2<ViewSrcCode srcCodeUrl="https://github.com/StephenChou1017/react-big-scheduler/blob/master/example/InfiniteScroll2.js" /></h3>
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
                        onScrollLeft={this.onScrollLeft.bind(this)}
                        onScrollRight={this.onScrollRight.bind(this)}
                        onScrollTop={ExampleFunction.onScrollTop.bind(this)}
                        onScrollBottom={ExampleFunction.onScrollBottom.bind(this)}
                        toggleExpandFunc={ExampleFunction.toggleExpandFunc.bind(this)}
                    />
                </div>
            </div>
        );
    }

    public getCustomDate = (schedulerData: SchedulerData, num: number, date: string = undefined) => {
        let selectDate = schedulerData.startDate;
        if (date === undefined) {
            selectDate = date;
        }

        let startDate = selectDate;
        let endDate = moment(startDate).add(1, "days").format(SCHEDULER_DATE_FORMAT);
        const cellUnit = SchedulerCellUnits.Hour;
        if (num === 1) {
            startDate = schedulerData.startDate;
            endDate = moment(schedulerData.endDate).add(1, "days").format(SCHEDULER_DATE_FORMAT);
        } else if (num === -1) {
            startDate = moment(schedulerData.startDate).add(-1, "days").format(SCHEDULER_DATE_FORMAT);
            endDate = schedulerData.endDate;
        }

        return {
            startDate,
            endDate,
            cellUnit,
        };
    }

    public isNonWorkingTime = (schedulerData: SchedulerData, time: string) => {
        if (schedulerData.cellUnit === SchedulerCellUnits.Hour) {
            const hour = moment(time).hour();
            if (hour < 1) {
                return true;
            }
        } else {
            const dayOfWeek = moment(time).weekday();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                return true;
            }
        }

        return false;
    }
    public onScrollRight = (schedulerData: SchedulerData, schedulerContent: SchedulerContentState, maxScrollLeft: number) => {
        schedulerData.next();
        schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData,
        });

        schedulerContent.scrollLeft = maxScrollLeft - 10;
    }

    public onScrollLeft = (schedulerData, schedulerContent, maxScrollLeft) => {
        schedulerData.prev();
        schedulerData.setEvents(DemoData.events);
        this.setState({
            viewModel: schedulerData,
        });

        schedulerContent.scrollLeft = 10;
    }
}

export default withDragDropContext(InfiniteScroll2);
