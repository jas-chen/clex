function createCore({ actions, model, onNext }) {
  const _actions = {};
  let _model = model;

  Object.keys(actions).forEach(name => {
    const action = actions[name];
    _actions[name] = (...args) => {
      const result = action.apply(_model, args);
      let sideEffect;
      let nextModel;

      if (Array.isArray(result)) {
        [nextModel, sideEffect] = result;
      } else {
        nextModel = result;
      }

      if (nextModel !== _model) {
        _model = {..._model, ...nextModel};
      }

      onNext(_model, _actions, { type: name, payload: args });
      return sideEffect && sideEffect(_actions);
    }
  });

  onNext(model, _actions, { type: '@@clex/INIT' + Math.random().toString(36).substring(7).split('').join('.') });

  return {
    actions: _actions,
    getModel: () => _model
  };
}

export { createCore };
