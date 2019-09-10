import * as React from "react";
import { Component, useState } from "react";
import Scheduler, {
  SchedulerData,
  SchedulerViewTypes,
  NonAgendaCellHeaderTemplateResolverArgs,
} from "../src/Scheduler";
import * as moment from "moment";
import * as ExampleFunction from "./utils/ExampleFunctions";
import { DemoData } from "./utils/DemoData";
import Nav from "./utils/Nav";
import withDragDropContext from "./utils/withDnDContext";
import { EventComponentRound } from "./plugins/EventPlugin";
import { PopoverComponent } from "./plugins/PopoverPlugin";
import { RowHeaderComponent } from "./plugins/RowHeader";

class CustomHeaders extends Component<{}, { viewModel: SchedulerData }> {
  constructor(props: Readonly<{}>) {
    super(props);

    const schedulerData = new SchedulerData(
      ExampleFunction.updateSchedulerDataState.bind(this),
      ExampleFunction.getNow(),
      SchedulerViewTypes.Week,
      false,
      false,
      {
        calendarPopoverEnabled: false,
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
          <h3 style={{ textAlign: "center" }}>Custom table headers (with disabled calendar popup)</h3>
          <Scheduler schedulerData={viewModel}
            EventFC={EventComponentRound}
            PopoverFC={PopoverComponent}
            RowHeaderFC={RowHeaderComponent}
            prevClick={ExampleFunction.prevClick.bind(this)}
            nextClick={ExampleFunction.nextClick.bind(this)}
            onSelectDate={ExampleFunction.onSelectDate.bind(this)}
            onViewChange={ExampleFunction.onViewChange.bind(this)}
            updateEventStart={ExampleFunction.updateEventStart.bind(this)}
            updateEventEnd={ExampleFunction.updateEventEnd.bind(this)}
            moveEvent={ExampleFunction.moveEvent.bind(this)}
            newEvent={ExampleFunction.newEvent.bind(this)}
          />
        </div>
      </div>
    );
  }

}

export default withDragDropContext(CustomHeaders);
