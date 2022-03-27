const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { rollup } = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const pluginTS = require('@rollup/plugin-typescript');
const { visualizer } = require('rollup-plugin-visualizer');
const minimist = require('minimist');

async function build() {
  console.log('Start building...');
  const { analyze } = minimist(process.argv.slice(2));

  const entrieFiles = glob.sync('**/*.ts', {
    cwd: path.resolve(process.cwd(), 'src'),
  });

  const input = entrieFiles.reduce((obj, filename) => {
    const moduleName = path.basename(filename, '.ts');
    return {
      ...obj,
      [moduleName]: path.join(process.cwd(), 'src', filename),
    };
  }, {});

  const bundle = await rollup({
    input,
    plugins: [
      pluginTS({
        // 指定生成 *.d.ts 类型文件
        tsconfig: path.resolve(process.cwd(), 'tsconfig.json'),
      }),
      nodeResolve(),
      analyze &&
        visualizer({
          filename: path.resolve(process.cwd(), 'analyze/stats.html'),
          open: true,
          gzipSize: true,
        }),
    ].filter(Boolean),
  });

  const outputDir = path.resolve(process.cwd(), 'lib');
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, {
      recursive: true,
      force: true,
    });
  }

  await bundle.write({
    dir: path.resolve(process.cwd(), 'lib'),
  });
  console.log('build successfully!');
  await bundle.close();
}

build().catch((err) => {
  console.log(err);
  process.exit(1);
});
