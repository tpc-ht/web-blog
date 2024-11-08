---
title: 使用 inject / invoke 调用自定义组件内部的函数
group: formily
---

# 使用 inject / invoke 调用自定义组件内部的函数

下列实现一组自定义 TreeSelect 组件，并使用 [inject / invoke](https://core.formilyjs.org/zh-CN/api/models/field#inject) 调用自定义组件内部的函数。

```ts
import { BusinessTreeSelect as ProBusinessTreeSelect } from '@/components';
import { connect, useField } from '@formily/react';
import { useEffect, useRef } from 'react';

const BusinessTreeSelect = connect((props: any) => {
  const field = useField();
  const selRef = useRef<any>();
  useEffect(() => {
    field.inject({
      refresh: selRef.current?.refresh,
      run: selRef.current?.run,
    });
  }, []);
  return <ProBusinessTreeSelect {...props} ref={selRef} />;
});
```

在 Markup Schema 模式下使用

```ts
<SchemaField.String
  //....
  name="strId"
  x-reactions={{
    dependencies: ['orgId'],
    fulfill: {
      run: `{{$self.value=undefined;$deps[0] && $self.invoke('run',{orgId:$deps[0]});}}`,
    },
  }}
/>
```

在 JSON Schema 模式下使用

```json
{
  "strId": {
    //...
    "x-reactions": {
      "dependencies": ["orgId"],
      "fulfill": {
        "run": "{{ $self.value=undefined;$deps[0] && $self.invoke('run',{orgId:$deps[0]}); }}"
      }
    }
  }
}
```

在 effect 中使用

```ts
const form = createForm({
  effects: () => {
    onFieldValueChange('orgId', async (field) => {
      const value = field.value;
      form.setFieldState('strId', (e) => {
        e.value = undefined;
        value && e.invoke('run', { orgId: value });
      });
    });
  },
});
```
