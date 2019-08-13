import * as React from "react";
import { Component } from "react";
import * as moment from "moment";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Button from "antd/lib/button";
import "antd/lib/popover/style/index.css";
import {
    SchedulerData,
    SchedulerEvent,
} from "../../src/Scheduler";

export const popoverPlugin = (
    schedulerData: SchedulerData,
    eventItem: SchedulerEvent,
    title: string,
    start: moment.Moment,
    end: moment.Moment,
    statusColor: string,
) => {
    return (

        <div style={{ width: "300px" }}>
            <Row type="flex" align="middle">
                <Col span={2}>
                    <div className="status-dot" style={{ backgroundColor: statusColor }} />
                </Col>
                <Col span={22} className="overflow-text">
                    <span className="header2-text" title={title}>{title}</span>
                </Col>
            </Row>
            <Row type="flex" align="middle">
                <Col span={2}>
                    <div />
                </Col>
                <Col span={22}>
                    <span className="header1-text">{start.format("HH:mm")} - {end.format("HH:mm")}</span>
                </Col>
            </Row>
            <Row type="flex" align="middle">
                <Col span={2}>
                    <div />
                </Col>
                <Col span={22}>
                    <Button onClick={() => { alert(`You just clicked demo button. event title: ${eventItem.title}`); }}>Demo</Button>
                </Col>
            </Row>
        </div>
    );
}