import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'
import { Route, Switch } from 'wouter'

render(
  <Switch>
    <Route path="/:streakId">
      {(params) => <App streakId={params.streakId} />}
    </Route>
    <Route path="/">
      <App streakId="default" />
    </Route>
  </Switch>,
  document.getElementById('app')!
)
