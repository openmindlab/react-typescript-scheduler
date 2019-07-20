import * as React from 'react'
import { Component } from 'react'
import Scheduler, {
    SchedulerData,
    SchedulerViewTypes,
    SCHEDULER_DATE_FORMAT,
    SchedulerResource
} from '../src/Scheduler'
import * as ExampleFunction from './ExampleFunctions'
import moment from 'moment'
import { DemoData } from './DemoData'
import Nav from './Nav'
import ViewSrcCode from './ViewSrcCode'
import withDragDropContext from './withDnDContext'
import 'antd/lib/style/index.css';
import 'antd/lib/modal/style/index.css';
import 'antd/lib/button/style/index.css'
import 'antd/lib/form/style/index.css'
import 'antd/lib/input/style/index.css'

interface AddResourceState {
    viewModel: SchedulerData,
    visible: boolean
}

class AddResource extends Component<{}, AddResourceState> {
    form: any;
    constructor(props: Readonly<{}>) {
        super(props);
        let today = moment().format(SCHEDULER_DATE_FORMAT);
        let schedulerData = new SchedulerData(today, SchedulerViewTypes.Week);
        schedulerData.setResources(DemoData.resources);
        schedulerData.setEvents(DemoData.events);
        this.state = {
            viewModel: schedulerData,
            visible: false
        }
    }
    showModal = () => {
        this.setState({ visible: true });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err: any, values: any) => {
            if (err) {
                return;
            }
            this.addResource(values.name)
            form.resetFields();
            this.setState({ visible: false });
        });

    }
    saveFormRef = (form: any) => {
        this.form = form;
    }

    addResource = (resourceName: string) => {
        let schedulerData = this.state.viewModel;
        let newFreshId = schedulerData.resources.length + 1;
        let newFreshName = resourceName;
        schedulerData.addResource({ id: newFreshId.toString(), name: newFreshName });
        this.setState({
            viewModel: schedulerData
        })
    }

    render() {
        const { viewModel } = this.state;

        let leftCustomHeader = (
            <div>
                <span style={{ fontWeight: 'bold' }}><a onClick={this.showModal}>Add a resource</a></span>
                {/**TODO */}
            </div>
        );

        return (
            <div>
                <Nav />
                <div>
                    <h3 style={{ textAlign: 'center' }}>Add resource<ViewSrcCode srcCodeUrl="https://github.com/StephenChou1017/react-big-scheduler/blob/master/example/AddResource.js" /></h3>
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
                        leftCustomHeader={leftCustomHeader}
                        toggleExpandFunc={ExampleFunction.toggleExpandFunc.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

export default withDragDropContext(AddResource)
