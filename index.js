const Path = require('path');
const assert = require('assert');

const nodeType = ['object', 'init'];

const updateParamNameVisitor = {
  Identifier(path) {
    const targetNode = this.convertMap[path.node.name];
    if (this.convertMap[path.node.name] && nodeType.includes(path.key)) {
      path.replaceWith(targetNode);
    }
  }
};

function setUp(path, globals){
  const convertMap = {};
  globals.forEach(variable => {
    if(path.scope.globals[variable]){
      const node = path.scope.generateUidIdentifier(`no_${variable}`);
      convertMap[variable] = node;
    }
  })
  if(Object.keys(convertMap).length > 0){
    path.traverse(updateParamNameVisitor, { convertMap })
  }
}

const visitor = {
  Program(path, { opts, cwd, filename }){
    assert(opts.globals, 'globals should be provided')
    if(Array.isArray(opts.includes) && opts.includes.length > 0){
      const includeFile = opts.includes.some((pathname) => {
        const resolvePath = Path.resolve(cwd, pathname);
        if(!Path.relative(resolvePath, filename).startsWith('..')){
          return true;
        }
        return false;
      })
      if(includeFile){
        setUp(path, opts.globals);
      }
    } else {
      setUp(path, opts.globals);
    }
  }
}
module.exports = () => {
  return {
    name: 'globals-shield',
    visitor,
  }
}