import GlobalStore from './common/GlobalStore';

class MyAppStore extends GlobalStore {
    constructor() {
        super();
       
    }

    updateModel(data)
    {
        this.send("model",data);
    }

    get model()
    {
        return this.get("model");
    }
}

/**
 * Singleton pattern
 */
export default new MyAppStore();