import React from "react";
import Head from "next/head";
import Link from "next/link";

class Home extends React.Component {
  static async getInitialProps({ req }) {
    if (req) {
      console.log("in React", req.user);
    }
    const email = req && req.user ? req.user.email : "dunno lol";
    return { email };
  }
  render() {
    return (
      <div>
        <h1>{this.props.email}</h1>
        <h1>Community Bake Sale!</h1>
        <ul>
          <li>
            <Link prefetch href="/submit">
              Click here
            </Link>{" "}
            to submit your baked good to the bake sale.
          </li>
          <li>
            <Link prefetch href="/list">
              Click here
            </Link>{" "}
            to see what your neighbors are bringing.
          </li>
        </ul>
      </div>
    );
  }
}

export default Home;
