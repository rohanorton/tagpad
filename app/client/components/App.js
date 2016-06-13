import 'babel-polyfill';
import React from 'react';
import Menu from './Menu/Menu';
import Browse from './Browse/Browse.js';
import NoteForm from './NoteForm/NoteForm.js';
import Login from './Login/Login.js';
import itemHelpers from './../helpers/items';

function NotFound() {
  return (
    <div className="ui main text container">
      <h1 className="ui header"> Not Found </h1>
      <a href="#/browse">go back to browse page</a>
    </div>
  );
}

function loginSubmit(e) {
  e.preventDefault();
  alert('loginSubmit, value = ' + JSON.stringify(e.target.value));
}


// either return temp new item from local store or get new empty item
function getNewItem(props) {
  if (props.newItem) {
    return props.newItem;
  }
  return itemHelpers.getNewItem();
}


function App (props) {
  // props {location:Array, query:Object}
  const page = props.location[0];
  if (page === "login") {
    return <Login onSubmit={loginSubmit}/>;
  } else if (page === "browse") {
    return (
      <div>
        <Menu page={page} />
        <Browse search={props.query.search || ''}/>
      </div>
    );
  } else if (page === "add") {
    return (
      <div>
        <Menu page={page} />
        <NoteForm 
          item={getNewItem(props)} 
          update={itemHelpers.updateNewItem}
          submit={itemHelpers.submitNewItem}
          cancel={itemHelpers.cancel}
          />;
      </div>
    );
  } else if (page === "items") {
    if (props.location.length === 2) {
      let id = Number(props.location[1]);
      return (
        <div>
          <Menu page={page} />
          <h1> todo: Note edit form for item with id: {id} here </h1>
          <NoteForm itemId={id} />
        </div>
      );
    }
  } 
  return <NotFound />;
}

module.exports = App;
