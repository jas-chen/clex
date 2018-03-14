function createCore({ actions, services, initState, onNext }) {
  let _state = initState;
  let _actions = {};
  const _services = Object.freeze(services);

  Object.keys(actions).forEach(name => {
    const action = actions[name];
    _actions[name] = (...args) => {
      const context = {
        state: _state,
        services: _services
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

  _actions = Object.freeze(_actions);
  onNext(initState, _actions, { type: '@@duxy/INIT' + Math.random().toString(36).substring(7).split('').join('.') });

  return {
    actions: _actions,
    getState: () => _state
  };
}

export { createCore };
