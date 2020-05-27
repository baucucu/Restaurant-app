import React, { Component } from "react";
import { Card, CardDeck } from "react-bootstrap";
import axios from "axios";

export class FoodMenu extends Component {
  state = {
    food: [],
    cart: [],
    totalprice: 0,
    index: 0,
    cartSubmitSuccess: false,
  };

  componentDidMount() {
    axios
      .get("http://backend.fruitcompany.rocks/food/all")
      .then((res) => {
        this.setState({ food: res.data.data });
      })
      .catch((err) => console.log(err));
  }

  async getUserId() {
    let id = undefined;
    await axios
      .get("http://backend.fruitcompany.rocks/user/credentials")
      .then((res) => {
        id = res.data.user;
      })
      .catch((err) => {
        console.log(err);
      });

    return id;
  }

  render() {
    return (
      <React.Fragment>
        <div className="gradient-line-secondary shadow-lg ">
          <h2 className="text-left p-3 text-uppercase">
            Login
            <br />
            to start <br />
            ordering <br />
            <span className="deli-text">delicious</span> <br />
            food today
          </h2>
        </div>
        <div className="container">
          <br />
          <h3>
            <span role="img" aria-label="blushing-smiley">
              😊
            </span>
            Today's menu
          </h3>
          <hr />
          <Food food={this.state.food} />
        </div>
      </React.Fragment>
    );
  }
}

function Food(props) {
  const foods = props.food;
  const listFood = foods.map((food, index) => {
    return (
      <div key={index} className="col-auto mb-4">
        <Card
          className="text-justify shadow-lg"
          style={{ width: "18rem", height: "100%" }}
        >
          <Card.Header>{food.category}</Card.Header>
          <Card.Img
            variant="top"
            style={{
              height: "12vw",
              objectFit: "cover",
              width: "100%",
            }}
            className="food-photo"
            src={food.photo_url}
          />
          <Card.Body>
            <Card.Text>{food.name}</Card.Text>
            <Card.Text>
              Price: <b>${food.price} MXN</b>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  });

  return (
    <div className="row justify-content-center">
      <CardDeck>{listFood}</CardDeck>
    </div>
  );
}
