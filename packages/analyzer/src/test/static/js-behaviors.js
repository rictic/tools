/** @polymerBehavior */
var SimpleBehavior = {
  simple: true,
};

/**
 * @polymerBehavior
 * @memberof Polymer
 * */
var SimpleNamespacedBehavior = {
  simple: true,
  method: function(paramA, paramB) {},
  shorthandMethod(paramA, paramB) {},
  object: {},
  array: [],
  attached: true ? null : function() {},
  templateLiteral: `foo`,
  get getter() { return 'foo'; },
  get getterSetter() { return 'foo'; },
  set getterSetter(v) {}
};


/** @polymerBehavior AwesomeBehavior */
var CustomNamedBehavior = {custom: true, properties: {a: {value: 1}}};

/** @polymerBehavior Polymer.AwesomeNamespacedBehavior */
var CustomNamedBehaviorTwo = {custom: true, properties: {a: {value: 1}}};

/**
With a chained behavior
@polymerBehavior
*/
Really.Really.Deep.Behavior = [
  {
    deep: true,
  },
  Do.Re.Mi.Fa
];

/**
@polymerBehavior
*/
CustomBehaviorList =
    [SimpleBehavior, AwesomeBehavior, Really.Really.Deep.Behavior];


/** @polymerBehavior */
export const exportedBehavior = {exported: true};

/** @polymerBehavior */
export default { defaultExported: true };
