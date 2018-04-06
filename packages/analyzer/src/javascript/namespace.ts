/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
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

import * as babel from '@babel/types';

import {Document, Feature, Property, Resolvable, ScannedProperty, SourceRange, Warning} from '../model/model';

import {Annotation as JsDocAnnotation} from './jsdoc';

/**
 * The metadata for a JavaScript namespace.
 */
export class ScannedNamespace implements Resolvable {
  name: string;
  description?: string;
  summary?: string;
  jsdoc?: JsDocAnnotation;
  sourceRange: SourceRange;
  astNode: babel.Node;
  warnings: Warning[];
  properties: Map<string, ScannedProperty>;

  constructor(
      name: string, description: string, summary: string, astNode: babel.Node,
      properties: Map<string, ScannedProperty>, jsdoc: JsDocAnnotation,
      sourceRange: SourceRange) {
    this.name = name;
    this.description = description;
    this.summary = summary;
    this.jsdoc = jsdoc;
    this.sourceRange = sourceRange;
    this.astNode = astNode;
    this.warnings = [];
    this.properties = properties;
  }

  resolve(_document: Document) {
    return new Namespace(this);
  }
}

declare module '../model/queryable' {
  interface FeatureKindMap {
    'namespace': Namespace;
  }
}

export class Namespace implements Feature {
  name: string;
  description?: string;
  summary?: string;
  kinds: Set<string>;
  identifiers: Set<string>;
  sourceRange: SourceRange;
  astNode: any;
  warnings: Warning[];
  readonly properties = new Map<string, Property>();

  constructor(scannedNamespace: ScannedNamespace) {
    this.name = scannedNamespace.name;
    this.description = scannedNamespace.description;
    this.summary = scannedNamespace.summary;
    this.kinds = new Set(['namespace']);
    this.identifiers = new Set([this.name]);
    this.sourceRange = scannedNamespace.sourceRange;
    this.astNode = scannedNamespace.astNode;
    this.warnings = Array.from(scannedNamespace.warnings);

    for (const [key, prop] of scannedNamespace.properties) {
      this.properties.set(key, prop);
    }
  }

  toString() {
    return `<Namespace id=${this.name}>`;
  }
}
