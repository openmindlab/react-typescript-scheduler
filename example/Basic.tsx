import * as React from 'react'
import { Component } from 'react'
import Scheduler, {
    SchedulerData,
    SchedulerViewTypes,
} from '../src/Scheduler'
import * as ExampleFunction from './ExampleFunctions'
import * as moment from 'moment'
import { DemoData } from './DemoData'
import Nav from './Nav'
import Tips from './Tips'
import ViewSrcCode from './ViewSrcCode'
import withDragDropContext from './withDnDContext'
import '../src/css/style.css'

interface BasicState {
    viewModel: SchedulerData
}

class Basic extends Component<{}, BasicState>{
    constructor(props: Readonly<{}>) {
        super(props);

        //let schedulerData = new SchedulerData(new moment("2017-12-18").format(DATE_FORMAT), ViewTypes.Week);
        let schedulerData = new SchedulerData("2017-12-18", SchedulerViewTypes.Week);
        moment.locale('en');
        let demoData = DemoData
        schedulerData.setResources(demoData.resources);
        schedulerData.setEvents(DemoData.events);
        this.state = {
            viewModel: schedulerData
        }
    }
    render() {
        const { viewModel } = this.state;
        return (
            <div>
                <Nav />
                <div>
                    <h3 style={{ textAlign: 'center' }}>Basic example<ViewSrcCode srcCodeUrl="https://github.com/StephenChou1017/react-big-scheduler/blob/master/example/Basic.js" /></h3>
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
                        onSetAddMoreState={ExampleFunction.onSetAddMoreState.bind(this)}
                    />
                </div>
                <Tips />
            </div>
        )
    }
}

export default withDragDropContext(Basic)
