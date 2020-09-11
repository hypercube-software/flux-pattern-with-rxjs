import React from 'react';
import MyAppStore from './MyAppStore';
import ItemsViewer from './ItemsViewer';
import css from './App.less';

export default class App extends React.Component {
  constructor(props){
    super(props);

    this.onUpdateClick = this.onUpdateClick.bind(this);
    this.onAddRemoveClick = this.onAddRemoveClick.bind(this);

    this.state = {
      displayAnotherItemsViewer: false
    };

    MyAppStore.updateModel({
      listOfItems: []
    });
  }

  onUpdateClick(){
    let now = (new Date()).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone: "UTC"
    });
    
    MyAppStore.updateModel({
      listOfItems: [
        "item 1 at "+now,
        "item 2 at "+now,
        "item 3 at "+now
      ]
    });
  }
  
  onAddRemoveClick(){
    this.setState({
      displayAnotherItemsViewer: !this.state.displayAnotherItemsViewer
    });
  }

  render()
  {
    return (
      <div>
        <div className="buttons">
          <button className="myButton" onClick={this.onUpdateClick}>Update Store</button>
          <button className="myButton" onClick={this.onAddRemoveClick}>Add/Remove another component</button>
        </div>
        <ItemsViewer/>
        {this.state.displayAnotherItemsViewer?<ItemsViewer/>:null}
      </div>
    );
  }
}

