export default {
  input: 'src/index.js',
  output: {
    file: './dist/index.js',
    format: 'umd',
    name: 'ReduxInjectHelper',
    globals: {
      'redux-inject-helper': 'ReduxInjectHelper',
      'redux': 'redux',
      '@reduxjs/toolkit': 'tooltik',
      'immer': 'produce'
    },
  }
}