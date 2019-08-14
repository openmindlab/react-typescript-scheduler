import * as React from "react";
import { Component } from "react";
import Scheduler, {
    SchedulerData,
    SchedulerViewTypes,
    SchedulerCellUnits,
} from "../src/Scheduler";
import * as ExampleFunction from "./utils/ExampleFunctions";
import * as moment from "moment";
import { DemoData } from "./utils/DemoData";
import Nav from "./utils/Nav";
import withDragDropContext from "./utils/withDnDContext";

class CustomTimeWindow extends Component<{}, { viewModel: SchedulerData }> {
    constructor(props: Readonly<{}>) {
        super(props);

        const schedulerData = new SchedulerData(
            ExampleFunction.getNow(),
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
                    <h3 style={{ textAlign: "center" }}>Custom time window</h3>
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
        );
    }

    public getCustomDate = (schedulerData: SchedulerData, num: number, date: moment.Moment = undefined) => {
        const { viewType } = schedulerData;
        let selectDate = schedulerData.startDate;
        if (date != undefined) {
            selectDate = date;
        }

        let startDate = num === 0 ? selectDate : moment(selectDate).add(2 * num, "days");
        let endDate = moment(startDate).add(1, "days");
        let cellUnit = SchedulerCellUnits.Hour;
        if (viewType === SchedulerViewTypes.Custom1) {
            const monday = moment(selectDate).startOf("week");
            startDate = num === 0 ? monday : moment(monday).add(2 * num, "weeks");
            endDate = moment(startDate).add(1, "weeks").endOf("week");
            cellUnit = SchedulerCellUnits.Day;
        } else if (viewType === SchedulerViewTypes.Custom2) {
            const firstDayOfMonth = moment(selectDate).startOf("month");
            startDate = num === 0 ? firstDayOfMonth : moment(firstDayOfMonth).add(2 * num, "months");
            endDate = moment(startDate).add(1, "months").endOf("month");
            cellUnit = SchedulerCellUnits.Day;
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

}

export default withDragDropContext(CustomTimeWindow);
