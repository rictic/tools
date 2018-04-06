/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * TODO(usergenic): Immediately deprecate this. This `estraverse-shim` module
 * exists solely to make the transition from `espree/estree` JavaScript parser
 * to `babylon/babel` and tooling a gradual/piecemeal affair.  It is intended as
 * a temporary shim that will eventually be removed once all dependent
 * scanners/visitors and utility functions which use the old `estraverse` style
 * methods are converted to `babel-traverse` etc.
 */

import babelTraverse from '@babel/traverse';
import {NodePath} from '@babel/traverse';
import * as babel from '@babel/types';
import {Visitor, VisitorCallback} from './estree-visitor';

/**
 * These enum options mimic the estraverse enums that are returned by their
 * `enterX`/`leaveX` visitor methods to advise flow of the visitor.
 */
export enum VisitorOption {
  Skip = 'skip',
  Break = 'break',
  Remove = 'remove',
}

/**
 * This method mirrors the API of `estraverse`'s `traverse` function.  It uses
 * `babel-traverse` to perform a traversal of an AST, but does so with `noScope:
 * true` which turns off the scoping logic and enables it to traverse from any
 * node; whereasc `babel-traverse`'s scopes require traversal from the root
 * node, the `File` type, which we don't yet even store on our JavaScript
 * documents.
 */
export function traverse(ast: babel.Node, visitor: Visitor): void {
  babelTraverse(ast, {
    enter(path) {
      dispatchVisitMethods(
          ['enter', `enter${path.type}` as keyof Visitor], path, visitor);
    },

    exit(path) {
      dispatchVisitMethods(
          ['leave', `leave${path.type}` as keyof Visitor], path, visitor);
    },
    noScope: !babel.isFile(ast),
  });
}

/**
 * Calls into visitor methods for visited node types using `estraverse` API of
 * providing the node and the parent node, and translates the `VisitorOption`
 * return value into directives on the `path` object used by `babel-traverse` to
 * advise visitor control flow, i.e. `stop`, `skip`, and `remove`.
 */
function dispatchVisitMethods(
    methodNames: Array<keyof Visitor>,
    path: NodePath<babel.Node>,
    visitor: Visitor): void {
  for (const methodName of methodNames) {
    if (typeof visitor[methodName] === 'function') {
      // TODO(rictic): can maybe remove this cast in TS 2.8
      const result = (visitor[methodName] as VisitorCallback<babel.Node>)!
          (path.node, path.parent, path);
      switch (result) {
        case VisitorOption.Break:
          return path.stop();
        case VisitorOption.Skip:
          return path.skip();
        case VisitorOption.Remove:
          return path.remove();
      }
    }
  }
}
