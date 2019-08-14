import * as React from "react";
import { Component } from "react";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Button from "antd/lib/button";
import Popover from "antd/lib/popover";
import {
    EventItemPopoverResolverArgs,
} from "../../src/Scheduler";
import { DEMO_DATE_FORMAT } from "../utils/DemoData";

export const popoverPlugin = (resolver: EventItemPopoverResolverArgs) => <PopoverComponent resolver={resolver} />;

export class PopoverComponent extends Component<{ resolver: EventItemPopoverResolverArgs }, {}> {
    constructor(props: Readonly<{ resolver: EventItemPopoverResolverArgs; }>) {
        super(props);
    }
    public render() {
        const { connectDragSource, connectDragPreview, timelineEvent } = this.props.resolver;
        return (
            <Popover placement="bottomLeft" content={
                <div style={{ width: "300px" }}>
                    <Row type="flex" align="middle">
                        <Col span={2}>
                            <div className="status-dot" style={{ backgroundColor: this.props.resolver.statusColor }} />
                        </Col>
                        <Col span={22} className="overflow-text">
                            <span className="header2-text" title={this.props.resolver.title}>{this.props.resolver.title}</span>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle">
                        <Col span={2}>
                            <div />
                        </Col>
                        <Col span={22}>
                            <span className="header1-text">{this.props.resolver.start.format(DEMO_DATE_FORMAT)} - {this.props.resolver.end.format(DEMO_DATE_FORMAT)}</span>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle">
                        <Col span={2}>
                            <div />
                        </Col>
                        <Col span={22}>
                            <Button onClick={() => { alert(`You just clicked demo button. event title: ${this.props.resolver.eventItem.title}`); }}>Demo</Button>
                        </Col>
                    </Row>
                </div >
            } trigger="hover">
                {
                    connectDragPreview(
                        connectDragSource(timelineEvent),
                    )
                }
            </Popover>);
    }
}
