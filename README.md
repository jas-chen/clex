# Clex
> Switch-case free state managment library

Clex is a state managment library that
- Typed languages friendly
- First class action creators
- Switch-case free
- Easy to use in server side
- Inspired by Redux, Elm Architecture and Clean Architecture

```js
///////////////// Example: Counter /////////////////
import { createCore } from 'clex';

function incr() {
  return this.state += 1;
}

function decr() {
  return this.state -= 1;
}

const core = createCore({
  actions: { incr, decr },
  initState: 0,
  onNext: count => console.log(count)
});

// 0
core.actions.incr(); // 1
core.actions.incr(); // 2
core.actions.decr(); // 1
```

```js
///////////////// Example: Who to follow /////////////////
import { createCore } from 'clex';

function fetchUsers() {
  const randomOffset = Math.floor(Math.random() * 500);
  return fetch('https://api.github.com/users?since=' + randomOffset, {
    // Set a personal token after getting rate-limited
    // headers: { 'Authorization': 'token YOUR_TOKEN' }
  })
  .then((res) => res.json());
};

function loaded(users) {
  return {
    ...this.state,
    loading: false,
    users
  };
}

function refresh() {
  return [
    { ...this.state, loading: true },
    (actions) => this.services.fetchUsers().then(actions.loaded)
  ];
}

function App({ onRefreshClick, users, loading }) {
  return (
    <div>
      <h1>Who to follow</h1>
      <button type="button" onClick={onRefreshClick} disabled={loading}>Refresh</button>
      <ul>
        {
          users.map(user => <li key={user.id}>{user.login}</li>)
        }
      </ul>
    </div>
  );
}

function present(state, actions) {
  ReactDOM.render(
    <App onRefreshClick={actions.refresh} {...state} />,
    document.getElementById('root')
  );
}

createCore({
  services: { fetchUsers },
  actions: { loaded, refresh },
  initState: { users: [] },
  onNext: present
});
```
