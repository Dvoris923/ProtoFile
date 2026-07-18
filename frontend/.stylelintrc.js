export default {
  extends: "@mate-academy/stylelint-config",
  rules: {
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['theme'] }],
  },
};
