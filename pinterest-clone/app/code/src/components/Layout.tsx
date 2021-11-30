import React, { useState } from "react";
import { Divider, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "@webiny/react-router";
import logo from "~/images/logo.png";
import NewPinModal from "./NewPinModal";

type Props = React.PropsWithChildren<{ className: string }>;

export default function Layout(props: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="layout">
            {/* We're using the `nav` tag for rendering the header. */}
            <nav>
                <div>
                    <Link to={"/"}>
                        <img src={logo} className="logo" alt={"Pinterest Clone"} />
                    </Link>
                </div>
                <div>
                    <Button
                        onClick={() => setVisible(true)}
                        type="primary"
                        size={"large"}
                        shape="circle"
                        icon={<PlusOutlined />}
                    />
                </div>
            </nav>
            <Divider style={{ margin: 0 }} />

            {/* The pages are rendered within the `main` tag. */}
            <main className={props.className}>{props.children}</main>
            <NewPinModal visible={visible} onClose={() => setVisible(false)} />
        </div>
    );
}
