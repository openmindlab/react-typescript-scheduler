import * as React from "react";
import { Component } from "react";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Button from "antd/lib/button";
import Popover from "antd/lib/popover";
import {
    EventItemPopoverResolverArgs, EventItemPopoverResolverDnDArgs,
} from "../../src/Scheduler";
import { DEMO_DATE_FORMAT } from "../utils/DemoData";

export class PopoverComponent extends Component<{ args: EventItemPopoverResolverArgs, dnd?: EventItemPopoverResolverDnDArgs }, {}> {
    public constructor(props: Readonly<{ args: EventItemPopoverResolverArgs; dnd?: EventItemPopoverResolverDnDArgs; }>) {
        super(props);
    }
    public render() {
        const { connectDragSource, connectDragPreview, timelineEvent } = this.props.dnd;
        return (
            <Popover placement="bottomLeft" content={
                <div style={{ width: "300px" }}>
                    <Row type="flex" align="middle">
                        <Col span={2}>
                            <div className="status-dot" style={{ backgroundColor: this.props.args.statusColor }} />
                        </Col>
                        <Col span={22} className="overflow-text">
                            <span className="header2-text" title={this.props.args.title}>{this.props.args.title}</span>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle">
                        <Col span={2}>
                            <div />
                        </Col>
                        <Col span={22}>
                            <span className="header1-text">{this.props.args.start.format(DEMO_DATE_FORMAT)} - {this.props.args.end.format(DEMO_DATE_FORMAT)}</span>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle">
                        <Col span={2}>
                            <div />
                        </Col>
                        <Col span={22}>
                            <Button onClick={() => { alert(`You just clicked demo button. event title: ${this.props.args.eventItem.title}`); }}>Demo</Button>
                        </Col>
                    </Row>
                </div >
            } trigger="hover">
                {
                    this.props.dnd && connectDragPreview(
                        connectDragSource(timelineEvent),
                    )
                }
            </Popover>);
    }
}
