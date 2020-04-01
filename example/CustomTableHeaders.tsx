import * as moment from "moment";
import * as React from "react";
import { Component } from "react";
import Scheduler, { SchedulerData, SchedulerViewTypes } from "../src/Scheduler";
import { DemoData } from "./DemoData";
import * as ExampleFunction from "./ExampleFunctions";
import Nav from "./Nav";
import withDragDropContext from "./withDnDContext";

class CustomHeaders extends Component<{}, { viewModel: SchedulerData }> {
  constructor(props: Readonly<{}>) {
    super(props);

    const schedulerData = new SchedulerData(ExampleFunction.getNow(), SchedulerViewTypes.Week, false, false, {
      calendarPopoverEnabled: false,
    });
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.events);
    this.state = {
      viewModel: schedulerData,
    };
  }

  public nonAgendaCellHeaderTemplateResolver = (schedulerData: SchedulerData, item: any, formattedDateItems: any, style: React.CSSProperties) => {
    const datetime = moment(item.time);
    let isCurrentDate = false;

    if (schedulerData.viewType === SchedulerViewTypes.Day) {
      isCurrentDate = datetime.isSame(new Date(), "hour");
    } else {
      isCurrentDate = datetime.isSame(new Date(), "day");
    }

    if (isCurrentDate) {
      style.backgroundColor = "#118dea";
      style.color = "white";
    }

    return (
      <th key={item.time} className={`header3-text`} style={style}>
        {
          formattedDateItems.map((formattedItem: any, index: any) => (
            <div key={index}
              dangerouslySetInnerHTML={{ __html: formattedItem.replace(/[0-9]/g, "<b>$&</b>") }} />
          ))
        }
      </th>
    );
  }

  public render() {
    const { viewModel } = this.state;

    return (
      <Nav title="Custom table headers">
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
          nonAgendaCellHeaderTemplateResolver={this.nonAgendaCellHeaderTemplateResolver}
          toggleExpandFunc={ExampleFunction.toggleExpandFunc.bind(this)}
        />
      </Nav>
    );
  }

}

export default withDragDropContext(CustomHeaders);
