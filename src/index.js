const getRemovedStatement = t =>
  t.expressionStatement(t.stringLiteral('This statement has been removed'));
const getRemovedDeclaration = t => t.variableDeclaration('var', [
  t.variableDeclarator(t.identifier(`not_in_use_${Date.now()}`))]
);
const getRemovedReturnStatement = t => t.returnStatement();

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
      parentPath.replaceWith(getRemovedStatement(t));
    } else if (parentPath.isVariableDeclaration()) {
      parentPath.traverse({
        VariableDeclarator(p) {
          removeBinding(t, parentPath.scope.bindings[p.node.id.name]);
        },
      });
      parentPath.replaceWith(getRemovedDeclaration(t));
    } else {
      const funcPath = parentPath.findParent(p => p.isFunctionDeclaration());
      const name = funcPath.node.id.name;
      removeBinding(t, funcPath.parentPath.scope.bindings[name], false);
      parentPath.replaceWith(getRemovedReturnStatement(t));
    }
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
            console.log(binding);
            removeBinding(t, binding);
          });
      },
    },
  };
}
