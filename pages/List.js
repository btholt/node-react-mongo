import Head from "next/head";
import Link from "next/link";

function Home() {
  return (
    <div>
      <h1>List</h1>
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
          to see what your neighbors are brining.
        </li>
      </ul>
    </div>
  );
}

export default Home;
