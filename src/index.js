const leftCommentPattern = /\/\*/g;
const rightCommentPattern = /\*\//g;
const getComment = (input) => {
  const source = input.replace(leftCommentPattern, '\\/*').replace(rightCommentPattern, '*\\/');
  if (source.indexOf('\n') < 0) return ` ${source} `;
  return `*\n${source.split('\n').map(line => ` * ${line}`).join('\n')}\n `;
};

function removeBinding(t, binding, shouldRemoveFunctionCalls = true) {
  if (!binding) return;
  const paths = binding.referencePaths;
  paths.forEach((path) => {
    const parentPath = path.findParent(p =>
      p.isExpressionStatement() || p.isVariableDeclaration() || p.isReturnStatement()
    );
    if (!parentPath) return;
    if (parentPath.isExpressionStatement()) {
      if (!shouldRemoveFunctionCalls && parentPath.node.expression.callee === path.node) {
        return;
      }
    } else if (parentPath.isVariableDeclaration()) {
      parentPath.traverse({
        VariableDeclarator(p) {
          removeBinding(t, parentPath.scope.bindings[p.node.id.name]);
        },
      });
    } else {
      const funcPath = parentPath.findParent(p => p.isFunctionDeclaration());
      const name = funcPath.node.id.name;
      removeBinding(t, funcPath.parentPath.scope.bindings[name], false);
    }
    parentPath.addComment('trailing', getComment(parentPath.getSource()));
    parentPath.replaceWith(t.noop());
  });
}

export default function (babel) {
  const { types: t } = babel;

  return {
    visitor: {
      Program(path, state) {
        const modules = state.opts.modules || [];
        Object.values(path.scope.bindings)
          .filter(binding =>
                    t.isImportDefaultSpecifier(binding.path) ||
                    t.isImportNamespaceSpecifier(binding.path) ||
                    t.isImportSpecifier(binding.path))
          .filter((binding) => {
            const p = binding.path.findParent(parentPath => parentPath.isImportDeclaration());
            return modules.indexOf(p.node.source.value) >= 0;
          })
          .forEach((binding) => {
            removeBinding(t, binding);
          });
      },
    },
  };
}
