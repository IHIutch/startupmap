import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/thanks')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container">
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <Link className="navbar-brand" to="/">Buffalo Startup Map</Link>
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <Link className="nav-link btn btn-primary small" to="/"
            >View Map</Link>
          </li>
        </ul>
      </nav>
      <div className='row'>
        <div className="col col-md-6 offset-md-3 mt-5 pt-5 pb-4">
          <h1 className="mt-5">You're Submitted!<br /> Now pay it forward.</h1>
          <br />
          <p>
            We're humbly asking you to <b>share this site</b> on social media! <br /><br />C'mon, give your plot on the map an extra push! Spread the love now and come back tomorrow to see your Buffalo Startup.
          </p>

          {/* <!--           <a className="btn btn-primary mt-3 mr-2" target="_blank" href="https://www.linkedin.com/shareArticle?&url=buffalostartupmap.com&title=Buffalo%20Startup%20Map&summary=Help%20create%20Buffalo's%20best%20startup%20directory%20by%20plotting%20all%20of%20the%20startups%20in%20Buffalo,%20NY.%20%20Post%20a%20company%20to%20add%20a%20listing%20to%20the%20map&source=https%3A//buffalostartupmap.com/">Share The Map ...</a> --> */}

          <Link className="btn btn-secondary mt-3" to="/about"
          >Add Another Startup</Link>
          <p className="mt-5">
            <b>NOW IS THE TIME.</b> Are you a Buffalo backer? A citizen of the City of Good Neighbors? A spreader of BuffaLOVE. Some call it a
            comeback. A rising. However it motivates you, it's happening here.
            Entrepreneurs and innovators in our city are putting in the work each day pushing forward.
          </p>
          <br />

          <p>Let's be heard. Let's be counted. Let's go!</p>
        </div>
      </div>
      <a className="linkfixed" href="https://www.helmux.com/" target="_blank">Built with &#x2665;</a>
    </div>
  )
}
