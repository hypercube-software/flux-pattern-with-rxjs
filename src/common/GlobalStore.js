import {Observable} from 'rxjs';
import { publish,filter } from 'rxjs/operators';

// taken from https://stackoverflow.com/a/25921504/7921777
let deepCopy = (o) => {  
  if (o === null)
    return null;
  if (o === undefined)
    return undefined;

  let out = Array.isArray(o) ? [] : {};
  for (let key in o) {
      let v = o[key];
      out[key] = (typeof v === "object" && v !== null) ? deepCopy(v) : v;
  }
  return out;
};

/**
 * This class can used as a singleton to store values into a shared state between various application components.
 * The state is immutable, that mean nobody can't change its content. The only way is to send a message with the method {@link GlobalStore.send}
 * 
 * This is an implementation of the Flux pattern design introduced by Facebook. Here we use RxJS under the hood to implement it.
 * (there are other implementations, more complex, like [Facebook Flux](https://facebook.github.io/flux/), [Redux](http://redux.js.org/))
*/
export default class GlobalStore  {    
  constructor() {    
    this.isActive = false;

	/**
	 * The output bus. Application components will subscribe to it.
	 * We send notification on it.
	 * @private
	 * @type {Rx.Observable}
	 */	 
    this.outputBus = new Observable( 
      (obs) => {
        /**
         * The output observer. Used to send event to the output bus
        * @private
        * @type {Rx.Observer}
        */
        this.outputObserver = obs;
      },
      (err) => {
        console.error("Store "+this.constructor.name+" Error:"+err);
      },
      () => {
        console.log("%c Store "+this.constructor.name+" Terminated", 'background: #222; color: #ff0000');
      }
    )
    .pipe(publish());
    
    // The output bus have to be Hot
    // (one single stream for all subscribers)
    this.outputBus.connect();    
    
	  this.state = {};
  }  
  /**
   * Subscribe to an update of the state
   * 
   * @param {String} path - path where to store the value ("a.b.c" or "a.*" are allowed)
   * @param {Function} onUpdate - callback that will be called when the state is updated. It will receive the path in parameter, not the value. Use get for that.
   * @return {AutoDetachObserver} - object to use to unsubscribe
   * @memberOf GlobalState
   */
  subscribe(path,onUpdate)
  {
    if (!path)
      throw new Error("You can't pass an empty path to subscribe");

    let subscribeCallBack = function(p)
    {
      if (onUpdate)
      {
        try
        {
          onUpdate(p);
        }
        catch (error)
        {
          console.error("Unexpected error in GlobalState notification ("+p+"): "+error);          
        }
      }
    };

    if (path.endsWith(".*"))
    {
      let subscribePath = path.substr(path,path.length-1);
  	  return this.outputBus.pipe(filter(updatePath=>updatePath.startsWith(subscribePath)))
	  				.subscribe(subscribeCallBack);
    }
    else
    {
      return this.outputBus.pipe(filter(updatePath=>updatePath === path))
	  				.subscribe(subscribeCallBack);
    }
  }  
  /**
   * Callback called when a new update comes from the application
   * @private
   * @param {Function} update - callback that will be called when the state is updated
   */
  onValue(update)
  {
    console.log(`GlobalState receive: ${update.path},${update.value}`);
    
    let s = this.state;
    let path = update.path.split('.');
    path.forEach((f,idx)=> {
          if (idx!==path.length-1)
          {
            if (s[f]===undefined)
            {
              s[f] = {};
            }
            s = s[f];
          }
          else
          {
            s[f] = update.value;
          }
        }
      );
    if (this.outputObserver.isStopped)
    {
      throw new Error("Unable to send. The store "+this.constructor.name+" is dead due to previous errors.");
    }
    // Rx does not allow more than one parameter to onNext, so we just send the property name that changed
    try
    {      
      this.outputObserver.next(update.path);
    }
    catch (error)
    {
      console.error("Unexpected error in GlobalState notification ("+update.path+"): "+error);
    }
  }
  /**
   * send an update event to the input Bus
   * @param {String} path - where to store the value
   * @param {Object} value - the value to store
   */  
  send(path,value)
  {
    if (!path)
      throw new Error("path must be set");
      
    this.onValue({path:path,value:value});
  }   
  /**
   * Retreive a value from the immutable state.
   * We make the difference between a value present equal to **null** and
   * a value not present. In this case it return **undefined**
   * 
   * @param {String} path - where to get the value
   * @return {Object} - the value or **undefined** if it does not exists
   */   
  get(path)
  {
    if (!path)
      throw new Error("You can't pass an empty path to get() method");
   
    let p = path.split('.');
    let value = p.reduce((prev,current,idx)=>(prev?prev[current]:undefined),this.state);

    // deep clone to keep our state protected
    return deepCopy(value); 
  }
}


