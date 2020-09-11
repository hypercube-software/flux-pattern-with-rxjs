import React from 'react';
import MyAppStore from './MyAppStore';
import css from './ItemsViewer.less';

export default class ItemsViewer extends React.Component {
    constructor(props){
        super(props);
    
        this.onModelUpdated = this.onModelUpdated.bind(this);
            
        this.storeHandle = null;

    }

    componentDidMount()
    {
        console.log("ItemsViewer::componentDidMount subscribe to store...");
        this.storeHandle = MyAppStore.subscribe("model",this.onModelUpdated);
    }

    onModelUpdated()
    {
        console.log("ItemsViewer::onModelUpdated store changed...");
        this.setState({});
    }

    componentWillUnmount()
    {
        console.log("ItemsViewer::componentWillUnmount unsubscribe from store...");
        if (this.storeHandle)
        {
            this.storeHandle.unsubscribe();
            this.storeHandle = null;
        }
    }

    render()
    {
        return (
            <div className="items-viewer">
                <div>This component subscribe to the store</div>
                {MyAppStore.model.listOfItems.map(item=><div>{item}</div>)}
            </div>
        );
    }
}