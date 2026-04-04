import antfu from '@antfu/eslint-config'

export default antfu({
  vue: {
    overrides: {
      'vue/block-order': ['error', { order: [['script', 'template'], 'style'] }],
    },
  },
  ignores: ['public/mockServiceWorker.js'],
})
