import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  locale: {
    default: 'zh-CN',
    baseSeparator: '-',
  },
  fastRefresh: {},
});
