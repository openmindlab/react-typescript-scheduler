import * as React from "react";
import { Component } from "react";
import Scheduler, {
    SchedulerData,
    SchedulerViewTypes,
    SCHEDULER_DATE_FORMAT,
    SchedulerCellUnits,
} from "../src/Scheduler";
import * as ExampleFunction from "./ExampleFunctions";
import * as moment from "moment";
import { DemoData } from "./DemoData";
import Nav from "./Nav";
import ViewSrcCode from "./ViewSrcCode";
import withDragDropContext from "./withDnDContext";

class CustomTimeWindow extends Component<{}, { viewModel: SchedulerData }> {
    constructor(props: Readonly<{}>) {
        super(props);

        const schedulerData = new SchedulerData(ExampleFunction.getNow(),
            SchedulerViewTypes.Custom,
            false,
            false,
            {
                customCellWidth: 30,
                nonAgendaDayCellHeaderFormat: "M/D|HH:mm",
                views: [
                    { viewName: "Two days", viewType: SchedulerViewTypes.Custom, showAgenda: false, isEventPerspective: false },
                    { viewName: "Two weeks", viewType: SchedulerViewTypes.Custom1, showAgenda: false, isEventPerspective: false },
                    { viewName: "Two months", viewType: SchedulerViewTypes.Custom2, showAgenda: false, isEventPerspective: false },
                ],
            },
            {
                getCustomDateFunc: this.getCustomDate,
                isNonWorkingTimeFunc: this.isNonWorkingTime,
            },
        );
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
                    <h3 style={{ textAlign: "center" }}>Custom time window<ViewSrcCode srcCodeUrl="https://github.com/StephenChou1017/react-big-scheduler/blob/master/example/CustomTimeWindow.js" /></h3>
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
                </div>
            </div>
        )
    }


    getCustomDate = (schedulerData: SchedulerData, num: number, date: string = undefined) => {
        const { viewType } = schedulerData;
        let selectDate = schedulerData.startDate;
        if (date != undefined)
            selectDate = date;

        let startDate = num === 0 ? selectDate :
            moment(selectDate).add(2 * num, 'days').format(SCHEDULER_DATE_FORMAT),
            endDate = moment(startDate).add(1, 'days').format(SCHEDULER_DATE_FORMAT),
            cellUnit = SchedulerCellUnits.Hour;
        if (viewType === SchedulerViewTypes.Custom1) {
            let monday = moment(selectDate).startOf('week').format(SCHEDULER_DATE_FORMAT);
            startDate = num === 0 ? monday : moment(monday).add(2 * num, 'weeks').format(SCHEDULER_DATE_FORMAT);
            endDate = moment(startDate).add(1, 'weeks').endOf('week').format(SCHEDULER_DATE_FORMAT);
            cellUnit = SchedulerCellUnits.Day;
        } else if (viewType === SchedulerViewTypes.Custom2) {
            let firstDayOfMonth = moment(selectDate).startOf('month').format(SCHEDULER_DATE_FORMAT);
            startDate = num === 0 ? firstDayOfMonth : moment(firstDayOfMonth).add(2 * num, 'months').format(SCHEDULER_DATE_FORMAT);
            endDate = moment(startDate).add(1, 'months').endOf('month').format(SCHEDULER_DATE_FORMAT);
            cellUnit = SchedulerCellUnits.Day;
        }

        return {
            startDate,
            endDate,
            cellUnit
        };
    }

    isNonWorkingTime = (schedulerData: SchedulerData, time: string) => {
        if (schedulerData.cellUnit === SchedulerCellUnits.Hour) {
            let hour = moment(time).hour();
            if (hour < 1)
                return true;
        }
        else {
            let dayOfWeek = moment(time).weekday();
            if (dayOfWeek === 0 || dayOfWeek === 6)
                return true;
        }

        return false;
    }

}

export default withDragDropContext(CustomTimeWindow);
