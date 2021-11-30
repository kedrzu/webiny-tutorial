import React from "react";
import { RoutePlugin } from "@webiny/app/plugins/RoutePlugin";
import { Link, Route, RouteChildrenProps } from "@webiny/react-router";
import { Empty, Image, Row, Col, Divider } from "antd";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Layout from "~/components/Layout";
import blankImage from "~/images/blankImage.png";

import "./pinDetails.scss";

// Retrieves a previously created pin by given ID.
const GET_PIN = gql`
    query GetPin($id: ID!) {
        pins {
            getPin(id: $id) {
                id
                title
                description
                coverImage
                createdBy {
                    id
                    type
                    displayName
                }
            }
        }
    }
`;

type RemoveTail<S extends string, Tail extends string> = S extends `${infer P}${Tail}` ? P : S;
type GetRouteParameter<S extends string> = RemoveTail<
    RemoveTail<RemoveTail<S, `/${string}`>, `-${string}`>,
    `.${string}`
>;

interface ParamsDictionary {
    [key: string]: string;
}

// prettier-ignore
type RouteParameters<Route extends string> = string extends Route
    ? ParamsDictionary
    : Route extends `${string}(${string}`
        ? ParamsDictionary //TODO: handling for regex parameters
        : Route extends `${string}:${infer Rest}`
            ? (
            GetRouteParameter<Rest> extends never
                ? ParamsDictionary
                : GetRouteParameter<Rest> extends `${infer ParamName}?`
                    ? { [P in ParamName]?: string }
                    : { [P in GetRouteParameter<Rest>]: string }
            ) &
            (Rest extends `${GetRouteParameter<Rest>}${infer Next}`
                ? RouteParameters<Next> : unknown)
            : {};

const route = "/pins/:id";
type Props = RouteChildrenProps<RouteParameters<typeof route>>;

// The Pin Details page.
function PinDetails(props: Props) {
    const getPinQuery = useQuery(GET_PIN, { variables: { id: props.match.params.id } });
    const data = getPinQuery?.data?.pins?.getPin;

    return (
        <Layout className={"pin-details"}>
            {data ? (
                <Row gutter={24}>
                    <Col span={12} className={"centered"}>
                        {/* If we have an image, let's use the `Image` component
                        so that users have the option to show it full screen. */}
                        {data.coverImage ? (
                            <Image src={data.coverImage} />
                        ) : (
                            <img title={data.title} alt={data.title} src={blankImage} />
                        )}
                    </Col>
                    <Col span={12}>
                        <h1>{data.title}</h1>
                        <p>{data.description}</p>
                    </Col>
                </Row>
            ) : (
                /* Data not loaded? Let's show a friendly `Nothing to show.` message */
                <Empty description={"Nothing to show."} />
            )}

            <Divider />
            <Link to={"/"}> &larr; Back</Link>
        </Layout>
    );
}
// We register routes via the `RoutePlugin` plugin.
export default new RoutePlugin({
    route: <Route path="/pins/:id" exact component={PinDetails} />
});
