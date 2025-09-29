import type { UserConfig } from 'vite'

export default {
  build: {
    lib: {
      entry: 'src/widget.ts',
      fileName: () => `parishconnect-widget.js`,
    },
  },
} satisfies UserConfig
