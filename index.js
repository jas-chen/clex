function createCore({ actions, initState, onNext }) {
  const _actions = {};
  let _state = initState;

  Object.keys(actions).forEach(name => {
    const action = actions[name];
    _actions[name] = (...args) => {
      const context = {
        state: _state
      };

      const result = action.apply(context, args);
      let sideEffect;

      if (Array.isArray(result)) {
        _state = result[0];
        sideEffect = result[1];
      } else {
        _state = result;
      }

      onNext(_state, _actions, { type: name, payload: args });
      return sideEffect && sideEffect(_actions);
    }
  });

  onNext(initState, _actions, { type: '@@duxy/INIT' + Math.random().toString(36).substring(7).split('').join('.') });

  return {
    actions: _actions,
    getState: () => _state
  };
}

export { createCore };
