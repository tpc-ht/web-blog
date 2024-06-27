---
title: three 案例
group: three
---

# Three

## .glb 文件加载

```ts
// 模型解析器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const loader = new GLTFLoader().setPath('product-exh/gltf/');
loader.load(modelName, (gltf) => {
  scene.add(gltf.scene);
});
```

## .glb 模型解压缩

获取官方解压文件
以 `r146` 版本为例！根据源码路径 `/examples/js/libs` 找到 `draco` 文件，并复制到 public 目录
以 `r158` 路径为 `/examples/jsm/libs`

```ts
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
// 设置解析路径
dracoLoader.setDecoderPath('./draco/');
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(/*..*/);
```

## 加载 .hdr 环境图

```ts
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
// 加载hdr环境图
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync('/xxx.hdr').then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});
```

## 加载 .glb 文件

```ts
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const gltfLoader = new GLTFLoader();
let lightBox = null;
gltfLoader.loadAsync('/xxx.glb').then((gltf: any) => {
  scene.add(gltf.scene);
});
```

## 导入模型启动对应的动画

```ts
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
const gltfLoader = new GLTFLoader()
gltfLoader.load('/xxx.glb', (gltf) => {
    const mixer = new THREE.AnimationMixer(gltf.scene)
    // animations 对应动画集合
    const action = mixer.clipAction(gltf.animations[0])
    // 启动
    const action.play()
    scene.add(gltf.scene)
})
```

## 鼠标点击事件

```ts
// 光线投射
const raycaster = new THREE.Raycaster();
// 鼠标位置对象
const mouse = new THREE.Vector2();
mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
mouse.y = -((event.offsetY / window.innerHeight) * 2 - 1);
raycaster.setFromCamera(mouse, camera);

const intersects = raycaster.intersectObject(scene);
//const intersects = raycaster.intersectObjects([scene])
if (intersects.length > 0) {
  // 碰撞到物体
} else {
}
```
