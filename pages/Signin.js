import Head from "next/head";
import Link from "next/link";

function Home() {
  return (
    <div>
      <form method="post" action="/auth/login">
        <input type="email" required name="email" placeholder="Email Address" />
        <input
          type="password"
          required
          name="password"
          placeholder="password"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Home;
