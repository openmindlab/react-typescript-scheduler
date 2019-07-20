import * as React from 'react'
import { Component } from 'react'
import Scheduler, { SchedulerData, SchedulerViewTypes, SchedulerAddMorePopover, SchedulerHeader } from '../src/Scheduler'
import { DemoData } from './DemoData'
import Nav from './Nav'
import ViewSrcCode from './ViewSrcCode'
import withDragDropContext from './withDnDContext'
import * as ExampleFunction from './ExampleFunctions'


interface AddMoreState {
    viewModel: SchedulerData,
    headerItem: SchedulerHeader,
    left: number,
    top: number,
    height: number,
}

class AddMore extends Component<{}, AddMoreState>{
    constructor(props: Readonly<{}>) {
        super(props);

        let schedulerData = new SchedulerData('2017-12-18', SchedulerViewTypes.Week, false, false, {
            dayMaxEvents: 2,
            weekMaxEvents: 4,
            monthMaxEvents: 4,
            quarterMaxEvents: 4,
            yearMaxEvents: 4,
        });
        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.events);
        this.state = {
            viewModel: schedulerData,
            headerItem: undefined,
            left: 0,
            top: 0,
            height: 0,
        }
    }

    render() {
        const { viewModel } = this.state;

        let popover = <div />;
        if (this.state.headerItem !== undefined) {
            popover =
                <SchedulerAddMorePopover
                    headerItem={this.state.headerItem}
                    eventItemClick={ExampleFunction.eventClicked.bind(this)}
                    viewEventClick={ExampleFunction.ops1.bind(this)}
                    viewEventText="Ops 1"
                    viewEvent2Click={ExampleFunction.ops2.bind(this)}
                    viewEvent2Text="Ops 2"
                    schedulerData={viewModel}
                    closeAction={ExampleFunction.onSetAddMoreState.bind(this)}
                    left={this.state.left}
                    top={this.state.top}
                    height={this.state.height}
                    moveEvent={ExampleFunction.moveEvent.bind(this)} />;
        }

        return (
            <div>
                <Nav />
                <div>
                    <h3 style={{ textAlign: 'center' }}>Add more<ViewSrcCode srcCodeUrl="https://github.com/StephenChou1017/react-big-scheduler/blob/master/example/AddMore.js" /></h3>
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
                        onSetAddMoreState={ExampleFunction.onSetAddMoreState.bind(this)}
                        toggleExpandFunc={ExampleFunction.toggleExpandFunc.bind(this)}
                    />
                    {popover}
                </div>
            </div>
        )
    }

}

export default withDragDropContext(AddMore)
