import * as React from "react";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Button from "antd/lib/button";
import Popover from "antd/lib/popover";
import { DEMO_DATE_FORMAT } from "../utils/DemoData";
import { EventItemPopoverProps } from "../../src/Scheduler";

export const PopoverComponent: React.FC<EventItemPopoverProps> = (props) => {
    const { connectDragSource, connectDragPreview, timelineEvent, startTime, endTime, schedulerData, eventItem } = props;
    const {config} = schedulerData;
    let bgColor = config.defaultEventBgColor;
    if (eventItem.bgColor) {
        bgColor = eventItem.bgColor;
    }
    return (
        <Popover placement="bottomLeft" content={
            <div style={{ width: "300px" }}>
                <Row type="flex" align="middle">
                    <Col span={2}>
                        <div className="status-dot" style={{ backgroundColor: bgColor }} />
                    </Col>
                    <Col span={22} className="overflow-text">
                        <span className="header2-text" title={props.title}>{props.title}</span>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={2}>
                        <div />
                    </Col>
                    <Col span={22}>
                        <span className="header1-text">{startTime.format(DEMO_DATE_FORMAT)} - {endTime.format(DEMO_DATE_FORMAT)}</span>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={2}>
                        <div />
                    </Col>
                    <Col span={22}>
                        <Button onClick={() => { alert(`You just clicked demo button. event title: ${props.eventItem.title}`); }}>Demo</Button>
                    </Col>
                </Row>
            </div >
        } trigger="hover">
            {
                props.connectDragPreview && connectDragPreview(
                    connectDragSource(timelineEvent),
                )
            }
        </Popover>);
};
