import { Chessground as _Chessground } from "chessground/chessground";

function Chessground(node, { config, initializer }) {
  let api;
  function update(params) {
    api = _Chessground(node, params.config);
    if (params.initializer) {
      params.initializer(api);
    }
  }
  update({ config, initializer });

  return {
    update,
    destroy() {
      api.destroy();
    },
  };
}

export { Chessground, cgStylesHelper };