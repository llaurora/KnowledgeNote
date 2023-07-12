# Zustand源码浅析

[zustand](https://github.com/pmndrs/zustand) 是一个非常轻量的 react 状态管理库，借力了 react hooks，源码非常精简，使用方法也很简单。

> 由于 [zustand](https://github.com/pmndrs/zustand) 借力了 react hooks，其要求项目的 react 版本大于等于 16.8.0，另外只适用于 react 函数式组件。
> 

```jsx
import { create } from 'zustand'

// 创建store
const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))

// 在组件中使用
function BearCounter() {
  const bears = useStore((state) => state.bears)
  return <h1>{bears} around here...</h1>
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```

关于 [zustand](https://github.com/pmndrs/zustand) 更多介绍可直接移步[官网](https://zustand-demo.pmnd.rs/)，这儿就不再展开了。

[zustand](https://github.com/pmndrs/zustand) 核心代码就两个文件：`src/react.ts`、`src/vanilla.ts`（后面所贴源码为了更清晰直观，在源代码基础上省略了 TS 相关代码）。

# store创建

[zustand](https://github.com/pmndrs/zustand) 通过调用 **create** 方法（[见源码](https://github.com/pmndrs/zustand/blob/main/src/react.ts#L93)）创建 store，以 create 方法为入口来看下 store 的创建逻辑。

```jsx
export const create = (createState) => createState ? createImpl(createState) : createImpl)
```

create 就一行代码，有 createState 参数的时候，调用 createImpl 并返回，没有就直接返回 createImpl。

> 没有 createState 参数的应用场景可参见官网 [Auto Generating Selectors 章节](https://docs.pmnd.rs/zustand/guides/auto-generating-selectors)。
> 

顺着往下来到 **createImpl** 代码：

```jsx
const createImpl = (createState) => {
    // 在生产环境，如果createState不是一个函数，这儿会报警告
    if (import.meta.env?.MODE !== 'production' && typeof createState !== 'function') {
        console.warn(
            "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.",
        );
    }
    // 如果createState为函数则调用createStore方法返回api对象，否则直接返回createState
    const api = typeof createState === 'function' ? createStore(createState) : createState;
    // 定义useBoundStore方法
    const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
    // 在useBoundStore方法上，合并api对象上的属性，这个在写createSelectors的时候有用，可以前往[Auto Generating Selectors章节](https://docs.pmnd.rs/zustand/guides/auto-generating-selectors)。
    Object.assign(useBoundStore, api);
    // 最后直接返回合并了api对象上的属性的useBoundStore方法
    return useBoundStore;
};
```

在 createImpl 里面最后返回了 useBoundStore 方法，这个方法基于 useStore 和 api：

- useStore： 基于 react hook 中的 useSyncExternalStore，react 状态管理库其核心之一就是状态改变时如何触发更新渲染，像 react-redux、或者原生 createContext 亦或者 forceUpdate，都是间接调用 setState 方法去触发更新，而 useSyncExternalStore 是官方提供的另一种状态更新方案，这个后面再详细介绍。
- api对象：调用 createStore 方法并传入 createState 参数得到 api 对象（这儿假定传入的 createState 是一个函数）。
    
    ```jsx
     // 拿文章前面的示例来说的话，这儿的 createState 就是 
    (set) => ({
      bears: 0,
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 }),
    })
    ```
    

**createStote** 定义在`src/vanilla.ts` 文件中

```jsx
export const createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl)
```

调用 createStore ，实则是将 createState 参数透传给 createStoreImpl 方法（这儿同样忽略 createState 不存在的情况，源码里面之所以对 createState 不存在的情况下也做了处理，是为了让开发者自定义 store 而已）。

在 createStore 中调用的 createStoreImpl 方法同样定义在 `src/vanilla.ts` 文件中：

```jsx
const createStoreImpl = (createState) => {
  // 定义state对象
  let state;
  // listener函数集合，用Set结构保证同一个listener函数只添加一次，避免重复添加
  const listeners = new Set();

  // 更新state状态并调用注册到集合里面的所有listener，触发更新渲染，至于调用listener如何触发的更新就涉及到react hook的useSyncExternalStore了
  const setState = (partial, replace) => {
    // 如果partial是函数，则调用函数得到nextState，不然直接赋值partial给nextState
    // 比如前文示例increasePopulation，其partial就是(state) => ({ bears: state.bears + 1 })，而removeAllBears的partial就是{ bears: 0 }
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    // 通过比对nextState和state决定是否更新state状态以及更新触发渲染
    if (!Object.is(nextState, state)) {
      const previousState = state;
      // 如果replace为真值，直接替换原来的state
      state = replace ?? typeof nextState !== 'object' ? nextState : Object.assign({}, state, nextState);
      // 调用listener触发更新渲染
      listeners.forEach((listener) => listener(state, previousState));
    }
  }

  // 提供获取state的方法
  const getState = () => state;

  // 添加listener，返回值提供删除listener的方法
  // 其实这个subscribe会在react useEffect里面执行往Set集合里面添加listener，这个return对应的就是useEffect里面的return，
  const subscribe = (listener) => {
    listeners.add(listener);
    // Unsubscribe
    return () => listeners.delete(listener);
  }
  // 提供清除所有listener的方法，在后续将被移除，这个基本用不到，用subscibe的return提供清除就满足了
  const destroy = () => {
    if (import.meta.env?.MODE !== 'production') {
      console.warn(
        '[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected.'
      )
    }
    listeners.clear();
  }
  // 包裹成api对象导出，也就是我们创建的那个store
  const api = { setState, getState, subscribe, destroy };
	// 调用传入的createState创建state，这个state隐藏在该函数里面，通过对外暴露的api，间接的操作/访问state，其实就是闭包
  // 拿前文示例来说的话，此处的state值就是{bears: 0,increasePopulation: ()=> ...,removeAllBears: ()=> ...}
  state = createState(setState, getState, api);
  return api;
}
```

从 createStoreImpl 代码可以看出：通过 [zustand](https://github.com/pmndrs/zustand) 管理的状态 state 实则就是 createState 在通过 `create(createState)` ⇒ `createImpl(createState)` ⇒ `createStore(createState)` ⇒ `createStoreImpl(createState)` 透传后在 createStoreImpl 里面被执行后返回的那个返回值，而在 createStoreImpl 函数里面最后返回的并不是这个状态 state ，而是一个合并了更新 setState、访问 getState、订阅函数 subscribe、销毁函数 destroy 的 api 对象，管理的状态 state 实则就是以闭包的形式存在。

再回头看调用 create 创建的 store，这个 store 就是一个函数方法，对应 createImpl(createState) 里面的 useBoundStore（`const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn)`，更准确的说是一个自定义的 react hook，这个在后面会阐述，和redux的useSelector使用方法是一样的），只是在这个函数方法上叠加了 api 对象的属性。

# useSyncExternalStoreWithSelector

从前面的分析：

- state 的初始化：createState 被透传最后被执行的返回值；
- 更新 state：api.setState；
- 访问 state：api.getState；

state 的初始化、更新、访问都很清晰了。

但更新后为啥遍历 listener 函数集合然后挨着执行就能触发渲染更新？具体触发渲染更新流程又是怎样的？api 对象的订阅函数 subscribe 怎么用的？什么时候调用的 subscribe 往 listener 函数集合里面添加 listener 的？为啥在组件中使用的时候通过 `const bears = useStore((state) => state.bears))` 就能拿到对应的值？要搞清楚这些问题就要回到 `const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn)` 这一行代码上。

先看下 useStore 的源码

```jsx
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector';
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;

export function useStore(api,selector,equalityFn) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn
  )
  // useDebugValue可忽略
  useDebugValue(slice);
  return slice;
}
```

在  useStore 里面直接调用了 useSyncExternalStoreWithSelector 并返回，在调用 useSyncExternalStoreWithSelector 就传参了api 对象的subscribe 方法，除了用到了 api 对象外，外层 useBoundStore 传过来的 selector 和 equalityFn 也一并作为入参了。

现在关键的地方就在于 useSyncExternalStoreWithSelector 是如何运作了的了，前面所有的工作都像是在为 useSyncExternalStoreWithSelector 做铺垫。在 [zustand](https://github.com/pmndrs/zustand) 中 useSyncExternalStoreWithSelector 是通过 npm 包的形式引入的，这个 npm 包即 [use-sync-external-store](https://www.npmjs.com/package/use-sync-external-store) 是由 react 官方提供的，useSyncExternalStoreWithSelector 的源码也就很容易找到了：[react/packages/use-sync-external-store/src/useSyncExternalStoreWithSelector.js](https://github.com/facebook/react/blob/v18.2.0/packages/use-sync-external-store/src/useSyncExternalStoreWithSelector.js)。

```jsx
import * as React from 'react';
import is from 'shared/objectIs';
import {useSyncExternalStore} from 'use-sync-external-store/src/useSyncExternalStore';

// Intentionally not using named imports because Rollup uses dynamic dispatch
// for CommonJS interop.
const {useRef, useEffect, useMemo, useDebugValue} = React;

// Same as useSyncExternalStore, but supports selector and isEqual arguments.
// 从该英文注释也可以知道useSyncExternalStoreWithSelector和useSyncExternalStore基本是一样的
export function useSyncExternalStoreWithSelector(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
  // Use this to track the rendered snapshot.
  const instRef = useRef(null);
  let inst;
  // 判断是否重新赋值instRef
  if (instRef.current === null) {
    inst = {
      hasValue: false,
      value: null,
    };
    instRef.current = inst;
  } else {
    inst = instRef.current;
  }

  const [getSelection, getServerSelection] = useMemo(() => {
    // Track the memoized state using closure variables that are local to this
    // memoized instance of a getSnapshot function. Intentionally not using a
    // useRef hook, because that state would be shared across all concurrent
    // copies of the hook/component.
    let hasMemo = false;
    let memoizedSnapshot;
    let memoizedSelection;
    // 上面这三个变量都是以闭包的形式存在的
    const memoizedSelector = (nextSnapshot) => {
      if (!hasMemo) {
        // 第一次在useSyncExternalStore被执行的时候（具体来说是其里面的getSelection被执行的时候），没有暂存的结果，hasMemo也为false
        // 比如在re-render的时候，该useMemo的deps没有变化的话，hasMemo为true，再次到useSyncExternalStore执行取值state的时候，跳过这里面到后面去计算比对上次的state值和这次的state值
        // 而如果在re-render的时候，该useMemo的deps变了，自然hasMemo为false，但如果有自定义的isEqual，可以快速的从ins.value上取出上一次的state值来和这次的state值比对
        // The first time the hook is called, there is no memoized result.
        hasMemo = true;
        // 快照的所有state值被存下来
        memoizedSnapshot = nextSnapshot; 
        // 拿前面的示例来说，(state) => state.bears)就是这儿的selector
        const nextSelection = selector(nextSnapshot); // 这儿还是拿前面示例取值bears来说，初始为0
        // 是否有自定义的比较函数
        if (isEqual !== undefined) {
          // Even if the selector has changed, the currently rendered selection
          // may be equal to the new selection. We should attempt to reuse the
          // current value if possible, to preserve downstream memoizations.
          // 初始inst.hasValue是为false的
          if (inst.hasValue) {
            // 如果inst.hasValue不为空，比对上一次值和这一次的值，如果相同则直接返回上一次的值
            const currentSelection = inst.value;
            if (isEqual(currentSelection, nextSelection)) {
              memoizedSelection = currentSelection;
              return currentSelection;
            }
          }
        }
        // 暂存这次的值
        memoizedSelection = nextSelection;
        // 返回nextSelection
        return nextSelection;
      }

      // We may be able to reuse the previous invocation's result.
      // 之前暂存的所有state值
      const prevSnapshot = memoizedSnapshot;
      // 之前暂存的值
      const prevSelection = memoizedSelection;
      // 比对前后快照的所有state值，如果一样，直接返回前一次暂存的值
      if (is(prevSnapshot, nextSnapshot)) {
        // The snapshot is the same as last time. Reuse the previous selection.
        return prevSelection;
      }
      // 快照的所有state值变更了，则重新取值
      // The snapshot has changed, so we need to compute a new selection.
      const nextSelection = selector(nextSnapshot);

      // If a custom isEqual function is provided, use that to check if the data
      // has changed. If it hasn't, return the previous selection. That signals
      // to React that the selections are conceptually equal, and we can bail
      // out of rendering.
      // 如果有自定义isEqual则再次比对此次取的值和上次的值是否一样，一样的话，直接返回上次的值
      if (isEqual !== undefined && isEqual(prevSelection, nextSelection)) {
        return prevSelection;
      }
      // 暂存此次的快照所有state值
      memoizedSnapshot = nextSnapshot;
      // 暂存此次取得的值
      memoizedSelection = nextSelection;
      return nextSelection;
    };
    // Assigning this to a constant so that Flow knows it can't change.
    // 从取出快照所有的state的selector改为取部分state值的selector
    const maybeGetServerSnapshot =
      getServerSnapshot === undefined ? null : getServerSnapshot;
    const getSnapshotWithSelector = () => memoizedSelector(getSnapshot());
    const getServerSnapshotWithSelector =
      maybeGetServerSnapshot === null
        ? undefined
        : () => memoizedSelector(maybeGetServerSnapshot());
    return [getSnapshotWithSelector, getServerSnapshotWithSelector];
  }, [getSnapshot, getServerSnapshot, selector, isEqual]);
  // 调用useSyncExternalStore hook
  const value = useSyncExternalStore(
    subscribe,
    getSelection, // 这里已经变成取部分state的selector了
    getServerSelection,
  );
  // 更新inst
  useEffect(() => {
    // $FlowFixMe[incompatible-type] changing the variant using mutation isn't supported
    inst.hasValue = true;
    // $FlowFixMe[incompatible-type]
    inst.value = value;
  }, [value]);
  // useDebugValue忽略
  useDebugValue(value);
  // 返回调用useSyncExternalStore后的返回值
  return value;
}
```

从 useSyncExternalStoreWithSelector 的逻辑来看，主要是让 useSyncExternalStore 支持了可以取部分 state 值和自定义比对函数 isEqual，然后取部分 state 值的 selector 通过 useMemo 做了一些处理：

- 组件中使用的话通常没有对 selector 做处理，每次 re-render的时候，上面的 useMemo  的 deps 会变化，hasMemo 每次都为 false，但如果有自定义的 isEqual，借助每次会在 useEffect 里面更新的 inst，直接比对上一次的取值和这次的取值，如果一样，直接返回上次的值，省略后续比对快照所有 state值和此次的所有快照 statez 值，可以节省一点儿开销；
    
    ```jsx
    function BearCounter() {
      // 没有对selector做处理，比如将selector提到外面，或者用useMemo包一下
      const bears = useStore((state) => state.bears)
      return <h1>{bears} around here...</h1>
    }
    ```
    
- 如果在组件中使用的时候对 selector 做了处理，比如提到外面或者用 useMemo 包一下，不传 isEqual 或者 isEqual 传了但和 selector 也做了一样的处理，保证上面的 useMemo 的 deps 不变，也就是比对前后所有快照值，比对前后取的部分值，决定是返回前一次的值，还是这一次的值；

> 之所以不用 useRef 存储上一次的值，在 useSyncExternalStoreWithSelector 注释里也说明了，是为了防止比如兄弟组件或者hook状态共享的问题，可以 [codesandbox useShareableState](https://codesandbox.io/s/floral-wildflower-pp0bg?file=/src/App.js:90-107) 查看示例。
> 

这里个人感觉使用 useMemo 去对 selector 做的一些处理并没有带来多少优化，useMemo 本来在 re-render 的时候就有比对 deps 的开销，而且里面还得去比对前后的值，比对快照的所有 state 值。如果每次 getSelection 的时候直接重新取值，然后依然使用闭包存储上一次的值，直接比对前后值决定返回旧值还是新值是不是更快？

```jsx
// 伪代码...
const getSelection = (() => {
    let prevSelection;
    return () => {
        const nextSelection = selector(getSnapshot());
        if (isEqual !== undefined && isEqual(prevSelection, nextSelection)) {
            return prevSelection;
        }
        prevSelection = nextSelection;
        return nextSelection;
    };
})();
```

# useSyncExternalStore

上面分析了 useSyncExternalStoreWithSelector，但不难看出 useSyncExternalStoreWithSelector 只是对 useSyncExternalStore 做了一些封装处理让 useSyncExternalStore 支持了 selector 和 isEqual 入参而已。

useSyncExternalStore 定义在 [react/packages/use-sync-external-store/src/useSyncExternalStore.js](https://github.com/facebook/react/blob/v18.2.0/packages/use-sync-external-store/src/useSyncExternalStore.js)，官方文档也对该 hook 做了阐述 — [useSyncExternalStore传送门](https://react.dev/reference/react/useSyncExternalStore)。

在 react 组件初次挂载的时候对应的是 [mountSyncExternalStore](https://github.com/facebook/react/blob/v18.2.0/packages/react-reconciler/src/ReactFiberHooks.old.js#L1268)、re-render更新渲染的时候对应的是 [updateSyncExternalStore](https://github.com/facebook/react/blob/v18.2.0/packages/react-reconciler/src/ReactFiberHooks.old.js#L1360)。

## mountSyncExternalStore

```jsx
function mountSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  // 当前正在构建的fiber
  const fiber = currentlyRenderingFiber;
  // 这儿不详细介绍了，给当前fiber创建hook对象，如果是fiber的第一个hook对象，存放在fiber的memoizedState上，如果当前fiber存在hook对象用next连成单链表
  const hook = mountWorkInProgressHook();

  let nextSnapshot;
  // 客户端渲染isHydrating为false
  const isHydrating = getIsHydrating();
  if (isHydrating) {
    // ...省略部分代码
  } else {
    // 取出快照state值
    nextSnapshot = getSnapshot();
    // ...省略部分开发环境代码
    // Unless we're rendering a blocking lane, schedule a consistency check.
    // Right before committing, we will walk the tree and check if any of the
    // stores were mutated.
    //
    // We won't do this if we're hydrating server-rendered content, because if
    // the content is stale, it's already visible anyway. Instead we'll patch
    // it up in a passive effect.
    // 根fiber的副本，当前正在构建的fiber树
    const root = getWorkInProgressRoot();

    if (root === null) {
      throw new Error(
        'Expected a work-in-progress root. This is a bug in React. Please file an issue.',
      );
    }

    if (!includesBlockingLane(root, renderLanes)) {
      pushStoreConsistencyCheck(fiber, getSnapshot, nextSnapshot);
    }
  }

  // Read the current snapshot from the store on every render. This breaks the
  // normal rules of React, and only works because store updates are
  // always synchronous.
  // 将快照state值存在hook的memoizedState属性上
  hook.memoizedState = nextSnapshot;
  const inst = {
    value: nextSnapshot,
    getSnapshot,
  };
  // 将inst值挂在hook的queue属性上
  hook.queue = inst;

  // Schedule an effect to subscribe to the store.
  // 在useEffect hook里面去订阅store，前面api对象的subscribe其实是在这儿用的
  mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [subscribe]);

  // Schedule an effect to update the mutable instance fields. We will update
  // this whenever subscribe, getSnapshot, or value changes. Because there's no
  // clean-up function, and we track the deps correctly, we can call pushEffect
  // directly, without storing any additional state. For the same reason, we
  // don't need to set a static flag, either.
  // TODO: We can move this to the passive phase once we add a pre-commit
  // consistency check. See the next comment.
  // 给fiber打上Passive标记，表示该fiber有useEffect hook
  fiber.flags |= PassiveEffect;
  // 创建effect对象，
  pushEffect(
    HookHasEffect | HookPassive, // 给effect对象打tag标记，注意useLayout的tag是HookHasEffect | HookLayout
    updateStoreInstance.bind(null, fiber, inst, nextSnapshot, getSnapshot),
    undefined,
    null,
  );

  return nextSnapshot;
}
```

简单梳理下 mountSyncExternalStore 里面的逻辑：

1. mountSyncExternalStore 同其他 hook  一样先创建 hook对象然后挂在当前 fiber.memoizedState 的 hook 链表上；
2. 调用 getSnapshot 取得值赋值给 nextSnapshot 并将其存放在 hook.memoizedState 上；
3. 赋值 hook.queue 为  inst 对象；
4. 调用 mountEffect 添加一个 useEffect hook，useEffect 的 create 即为 `subscribeToStore.bind(null, fiber, inst, subscribe)`，deps即为`[subscribe]`，至于useEffect hook 等逻辑这儿也不再展开了，可前往 [React Hooks初次挂载](https://github.com/llaurora/KnowledgeNote/blob/master/React/React%20Hooks%E5%88%9D%E6%AC%A1%E6%8C%82%E8%BD%BD.md) 查看；
5. 调用 pushEffect 创建一个带有 HookHasEffect | HookPassive 即 HasEffect | Passvie 标记的 effect 对象；
6. 返回 nextSnapshot；

拿 `<BearCounter/>` 这个组件来说明的话（假设其是根组件，并忽略 child 等细节），组件初次挂载调用 useSyncExternalStore 即 mountSyncExternalStore 后结构如下：

![mountSyncExternalStore.svg](assets/mountSyncExternalStore.svg)

到这儿知道在 [zustand](https://github.com/pmndrs/zustand) 里调用 createStoreImpl 导出的api对象的 subscribe 在什么时候被执行了吧，这个被 subscribeToStore 重新bind生成新的函数后在 useEffect 里面被执行的，为啥要在 subscribe 里面有一个 return 函数，这里也就明白了，这个 return 函数就是 useEffect 里面的 return，在组件卸载或者 deps 变化的时候会被执行，换到  [zustand](https://github.com/pmndrs/zustand) 里面就是组件卸载或者 deps 变化的时候，上一次绑定的 listener 会被从集合里面删除，而后重新添加。

subscribe 什么时候执行添加 listener 以及 listener 何时被清楚现在知道了，是在 useEffect 里面执行的 subscribe 然后将 listener 添加到集合里面的：

```jsx
function subscribeToStore(fiber, inst, subscribe) {
  const handleStoreChange = () => {
    // The store changed. Check if the snapshot changed since the last time we
    // read from the store.
    if (checkIfSnapshotChanged(inst)) {
      // Force a re-render.
      forceStoreRerender(fiber);
    }
  };
  // Subscribe to the store and return a clean-up function.
  return subscribe(handleStoreChange);
}
```

添加的 listener 就是 handleStoreChange，触发 listener 执行就是触发 handleStoreChange 执行，触发 handleStoreChange 执行就进入判断是否触发更新渲染的逻辑了：如果 `checkIfSnapshotChanged(inst)` 为true 则调用 [forceStoreRerender](https://github.com/facebook/react/blob/v18.2.0/packages/react-reconciler/src/ReactFiberHooks.old.js#L1502) 进入更新渲染逻辑。

checkIfSnapshotChanged 源码如下：

```jsx
function checkIfSnapshotChanged(inst) {
  // 始终可以通过getSnapshot拿到最新的值
  const latestGetSnapshot = inst.getSnapshot;
  // useSyncExternalStore挂载当时通过getSnapsho取得的值，当调用api.setState时更新后该值便是旧值了
  const prevValue = inst.value;
  try {
    // 通过is比对新旧值是否一样，不一样的话，返回true，继而触发后续的更新渲染流程
    const nextValue = latestGetSnapshot();
    return !is(prevValue, nextValue);
  } catch (error) {
    return true;
  }
}
```

```jsx
 const handleStoreChange = () => {
    // The store changed. Check if the snapshot changed since the last time we
    // read from the store.
    if (checkIfSnapshotChanged(inst)) {
      // Force a re-render.
      forceStoreRerender(fiber);
    }
  };
```

## updateSyncExternalStore

上面梳理了 useSyncExternalStore 在组件初次挂载时对应的 mountSyncExternalStore 流程逻辑，那当组件 re-render 的时候，useSyncExternalStore 里面又是如何应对的，这就对应到该 hook 更新时调用的 [updateSyncExternalStore](https://github.com/facebook/react/blob/v18.2.0/packages/react-reconciler/src/ReactFiberHooks.old.js#L1360)：

```jsx
function updateSyncExternalStore<T>(subscribe, getSnapshot, getServerSnapshot) {
  // 当前正在构建的fiber
  const fiber = currentlyRenderingFiber;
  // 更新hook，更新的时候其实是对原来的hook对象复制一份，有更新的更新便是
  const hook = updateWorkInProgressHook();
  // Read the current snapshot from the store on every render. This breaks the
  // normal rules of React, and only works because store updates are
  // always synchronous.
  // 同样的调用getSnapshot取得最新的值并赋值给nextSnapshot
  const nextSnapshot = getSnapshot();
  // 省略部分开发环境代码
  // 将之前存在hook.memoizedState的上一次的nextSnapshot取出来
  const prevSnapshot = hook.memoizedState;
  // 通过is比对看snapshot是否变化
  const snapshotChanged = !is(prevSnapshot, nextSnapshot);
  if (snapshotChanged) {
    // 变化了的话，把最新的snapshot赋值给hook.memoizedState，并标记更新
    hook.memoizedState = nextSnapshot;
    markWorkInProgressReceivedUpdate();
  }
  // 取出之前存放在hook.queue上的inst对象
  const inst = hook.queue;
  // 后面useEffect相关逻辑不再展开了，简单说就是判断是否去useEffect里面重新添加listener
  updateEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
    subscribe,
  ]);

  // Whenever getSnapshot or subscribe changes, we need to check in the
  // commit phase if there was an interleaved mutation. In concurrent mode
  // this can happen all the time, but even in synchronous mode, an earlier
  // effect may have mutated the store.
  if (
    inst.getSnapshot !== getSnapshot ||
    snapshotChanged ||
    // Check if the susbcribe function changed. We can save some memory by
    // checking whether we scheduled a subscription effect above.
    (workInProgressHook !== null &&
      workInProgressHook.memoizedState.tag & HookHasEffect)
  ) {
    fiber.flags |= PassiveEffect;
    pushEffect(
      HookHasEffect | HookPassive,
      updateStoreInstance.bind(null, fiber, inst, nextSnapshot, getSnapshot),
      undefined,
      null,
    );

    // Unless we're rendering a blocking lane, schedule a consistency check.
    // Right before committing, we will walk the tree and check if any of the
    // stores were mutated.
    const root: FiberRoot | null = getWorkInProgressRoot();

    if (root === null) {
      throw new Error(
        'Expected a work-in-progress root. This is a bug in React. Please file an issue.',
      );
    }

    if (!includesBlockingLane(root, renderLanes)) {
      pushStoreConsistencyCheck(fiber, getSnapshot, nextSnapshot);
    }
  }

  return nextSnapshot;
}
```

updateSyncExternalStore 简而言之就是保证了在 subscribe、selector 任何一个变化的时候，能及时更新 listener。

# 小结

至此 [zustand](https://github.com/pmndrs/zustand)  的流程逻辑就解析完了，下面简单总结梳理下：

1. 调用 create 创建 store，这个 store 就是一个 react 自定义 hook，这个自定义 hook 基于 api 对象和 useSyncExternalStore 这个 react 官方提供的 hook;
2. api 对象包含有更新状态setState、访问状态getState、添加listener的订阅subscribe、所有listener的清除destroy；
3.  这个状态state，就是执行了在创建 store 调用 create(createState) 时的入参的那个函数 createState，由用户在创建store的时候自定义；
4. 订阅 subscribe 的执行然后添加 listender 的时机其实就是在 useEffect 里面执行的，只是借助了 useSyncExternalStore 没有显示的调用 useEffect，其内部调用 useEffect 的实现；
5. 调用 setState 更新了状态遍历执行 listener 就能触发更新渲染，是因为这个 listener 就是 handleStoreChange，在里面会涉及比对前后状态值然后可以进入更新渲染逻辑；

# 写一个toy版

```jsx
import { useEffect, useRef, useState } from "react";

const createStore = (createState) => {
    let state;
    const listeners = new Set();

    // 访问state
    const getState = () => state;

    // 更新state
    const setState = (partial, replace) => {
        const nextState = typeof partial === "function" ? partial(state) : partial;
        state = replace ? nextState : { ...state, ...nextState };
        listeners.forEach((listener) => {
            listener();
        });
    };

    // 订阅添加listener
    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    // 合并api对象
    const api = { getState, setState, subscribe };
    state = createState(setState, getState, api);
    return api;
};

export const create = (createState) => {
    const api = createStore(createState);

    const useBondStore = (selector, equalityFn) => {
        const [, forceUpdate] = useState({});
        const newSelectionRef = useRef();
        const prevSelectionRef = useRef();
        const selectorRef = useRef();
        const equalityFnRef = useRef();

        selectorRef.current = selector;
        equalityFnRef.current = equalityFn;
        newSelectionRef.current = selector(api.getState());

        useEffect(() => {
            const listener = () => {
                // 函数方法的话，不进入比较前后值以及后续渲染逻辑
                if (typeof newSelectionRef.current === "function") {
                    return;
                }
                const isEqual = typeof equalityFnRef.current === "function" ? equalityFnRef.current : Object.is;
                if (isEqual(newSelectionRef.current, prevSelectionRef.current)) {
                    return;
                }
                prevSelectionRef.current = newSelectionRef.current;
                forceUpdate({});
            };
            const unsubscribe = api.subscribe(listener);
            return unsubscribe;
        }, []);

        return newSelectionRef.current;
    };

    Object.assign(useBondStore, api);
    return useBondStore;
};
```