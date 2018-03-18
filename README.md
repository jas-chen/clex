# Clex
> Switch-case free state managment library

Clex is a state managment library that
- Typed languages friendly
- First class action creators
- Switch-case free
- Easy to use in server side
- View library agnostic
- Inspired by Redux, Elm Architecture and Clean Architecture

## Example: Counter
```js
import { createCore } from 'clex';

function incr() {
  return { count: this.count + 1 };
}

function decr() {
  return { count: this.count - 1 };
}

const core = createCore({
  actions: { incr, decr },
  model: { count: 0 },
  onNext: model => console.log(model.count)
});

// 0
core.actions.incr(); // 1
core.actions.incr(); // 2
core.actions.decr(); // 1
```

## Example: Who to follow
```js
import React from 'react';
import ReactDOM from 'react-dom';
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
    loading: false,
    users
  };
}

function createRefresh(fetchUsers) {
  return function refresh() {
    // return [nextState, sideEffect]
    return [
      { ...this, loading: true },
      (actions) => fetchUsers().then(actions.loaded)
    ];
  }
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

function present(model, actions) {
  ReactDOM.render(
    <App onRefreshClick={actions.refresh} {...model} />,
    document.getElementById('root')
  );
}

createCore({
  actions: {
    loaded,
    refresh: createRefresh(fetchUsers)
  },
  model: { users: [] },
  onNext: present
});
```
