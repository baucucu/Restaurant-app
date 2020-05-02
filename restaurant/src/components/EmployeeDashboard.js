import React, { Component } from "react";
import { Card, Alert, CardDeck, Table, Button, Form } from "react-bootstrap";
import axios from "axios";

export class EmployeeDashboard extends Component {
  async componentDidMount() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
    await this.getPreparingOrdersIds();
    await this.getPreparingOrdersList();
    await this.getReadOrDelivOrdersList();
  }

  state = {
    preparingOrderIds: [],
    preparingOrdersList: [],
    otherOrdersList: []
  };

  async handleSubmit(event) {
    event.preventDefault();
    event.persist();

    /* WARNING: Really hardcoded, needs to change */
    const id = event.target[0].value; // Gets the input with the id_order

    await axios
      .post(`/order/ready/${id}`)
      .then(res => {
        console.log("SUCCESS");
      })
      .catch(err => console.log(err));

    window.location.reload();
  }

  async handleSubmit2(event) {
    event.preventDefault();
    event.persist();

    /* WARNING: Really hardcoded, needs to change */
    const id = event.target[0].value; // Gets the input with the id_order

    await axios
      .post(`/order/delivered/${id}`)
      .then(res => {
        console.log("SUCCESS");
      })
      .catch(err => console.log(err));

    window.location.reload();
  }

  async getPreparingOrdersIds() {
    await axios
      .get("/order/preparing")
      .then(res => {
        this.setState({ preparingOrderIds: res.data.data });
      })
      .catch(err => console.log(err));
  }

  async getPreparingOrdersList() {
    this.state.preparingOrderIds.map(async (item, index) => {
      await axios
        .get(`/order/products/${item.id_order}`)
        .then(res => {
          const newPreparingOrdersList = this.state.preparingOrdersList;
          newPreparingOrdersList.push({ order: res.data.data });
          this.setState({ preparingOrdersList: newPreparingOrdersList });
        })
        .catch(err => console.log(err));
    });
  }

  async getReadOrDelivOrdersList() {
    await axios
      .get("/order/readyOrDelivered")
      .then(res => {
        this.setState({ otherOrdersList: res.data.data });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="container">
        <br />
        <h3>Orders to prepare</h3>
        <hr />
        <PendingOrders
          orders={this.state.preparingOrdersList}
          onSubmit={this.handleSubmit}
        />
        <br />
        <h3>Completed orders</h3>
        <hr />
        <OtherOrders
          orders={this.state.otherOrdersList}
          onSubmit={this.handleSubmit2}
        />
      </div>
    );
  }
}

function PendingOrders(props) {
  const orders = props.orders;

  if (orders.length !== undefined && orders.length > 0) {
    const orderList = orders.map((outside, index) => {
      const orderListInside = outside.order.map((inside, index) => {
        return (
          <div className="text-center border-bottom" key={index}>
            {inside.name} x {inside.quantity}
          </div>
        );
      });
      return (
        <Card
          border="dark"
          key={index}
          className="text-center order-card"
          style={{ width: "18rem", height: "100%" }}
        >
          <Card.Header as="h5">Order #{outside.order[0].id_order}</Card.Header>
          <Card.Body>
            <Card.Subtitle className="mb-2 text-muted">
              By: {outside.order[0].username}
            </Card.Subtitle>
            {orderListInside}
            <div className="font-weight-bold">
              ${outside.order[0].order_total}
            </div>
          </Card.Body>
          <Card.Footer>
            <Form onSubmit={props.onSubmit}>
              <input
                name="id"
                defaultValue={outside.order[0].id_order}
                hidden
              />
              <Button type="submit" className="btn btn-dark">
                Mark as ready
              </Button>
            </Form>
          </Card.Footer>
        </Card>
      );
    });

    return <CardDeck>{orderList}</CardDeck>;
  } else {
    return <Alert variant="secondary">No orders to prepare</Alert>;
  }
}

function OtherOrders(props) {
  const orders = props.orders;
  const orderList = orders.map((item, index) => {
    return (
      <tr key={index}>
        <td>{item.id_order}</td>
        <StatusTD
          status={item.status_order}
          onSubmit={props.onSubmit}
          id={item.id_order}
        ></StatusTD>
        <td>{item.order_hour}</td>
        <td>${item.order_total} MXN</td>
      </tr>
    );
  });

  return (
    <Table striped bordered hover size="sm" className="text-center">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Status</th>
          <th>Hour</th>
          <th>Total price</th>
        </tr>
      </thead>
      <tbody>{orderList}</tbody>
    </Table>
  );
}

function StatusTD(props) {
  if (props.status !== undefined && props.status === "ready") {
    return (
      <React.Fragment>
        <td>
          {props.status}
          <Form size="sm" onSubmit={props.onSubmit}>
            <input name="id" defaultValue={props.id} hidden />
            <Button type="submit" variant="link">
              Mark as delivered
            </Button>
          </Form>
        </td>
      </React.Fragment>
    );
  } else if (props.status === "delivered") {
    return <td>{props.status}</td>;
  } else {
    return <td></td>;
  }
}