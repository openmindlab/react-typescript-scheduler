import * as React from 'react'
import { Component, useState } from 'react'
import Scheduler, {
  SchedulerData,
  SchedulerViewTypes,
  SCHEDULER_DATE_FORMAT,
  SchedulerResource,
  SchedulerEvent
} from '../src/Scheduler'
import * as ExampleFunction from './ExampleFunctions'
import { DemoData } from './DemoData'
import Nav from './Nav'
import ViewSrcCode from './ViewSrcCode'
import withDragDropContext from './withDnDContext'

class CustomHeaders extends Component<{}, { viewModel: SchedulerData }> {
  constructor(props) {
    super(props);

    let schedulerData = new SchedulerData(Date.now().toString(), SchedulerViewTypes.Week, false, false, {
      calendarPopoverEnabled: false,
    });
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.events);
    this.state = {
      viewModel: schedulerData
    }
  }

  nonAgendaCellHeaderTemplateResolver = (schedulerData, item: any, formattedDateItems: any, style: React.CSSProperties) => {
    let datetime = schedulerData.localeMoment(item.time);
    let isCurrentDate = false;

    if (schedulerData.viewType === SchedulerViewTypes.Day) {
      isCurrentDate = datetime.isSame(new Date(), 'hour');
    }
    else {
      isCurrentDate = datetime.isSame(new Date(), 'day');
    }

    if (isCurrentDate) {
      style.backgroundColor = '#118dea';
      style.color = 'white';
    }

    return (
      <th key={item.time} className={`header3-text`} style={style}>
        {
          formattedDateItems.map((formattedItem, index) => (
            <div key={index}
              dangerouslySetInnerHTML={{ __html: formattedItem.replace(/[0-9]/g, '<b>$&</b>') }} />
          ))
        }
      </th>
    );
  }

  render() {
    const { viewModel } = this.state;

    return (
      <div>
        <Nav />
        <div>
          <h3 style={{ textAlign: 'center' }}>Custom table headers (with disabled calendar popup)<ViewSrcCode
            srcCodeUrl="https://github.com/StephenChou1017/react-big-scheduler/blob/master/example/CustomTableHeaders.js" />
          </h3>
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
        </div>
      </div>
    )
  }

}

export default withDragDropContext(CustomHeaders)
