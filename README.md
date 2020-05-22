Redux 공부를 시작하기 전 편리함을 몸으로 익히기 위해 VanillaJS 에서의 state 관리 방법을 살펴보자.

```jsx
const add = document.getElementById("add");
const minus = document.getElementById("minus");
const number = document.getElementById("number");

let count = 0;
number.innerText = count;

const updateText = () => {
    number.innerText = count;
}

const handleAdd = () => {
    count = count + 1;
    //console.log("add", count);
    updateText();
}

const handleMinus = () => {
    count = count - 1;
    //console.log("minus", count);
    updateText();
}

add.addEventListener("click", handleAdd);
minus.addEventListener("click", handleMinus);
```

## redux 방식

`store` 은 데이터를 저장하기 위한 곳이다.

`reducer` 데이터를 modify 하는 function.

```jsx
import { createStore } from 'redux';

const add = document.getElementById("add");
const minus = document.getElementById("minus");
const number = document.getElementById("number");

const countModifier = (count = 0) => {
    return count;
};

const countStore = createStore(countModifier);

console.log(countStore.getState());
```

여기서 `countStore` 은 수를 저장하기 위한 store 이고 `countModifier` 은 단순히 1로 상태를 바꿔준다.

`countStore` 의 데이터는 `getState` 를 통해 접근 할 수 있다.

다른 함수들은 store 의 값을 변경 할 수 없다.

그럼 어떻게 바꾸라는 것을 지시 할 수 있을까. action을 통해서 한다.

## action

```jsx
const countModifier = (count = 0, action ) => {
    console.log(action);
    return count;
};

const countStore = createStore(countModifier);

countStore.dispatch({ type: "Hello" });
```

dispatch 가 modifier 에 action을 보내서 호출한다. 콘솔에서 store initialize 와, `{ type: "Hello" }` 두개의 log 를 볼 수 있다.

### action을 통해 state 조작 하기.

```jsx
const countModifier = (count = 0, action ) => {
    if(action.type === "ADD") {
        return count + 1;
    }
    else if(action.type === "MINUS") {
        return count - 1;
    }
    else {
        return count
    }
};

const countStore = createStore(countModifier);

countStore.dispatch({ type: "ADD" });
countStore.dispatch({ type: "ADD" });
countStore.dispatch({ type: "ADD" });

console.log(countStore.getState());
```

### 더하기 빼기 Handler 조작 예시

```jsx
const countModifier = (count = 0, action ) => {
    if(action.type === "ADD") {
        return count + 1;
    }
    else if(action.type === "MINUS") {
        return count - 1;
    }
    else {
        return count
    }
};

const countStore = createStore(countModifier);

const handleAdd = () => {
    countStore.dispatch({
        type: "ADD"
    });
}

const handleMinus = () => {
    countStore.dispatch({
        type: "MINUS"
    });
}

add.addEventListener("click", handleAdd);
minus.addEventListener("click", handleMinus);
```

### subscribe

store 에 변화가 있을 때마다 호출됨. 해당 부분을 통해 DOM 을 조작 해주면 됨.

```jsx
import { createStore } from 'redux';

const add = document.getElementById("add");
const minus = document.getElementById("minus");
const number = document.getElementById("number");

const countModifier = (count = 0, action ) => {
    if(action.type === "ADD") {
        return count + 1;
    }
    else if(action.type === "MINUS") {
        return count - 1;
    }
    else {
        return count
    }
};

const countStore = createStore(countModifier);

const onChange = () => {
    number.innerText = countStore.getState();
}
countStore.subscribe(onChange);

const handleAdd = () => {
    countStore.dispatch({
        type: "ADD"
    });
}

const handleMinus = () => {
    countStore.dispatch({
        type: "MINUS"
    });
}

add.addEventListener("click", handleAdd);
minus.addEventListener("click", handleMinus);
```

### recap refactor

**[switch case 사용하기]**

```jsx
switch (action.type) {
        case "ADD": 
            return count + 1;
        case "MINUS":
            return count - 1;
        default:
            return count;
    }
```

**[const 사용하기]**

```jsx
const PLUS = "PLUS";
const MINUS = "MINUS";
```

오타로 인한 action.type 에러를 방지해준다.

## react-redux

index 에 Provider를 등록 해주어야 한다.

```jsx
// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

우선 store 을 만드는 과정은 위와 같고 다음과 같은 todo 를 저장하는 store 을 만들었다.

```jsx
// store.js

import {createStore} from "redux";

const ADD = "ADD";
const DELETE = "DELETE";

export const addToDo = text => {
    return {
        type: ADD,
        text
    }
}

export const deleteToDo = id => {
    return {
        type: DELETE,
        id
    }
}

const reducer = (state = [], action) => {
    switch(action.type) {
        case ADD:
            return [{ text: action.text, id: Date.now() }, ...state];
        case DELETE:
            return state.filter(toDo => toDo !== action.id);
        default:
            return state;
    }
};

const store = createStore(reducer);

//store.subscribe();

export default store;
```

여기서 subscribe 를 등록해야 store 에 변화가 있을 때 화면에 다시 그려 줄 수 있다. 여기서 `react-redux` 가 쓰인다.

## connect

react-redux 에서 가장 중요한 부분으로, react component 를 store 에 연결 시켜준다.

```jsx
// Home.jsx

import React from "react";
import { connect } from "react-redux";
import { actionCreators } from "../store";

function Home({ toDos, ...rest }) {
  console.log(rest);
  const [text, setText] = useState("");
  function onChange(e) {
    setText(e.target.value);
  }
  function onSubmit(e) {
    e.preventDefault();
    setText("");
    rest.addToDo(text);
  }
  return (
    <>
      <h1>To Do</h1>
      <form onSubmit={onSubmit}>
        <input type="text" value={text} onChange={onChange} />
        <button>Add</button>
      </form>
      <ul>{JSON.stringify(toDos)}</ul>
    </>
  );
}

function mapStateToProps(state, ownProps) {
	return { toDos: state };
}

export default connect(getCurrentState)(Home);
```

## mapStateToProps

store의 state 는 `connect` 와 `mapStateToProps` 를 통해 컴포넌트에서 이용 할 수 있다. `mapStateToProps` 의 리턴 값이 component 의 props 에 들어간다.

- `state` 는 store의 state
- `ownProps` 는 원래 받은 Prop

## mapDispatchToProps

store 의 상태를 수정 할 수 있는 dispatch 를 컴포넌트의 Prop 으로 사용하기 위함이다.

```jsx
// Home.js
// ...
function mapDispatchToProp(dispatch, ownProps) {
  return { dispatch };
}
```

해당 코드는 dispatch 가 컴포넌트의 prop으로 들어 올 수 있게 해준다.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4583d1cc-317b-4fb7-9e07-cdcfc2bcc50b/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4583d1cc-317b-4fb7-9e07-cdcfc2bcc50b/Untitled.png)

이런방법으로는 잘 사용하지 않고. actionCreator 을 만드는 방식을 쓴다.

```jsx
// store.js
// ...
import {createStore} from "redux";

const ADD = "ADD";

const addToDo = text => {
    return {
        type: ADD,
        text
    }
}

export const actionCreators = {
    addToDo,
}
```

```jsx
//Home.js

function mapDispatchToProp(dispatch, ownProps) {
  return { addToDo: text => dispatch(actionCreators.addToDo(text)) };
}
```

이렇게 하면 prop 에서 addToDo 를 호출해서 state 를 변경 할 수 있다.

## 정리: 할일 목록 만들기

```jsx
// Home.js

import React, { useState } from "react";
import { connect } from "react-redux";
import { actionCreators } from "../store";
import ToDo from "../components/ToDo";

function Home({ toDos, addToDo }) {
  const [text, setText] = useState("");
  function onChange(e) {
    setText(e.target.value);
  }
  function onSubmit(e) {
    e.preventDefault();
    addToDo(text);
    setText("");
  }
  return (
    <>
      <h1>To Do</h1>
      <form onSubmit={onSubmit}>
        <input type="text" value={text} onChange={onChange} />
        <button>Add</button>
      </form>
      <ul>
        {toDos.map((toDo) => (
          <ToDo {...toDo} />
        ))}
      </ul>
    </>
  );
}

function mapStateToProp(state, ownProps) {
  return { toDos: state };
}

function mapDispatchToProp(dispatch, ownProps) {
  return { addToDo: (text) => dispatch(actionCreators.addToDo(text)) };
}

export default connect(mapStateToProp, mapDispatchToProp)(Home);
```

```jsx
// ToDo.js

import React from "react"
import { connect } from "react-redux";
import { actionCreators } from "../store";

function ToDo ({text ,onBtnClick}) {

    return (
        <li>
            {text} <button onClick={onBtnClick}>DEL</button>
        </li>
    )
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onBtnClick: () => dispatch(actionCreators.deleteToDo(parseInt(ownProps.id)))
    }
}

export default connect(null, mapDispatchToProps)(ToDo);
```

```jsx
// store.js

import React from "react"
import { connect } from "react-redux";
import { actionCreators } from "../store";

function ToDo ({text ,onBtnClick}) {

    return (
        <li>
            {text} <button onClick={onBtnClick}>DEL</button>
        </li>
    )
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onBtnClick: () => dispatch(actionCreators.deleteToDo(parseInt(ownProps.id)))
    }
}

export default connect(null, mapDispatchToProps)(ToDo);
```